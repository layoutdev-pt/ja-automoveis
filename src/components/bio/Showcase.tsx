import { Link } from 'react-router-dom';
import { Button } from './Button';
import { copy, routes } from './data';
import { revealDelay } from './hooks';
import { ArrowRight, Car } from './icons';
import { LaptopMockup } from './LaptopMockup';

export function Showcase() {
  const c = copy.showcase;
  return (
    <section className="showcase" id="site" aria-labelledby="bio-showcase-title">
      <div className="showcase__text">
        <p className="eyebrow" data-reveal>
          {c.eyebrow}
        </p>
        <h2 className="showcase__title" id="bio-showcase-title" data-reveal style={revealDelay(80)}>
          {c.title}
        </h2>
        <p className="showcase__lead" data-reveal style={revealDelay(160)}>
          {c.text}
        </p>

        {/* Destaque: leva diretamente às viaturas (página do stand) */}
        <Link className="highlight" to={routes.stand} data-reveal style={revealDelay(220)}>
          <span className="highlight__icon" aria-hidden="true">
            <Car />
          </span>
          <span className="highlight__text">{c.highlight}</span>
          <span className="highlight__arrow" aria-hidden="true">
            <ArrowRight />
          </span>
        </Link>

        <div className="showcase__ctas" data-reveal style={revealDelay(280)}>
          <Button to={routes.home} variant="primary" icon="external">
            {c.primaryCta}
          </Button>
          <Button to="#contacto" variant="ghost" icon="arrow-down">
            {c.secondaryCta}
          </Button>
        </div>
      </div>

      <div className="showcase__visual" data-reveal style={revealDelay(120)}>
        <LaptopMockup />
      </div>
    </section>
  );
}
