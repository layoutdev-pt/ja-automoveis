import { ExperienceCard } from './ExperienceCard';
import { LocationCard } from './LocationCard';
import { SupportCard } from './SupportCard';

export function Highlights() {
  return (
    <section className="highlights" aria-label="Sobre a JA Automóveis">
      <LocationCard delay={0} />
      <ExperienceCard delay={110} />
      <SupportCard delay={220} />
    </section>
  );
}
