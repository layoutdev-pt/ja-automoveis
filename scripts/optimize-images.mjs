/**
 * Converte as imagens das viaturas já guardadas no Supabase para WebP ≤ 1080p.
 *
 * As imagens novas já são convertidas no painel admin antes do upload
 * (src/lib/imageOptimize.ts); este script trata das antigas (JPG/PNG/WebP gigantes).
 *
 * Uso:
 *   npm run images:optimize                  → simulação (não altera nada, só mostra o que faria)
 *   npm run images:optimize -- --apply       → converte, faz upload e atualiza a tabela `vehicles`
 *   npm run images:optimize -- --apply --delete-old
 *                                            → idem, e apaga os ficheiros originais do bucket
 *
 * Requer no .env (nunca com prefixo VITE_, para não ir parar ao browser):
 *   SUPABASE_SERVICE_ROLE_KEY=...            (Supabase → Project Settings → API → service_role)
 */
import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './lib.mjs';

const BUCKET = 'vehicle_images';
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const WEBP_QUALITY = 82;
const VIDEO_RE = /\.(mp4|webm|ogg|mov|m4v)$/i;

const args = new Set(process.argv.slice(2));
const APPLY = args.has('--apply');
const DELETE_OLD = args.has('--delete-old');

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Faltam VITE_SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no .env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`;

/** Caminho do ficheiro dentro do bucket, ou null se o URL não for deste bucket. */
const storagePath = (url) => {
  if (typeof url !== 'string' || !url.startsWith(PUBLIC_PREFIX)) return null;
  return decodeURIComponent(url.slice(PUBLIC_PREFIX.length).split('?')[0]);
};

/** Cache url antigo → url novo (o mesmo ficheiro pode ser master e crop ao mesmo tempo). */
const converted = new Map();
const stats = { checked: 0, converted: 0, skipped: 0, failed: 0, before: 0, after: 0 };
const oldPaths = new Set();

async function optimizeUrl(url) {
  if (converted.has(url)) return converted.get(url);

  const path = storagePath(url);
  if (!path || VIDEO_RE.test(path)) {
    converted.set(url, url);
    return url;
  }

  stats.checked++;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const input = Buffer.from(await res.arrayBuffer());
    const meta = await sharp(input).metadata();

    const alreadyOk = meta.format === 'webp' && meta.width <= MAX_WIDTH && meta.height <= MAX_HEIGHT;
    if (alreadyOk) {
      stats.skipped++;
      converted.set(url, url);
      return url;
    }

    const output = await sharp(input)
      .rotate() // aplica a orientação EXIF antes de a remover
      .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY, effort: 5 })
      .toBuffer({ resolveWithObject: true });

    const base = path.replace(/\.[^./]+$/, '');
    const newPath = `${base}_opt.webp`;
    stats.converted++;
    stats.before += input.length;
    stats.after += output.data.length;

    console.log(
      `  ${path} (${meta.format} ${meta.width}×${meta.height}, ${kb(input.length)})` +
      ` → ${newPath} (${output.info.width}×${output.info.height}, ${kb(output.data.length)})`,
    );

    if (!APPLY) {
      converted.set(url, url);
      return url;
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(newPath, output.data, { contentType: 'image/webp', cacheControl: '31536000', upsert: true });
    if (error) throw error;

    const newUrl = supabase.storage.from(BUCKET).getPublicUrl(newPath).data.publicUrl;
    converted.set(url, newUrl);
    oldPaths.add(path);
    return newUrl;
  } catch (err) {
    stats.failed++;
    console.warn(`  ! Falhou ${path}: ${err.message}`);
    converted.set(url, url); // mantém o original em caso de erro
    return url;
  }
}

const { data: vehicles, error } = await supabase.from('vehicles').select('id, marca, modelo, fotos, fotos_meta');
if (error) {
  console.error('Erro ao obter viaturas:', error.message);
  process.exit(1);
}

console.log(`${APPLY ? 'A CONVERTER' : 'SIMULAÇÃO (use --apply para gravar)'} — ${vehicles.length} viaturas\n`);

let vehiclesUpdated = 0;
for (const v of vehicles) {
  console.log(`${v.marca} ${v.modelo} [${v.id}]`);
  const fotos = v.fotos || [];
  const fotosMeta = Array.isArray(v.fotos_meta) ? v.fotos_meta : [];

  const newFotos = [];
  for (const url of fotos) newFotos.push(await optimizeUrl(url));

  const newMeta = [];
  for (const m of fotosMeta) {
    newMeta.push(m && m.masterUrl ? { ...m, masterUrl: await optimizeUrl(m.masterUrl) } : m);
  }

  const changed =
    newFotos.some((u, i) => u !== fotos[i]) ||
    newMeta.some((m, i) => m?.masterUrl !== fotosMeta[i]?.masterUrl);

  if (APPLY && changed) {
    const { error: upErr } = await supabase
      .from('vehicles')
      .update({ fotos: newFotos, fotos_meta: v.fotos_meta == null ? v.fotos_meta : newMeta })
      .eq('id', v.id);
    if (upErr) {
      console.warn(`  ! Erro ao atualizar a viatura: ${upErr.message}`);
      // Não apagar os originais desta viatura se a BD não foi atualizada.
      for (const u of [...fotos, ...fotosMeta.map(m => m?.masterUrl)]) {
        const p = storagePath(u);
        if (p) oldPaths.delete(p);
      }
    } else {
      vehiclesUpdated++;
    }
  }
}

if (APPLY && DELETE_OLD && oldPaths.size > 0) {
  const paths = [...oldPaths];
  for (let i = 0; i < paths.length; i += 100) {
    const { error: rmErr } = await supabase.storage.from(BUCKET).remove(paths.slice(i, i + 100));
    if (rmErr) console.warn(`! Erro ao apagar originais: ${rmErr.message}`);
  }
  console.log(`\nOriginais apagados: ${paths.length}`);
}

const saved = stats.before - stats.after;
console.log(`
Imagens verificadas: ${stats.checked}
Convertidas:         ${stats.converted}
Já otimizadas:       ${stats.skipped}
Falhas:              ${stats.failed}
Tamanho:             ${kb(stats.before)} → ${kb(stats.after)} (poupança ${kb(saved)}${stats.before ? `, ${Math.round((saved / stats.before) * 100)}%` : ''})
${APPLY ? `Viaturas atualizadas: ${vehiclesUpdated}` : 'Nada foi alterado. Corra com --apply para aplicar.'}`);
