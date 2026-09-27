import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE_URL, STATIC_ROUTES, fetchSeoData, slugify } from './lib.mjs';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const urlEntry = ({ loc, lastmod, changefreq, priority }) =>
  [
    '  <url>',
    `    <loc>${esc(SITE_URL + loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority !== undefined ? `    <priority>${priority.toFixed(1)}</priority>` : null,
    '  </url>',
  ].filter(Boolean).join('\n');

const today = new Date().toISOString().split('T')[0];

const { vehicles, marcas } = await fetchSeoData();

const entries = [
  ...STATIC_ROUTES.map(r => ({ loc: r.path, lastmod: today, changefreq: r.changefreq, priority: r.priority })),

  // Landing pages de filtro indexáveis (uma por marca em stock)
  ...marcas.map(m => ({
    loc: `/stand/marca/${slugify(m)}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.7,
  })),

  // Páginas de viatura (apenas as que estão em stock)
  ...vehicles.filter(v => v.em_stock).map(v => ({
    loc: `/stand/${v.id}`,
    lastmod: (v.created_at || today).split('T')[0],
    changefreq: 'weekly',
    priority: 0.8,
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(urlEntry).join('\n')}
</urlset>
`;

const out = path.join(ROOT, 'public', 'sitemap.xml');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, xml, 'utf-8');

console.log(`[sitemap] ${entries.length} URLs -> public/sitemap.xml`);
