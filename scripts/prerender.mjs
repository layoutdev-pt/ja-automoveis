import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, STATIC_ROUTES, fetchSeoData, slugify } from './lib.mjs';

const DIST = path.join(ROOT, 'dist');

// Placeholders %VITE_*% que o Vite não substituiu (variável não definida)
// são removidos com a respetiva tag, para não publicar marcadores literais.
const template = fs
  .readFileSync(path.join(DIST, 'index.html'), 'utf-8')
  .replace(/\s*<meta\b[^>]*content="%VITE_[A-Z0-9_]+%"[^>]*>/gi, '');
// pathToFileURL é obrigatório no Windows: o loader ESM rejeita caminhos "F:\...".
const { render } = await import(pathToFileURL(path.join(DIST, 'server', 'entry-server.js')).href);

if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('index.html não contém os marcadores <!--app-html--> / <!--app-head-->.');
}

const { vehicles, marcas } = await fetchSeoData();
const inStock = vehicles.filter(v => v.em_stock);

const routes = [
  ...STATIC_ROUTES.map(r => ({ url: r.path, data: { vehicles: inStock } })),
  ...marcas.map(m => ({
    url: `/stand/marca/${slugify(m)}`,
    data: { vehicles: inStock.filter(v => slugify(v.marca) === slugify(m)) },
  })),
  ...inStock.map(v => ({ url: `/stand/${v.id}`, data: { vehicle: v } })),
  // Biosite: pré-renderizado, mas fora do sitemap (página de entrada das redes sociais).
  { url: '/biosite', data: {} },
  { url: '/404', data: {}, out: '404.html' },
];

/**
 * O React 19 faz hoisting nativo de <title>/<meta>/<link>, pelo que o
 * react-helmet-async delega nele e o helmetContext fica vazio em renderToString:
 * as tags saem embutidas no corpo. Aqui extraímo-las do corpo e devolvemo-las
 * ao <head>, que é o único sítio onde canonical e robots são respeitados.
 */
function hoistHead(html) {
  const collected = [];

  // Marca cada tag movida: o cliente remove-as antes de hidratar, para que o
  // React passe a ser o dono exclusivo do <head> e as substitua corretamente
  // em cada navegação (sem canonical/robots duplicados ou obsoletos).
  const mark = (tag) =>
    tag.replace(/^<([a-z]+)/i, (_m, name) => `<${name} data-ssr-head=""`);

  const take = (regex) => {
    html = html.replace(regex, (match) => {
      collected.push(mark(match));
      return '';
    });
  };

  // Só elementos que o React 19 trata como "hoistable" podem ser movidos:
  // durante a hidratação ele reconcilia-os a partir do <head>.
  take(/<title[^>]*>[\s\S]*?<\/title>/i);
  take(/<meta\b(?=[^>]*\b(?:name|property|http-equiv)=)[^>]*\/?>/gi);
  take(/<link\b(?=[^>]*\brel=["'](?:canonical|alternate|preload|preconnect)["'])[^>]*\/?>/gi);

  // O JSON-LD FICA no corpo: <script type="application/ld+json"> não é
  // hoistable no React 19 e removê-lo quebra a hidratação (erro #418).
  // O Google lê JSON-LD em qualquer ponto do documento, incluindo o <body>.

  return { head: collected.join('\n    '), html };
}

let ok = 0;
let failed = 0;

for (const route of routes) {
  try {
    const rendered = render(route.url, route.data);
    const { head: hoisted, html } = hoistHead(rendered.html);
    const head = [rendered.head, hoisted].filter(Boolean).join('\n    ');

    // Com head próprio, as tags de fallback do template são redundantes:
    // removemo-las para não duplicar <title>/<meta name="description">.
    const base = head
      ? template.replace(/\s*<(?:title|meta|link)\b[^>]*\bdata-fallback-head\b[^>]*>(?:[\s\S]*?<\/title>)?/gi, '')
      : template;

    const page = base
      .replace('<!--app-head-->', head)
      .replace('<!--app-html-->', html)
      .replace(
        '</body>',
        `  <script>window.__SSR_DATA__=${JSON.stringify(route.data).replace(/</g, '\\u003c')}</script>\n  </body>`,
      );

    const outFile = route.out
      ? path.join(DIST, route.out)
      : path.join(DIST, route.url === '/' ? 'index.html' : `${route.url}/index.html`);

    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, page, 'utf-8');
    ok++;
  } catch (err) {
    failed++;
    console.error(`[prerender] FALHOU ${route.url}:`, err.message);
  }
}

// Shell SPA para viaturas adicionadas após o build (IDs ainda não pré-renderizados).
fs.writeFileSync(
  path.join(DIST, 'stand-fallback.html'),
  template.replace('<!--app-head-->', '').replace('<!--app-html-->', ''),
  'utf-8',
);

// O bundle de servidor não deve ser publicado.
fs.rmSync(path.join(DIST, 'server'), { recursive: true, force: true });

console.log(`[prerender] ${ok} páginas geradas${failed ? `, ${failed} falhas` : ''}.`);
if (failed) process.exit(1);
