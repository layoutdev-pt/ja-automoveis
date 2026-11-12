/**
 * Apaga do bucket `vehicle_images` os ficheiros que nenhuma viatura usa
 * (originais já convertidos, fotos substituídas em edições antigas, uploads falhados…).
 *
 * Uso:
 *   npm run images:cleanup               → simulação (só lista o que seria apagado)
 *   npm run images:cleanup -- --apply    → apaga mesmo
 *
 * Segurança:
 *   - Um ficheiro só é apagado se não aparecer em `vehicles.fotos` nem em `fotos_meta[].masterUrl`.
 *   - Ficheiros com menos de 24 h nunca são apagados (podem pertencer a uma viatura a ser gravada agora).
 *   - Se não conseguir ler as viaturas, pára sem apagar nada.
 *
 * Requer no .env: SUPABASE_SECRET_KEY=sb_secret_...
 */
import { createClient } from '@supabase/supabase-js';
import { loadEnv } from './lib.mjs';

const BUCKET = 'vehicle_images';
const MIN_AGE_MS = 24 * 60 * 60 * 1000;
const APPLY = process.argv.includes('--apply');

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SECRET_KEY = env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SECRET_KEY?.startsWith('sb_secret_')) {
  console.error('Faltam VITE_SUPABASE_URL e/ou SUPABASE_SECRET_KEY (sb_secret_...) no .env.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false } });
const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
const MB = (b) => `${(b / 1048576).toFixed(1)} MB`;

const toPath = (url) =>
  typeof url === 'string' && url.startsWith(PUBLIC_PREFIX)
    ? decodeURIComponent(url.slice(PUBLIC_PREFIX.length).split('?')[0])
    : null;

// 1. Ficheiros em uso
const { data: vehicles, error } = await supabase.from('vehicles').select('fotos, fotos_meta');
if (error || !vehicles) {
  console.error('Erro ao obter viaturas — nada foi apagado.', error?.message);
  process.exit(1);
}
const used = new Set();
for (const v of vehicles) {
  for (const u of v.fotos || []) used.add(toPath(u));
  for (const m of Array.isArray(v.fotos_meta) ? v.fotos_meta : []) used.add(toPath(m?.masterUrl));
}
used.delete(null);

// 2. Todos os ficheiros do bucket (com paginação e subpastas)
async function listAll(prefix = '') {
  const files = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error: lErr } = await supabase.storage
      .from(BUCKET)
      .list(prefix, { limit: 1000, offset, sortBy: { column: 'name', order: 'asc' } });
    if (lErr) throw lErr;
    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) files.push(...(await listAll(path))); // pasta
      else files.push({ path, size: item.metadata?.size || 0, created: new Date(item.created_at).getTime() });
    }
    if (data.length < 1000) break;
  }
  return files;
}
const files = await listAll();

// 3. Órfãos
const now = Date.now();
const orphans = files.filter((f) => !used.has(f.path) && !f.path.endsWith('.emptyFolderPlaceholder'));
const recent = orphans.filter((f) => now - f.created < MIN_AGE_MS);
const toDelete = orphans.filter((f) => now - f.created >= MIN_AGE_MS);
const sum = (arr) => arr.reduce((a, f) => a + f.size, 0);

console.log(`Bucket:        ${files.length} ficheiros, ${MB(sum(files))}`);
console.log(`Em uso:        ${used.size} ficheiros (${vehicles.length} viaturas)`);
console.log(`Não usados:    ${orphans.length} ficheiros, ${MB(sum(orphans))}`);
if (recent.length) console.log(`  (${recent.length} com menos de 24 h ficam de fora)`);
console.log(`A apagar:      ${toDelete.length} ficheiros, ${MB(sum(toDelete))}\n`);

for (const f of toDelete.slice(0, 15)) console.log(`  - ${f.path} (${MB(f.size)})`);
if (toDelete.length > 15) console.log(`  … e mais ${toDelete.length - 15}`);

if (!APPLY) {
  console.log('\nSimulação: nada foi apagado. Corra com --apply para apagar.');
  process.exit(0);
}

let deleted = 0;
for (let i = 0; i < toDelete.length; i += 100) {
  const batch = toDelete.slice(i, i + 100).map((f) => f.path);
  const { data, error: rmErr } = await supabase.storage.from(BUCKET).remove(batch);
  if (rmErr) console.warn(`! Erro ao apagar lote: ${rmErr.message}`);
  else deleted += data.length;
}
console.log(`\nApagados ${deleted} ficheiros (${MB(sum(toDelete))}).`);
