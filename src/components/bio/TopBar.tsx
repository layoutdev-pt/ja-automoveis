import { location } from './data';
import { revealDelay, type OpenStatus } from './hooks';
import { PinOutline } from './icons';

export function TopBar({ status }: { status: OpenStatus | null }) {
  return (
    <header className="topbar" data-reveal style={revealDelay(60)}>
      <div className={`status${status ? '' : ' is-pending'}`} data-open={status?.open ? 'true' : 'false'}>
        <span className="status__dot" aria-hidden="true" />
        <span className="status__label">{status?.label ?? 'Horário'}</span>
        <span className="status__sep" aria-hidden="true">
          ·
        </span>
        <span className="status__detail">{status?.detail ?? ''}</span>
      </div>

      <div className="where">
        <PinOutline />
        <span className="where__city">{location.city}, PT</span>
        <span className="where__time">
          <span className="sr-only">Hora local: </span>
          {status?.time ?? '--:--'}
        </span>
      </div>
    </header>
  );
}
