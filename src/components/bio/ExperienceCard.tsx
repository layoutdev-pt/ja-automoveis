import type { CSSProperties } from 'react';
import { Card } from './Card';

const letters = 'ANOS'.split('');

export function ExperienceCard({ delay = 0 }: { delay?: number }) {
  return (
    <Card className="experience" delay={delay}>
      {/* Linha do tempo: dispara, trava e pára; o marcador azul é o "agora" */}
      <div className="ruler" aria-hidden="true">
        <div className="ruler__track" />
        <div className="ruler__past">
          <div className="ruler__past-track" />
        </div>
        <span className="ruler__now" />
      </div>

      <h2 className="experience__title">
        <span className="sr-only">Anos de experiência no setor</span>
        <span className="big" aria-hidden="true">
          {letters.map((l, i) => (
            <span className="big__mask" key={i}>
              <span className="big__l" style={{ '--i': i } as CSSProperties}>
                {l}
              </span>
            </span>
          ))}
        </span>
        <span className="experience__sub" aria-hidden="true">
          de experiência no setor
        </span>
      </h2>
    </Card>
  );
}
