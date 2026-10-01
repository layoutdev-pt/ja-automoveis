import { Card } from './Card';
import { User } from './icons';

/** "Acompanhamento personalizado" — versão tipográfica (opção A). */
export function SupportCard({ delay = 0 }: { delay?: number }) {
  return (
    <Card className="support" delay={delay}>
      <span className="chip" aria-hidden="true">
        <User />
      </span>
      <h2 className="type">
        <span className="type__big">Acompanhamento</span>
        <span className="type__small">
          personalizado
          <span className="type__line" aria-hidden="true" />
        </span>
      </h2>
    </Card>
  );
}
