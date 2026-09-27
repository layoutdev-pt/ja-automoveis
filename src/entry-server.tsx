import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';

// Força o modo servidor do react-helmet-async: sem isto, a v3 delega no
// dispatcher do React 19, que embute as tags no corpo em vez de as recolher
// no helmetContext (e partir a hidratação se as movermos depois).
(HelmetProvider as unknown as { canUseDOM: boolean }).canUseDOM = false;
import App from './App';
import './lib/ssrData';

export interface RenderResult {
  html: string;
  head: string;
}

/**
 * Renderiza uma rota para HTML estático no momento do build.
 * `initialData` é exposto em globalThis para que os componentes possam
 * pré-popular estado sem depender de useEffect (que não corre em SSR).
 */
export function render(url: string, initialData?: unknown): RenderResult {
  if (initialData !== undefined) {
    globalThis.__SSR_DATA__ = initialData;
  }

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );

  const { helmet } = helmetContext;
  const head = helmet
    ? [
        helmet.title.toString(),
        helmet.meta.toString(),
        helmet.link.toString(),
        helmet.script.toString(),
      ]
        .filter(Boolean)
        .join('\n    ')
    : '';

  globalThis.__SSR_DATA__ = undefined;

  return { html, head };
}
