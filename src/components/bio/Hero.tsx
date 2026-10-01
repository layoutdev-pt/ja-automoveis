import { useEffect, useState, type CSSProperties } from 'react';
import { brand } from './data';
import type { OpenStatus } from './hooks';
import logoTile from './assets/ja-logo-tile.webp';

type HeroProps = {
  status: OpenStatus | null;
  /** O biosite já está montado no cliente (ativa os estados iniciais das animações). */
  armed: boolean;
  /** O portão da abertura abriu: começa a entrada do hero. */
  ready: boolean;
};

const words = brand.name.split(' ');

export function Hero({ status, armed, ready }: HeroProps) {
  // Depois do primeiro reflexo de luz, o hover pode repeti-lo.
  const [shined, setShined] = useState(false);
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setShined(true), 4200);
    return () => window.clearTimeout(t);
  }, [ready]);

  const className = ['hero', armed && 'is-armed', ready && 'is-ready', shined && 'is-shined']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={className} aria-labelledby="bio-hero-title">
      <div className="hero__light" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="hero__inner">
        {/* "Stand" em segundo plano com o logótipo meio por cima */}
        <div className="lockup">
          <span className="ghost" aria-hidden="true" data-hero-step="1">
            Stand
          </span>
          <div className="logo" data-hero-step="2">
            <img className="logo__img" src={logoTile} alt="Logótipo JA Automóveis" width={132} height={132} />
            <span
              className={`logo__status${status ? '' : ' is-pending'}`}
              data-open={status?.open ? 'true' : 'false'}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="name">
          <h1 className="name__title" id="bio-hero-title">
            <span className="sr-only">{brand.name}</span>
            <span className="name__base" aria-hidden="true">
              {words.map((w, i) => (
                <span className="word" key={w} style={{ '--i': i } as CSSProperties}>
                  <span className="word__in">{w}</span>
                </span>
              ))}
            </span>
          </h1>
          <span className="name__shine" aria-hidden="true">
            {words.map((w) => (
              <span className="word" key={w}>
                <span className="word__in">{w}</span>
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
