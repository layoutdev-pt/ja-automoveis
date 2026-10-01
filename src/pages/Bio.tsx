import { useEffect, useRef } from 'react';
import { GarageDoorSplash } from '../components/ui/GarageDoorSplash';
import { BioFooter } from '../components/bio/BioFooter';
import { Contact } from '../components/bio/Contact';
import { SPLASH_OPEN_MS } from '../components/bio/data';
import { Hero } from '../components/bio/Hero';
import { Highlights } from '../components/bio/Highlights';
import { useAfter, useMounted, useOpenStatus, useReveal } from '../components/bio/hooks';
import { Showcase } from '../components/bio/Showcase';
import { TopBar } from '../components/bio/TopBar';
import '../components/bio/bio.css';

/**
 * Biosite JA Automóveis (/biosite): página de entrada para quem chega das redes sociais.
 * Independente do layout do site (sem Header/Footer/WhatsAppButton).
 * Todos os estilos vivem em components/bio/bio.css, dentro de .ja-bio.
 */
export function Bio() {
  const rootRef = useRef<HTMLDivElement>(null);
  // Só no cliente: ativa os estados iniciais das animações (no SSR fica tudo visível).
  const armed = useMounted();
  // A entrada começa quando o portão do GarageDoorSplash abre.
  const opened = useAfter(SPLASH_OPEN_MS);
  const status = useOpenStatus();
  useReveal(rootRef, opened);

  // Fundo escuro no documento enquanto o biosite está aberto (evita "flashes" claros no scroll).
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = {
      html: html.style.backgroundColor,
      body: body.style.backgroundColor,
      title: document.title,
    };
    html.style.backgroundColor = '#0a0a0a';
    body.style.backgroundColor = '#0a0a0a';
    document.title = 'JA Automóveis — Covilhã';
    return () => {
      html.style.backgroundColor = previous.html;
      body.style.backgroundColor = previous.body;
      document.title = previous.title;
    };
  }, []);

  return (
    <>
      {/* A mesma abertura do site, mas em todos os carregamentos do biosite */}
      <GarageDoorSplash forcePlay />

      <div ref={rootRef} className={`ja-bio${armed ? ' is-armed' : ''}`}>
        <a className="skip-link" href="#bio-conteudo">
          Saltar para o conteúdo
        </a>
        <div className="guides" aria-hidden="true" />

        <div className="frame">
          <TopBar status={status} />
          <div className="divider" aria-hidden="true" />

          <main id="bio-conteudo">
            <Hero status={status} armed={armed} ready={opened} />
            <Highlights />
            <div className="divider" aria-hidden="true" />
            <Showcase />
            <div className="divider" aria-hidden="true" />
            <Contact status={status} />
          </main>

          <div className="divider" aria-hidden="true" />
          <BioFooter />
        </div>
      </div>
    </>
  );
}
