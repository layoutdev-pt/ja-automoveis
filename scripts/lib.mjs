import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SITE_URL = 'https://jaautomoveis.pt';

/** Lê as variáveis VITE_* do .env sem dependências externas. */
export function loadEnv() {
  const out = { ...process.env };
  for (const file of ['.env.local', '.env']) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf-8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!m) continue;
      const key = m[1];
      if (out[key]) continue;
      out[key] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

/** Rotas estáticas a pré-renderizar. */
export const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/stand', changefreq: 'daily', priority: 0.9 },
  { path: '/importacao', changefreq: 'monthly', priority: 0.8 },
  { path: '/sobre', changefreq: 'yearly', priority: 0.6 },
  { path: '/contactos', changefreq: 'yearly', priority: 0.7 },
  { path: '/politica-privacidade', changefreq: 'yearly', priority: 0.2 },
  { path: '/termos-condicoes', changefreq: 'yearly', priority: 0.2 },
  { path: '/cookies', changefreq: 'yearly', priority: 0.2 },
];

/** Marcas usadas para gerar as landing pages de filtro indexáveis. */
export async function fetchSeoData() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[seo] Variáveis Supabase em falta — a continuar sem dados dinâmicos.');
    return { vehicles: [], marcas: [] };
  }

  const supabase = createClient(url, key);

  const { data: vehicles, error: vErr } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (vErr) {
    console.warn('[seo] Falha ao obter viaturas:', vErr.message);
    return { vehicles: [], marcas: [] };
  }

  const marcas = [...new Set((vehicles || []).filter(v => v.em_stock).map(v => v.marca).filter(Boolean))];

  return { vehicles: vehicles || [], marcas };
}

export const slugify = (s) =>
  String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
