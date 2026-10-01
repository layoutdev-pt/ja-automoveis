import { contacts, copy, hours } from './data';
import { revealDelay, type OpenStatus } from './hooks';
import { ArrowUpRight } from './icons';

/**
 * Contactos em grelha "bento": cartões de tamanhos diferentes lado a lado.
 * Telefone (grande) · WhatsApp (azul) · Email · Morada · Horário (alto)
 */
export function Contact({ status }: { status: OpenStatus | null }) {
  const { phone, whatsapp, email, address } = contacts;

  return (
    <section className="contact" id="contacto" aria-labelledby="bio-contact-title">
      <div className="contact__head">
        <p className="eyebrow" data-reveal>
          {copy.contact.eyebrow}
        </p>
        <h2 className="contact__title" id="bio-contact-title" data-reveal style={revealDelay(80)}>
          {copy.contact.title}
        </h2>
      </div>

      <div className="bento">
        <a className="tile tile--phone" href={phone.href} data-reveal style={revealDelay(120)}>
          <span className="tile__top">
            <span className="tile__icon" data-icon="phone" aria-hidden="true" />
            <ArrowUpRight className="tile__arrow" />
          </span>
          <span className="tile__body">
            <span className="tile__label">
              Telefone <span className="tile__prefix">{phone.prefix}</span>
            </span>
            <span className="tile__big">{phone.number}</span>
            <span className="tile__note">{phone.note}</span>
          </span>
        </a>

        <a
          className="tile tile--whatsapp"
          href={whatsapp.href}
          target="_blank"
          rel="noopener"
          data-reveal
          style={revealDelay(190)}
        >
          <span className="tile__top">
            <span className="tile__icon" data-icon="whatsapp" aria-hidden="true" />
            <ArrowUpRight className="tile__arrow" />
          </span>
          <span className="tile__body">
            <span className="tile__label">WhatsApp</span>
            <span className="tile__value tile__value--lg">Enviar mensagem</span>
          </span>
        </a>

        <a className="tile tile--email tile--row" href={email.href} data-reveal style={revealDelay(260)}>
          <span className="tile__icon" data-icon="email" aria-hidden="true" />
          <span className="tile__body">
            <span className="tile__label">Email</span>
            <span className="tile__value">{email.display}</span>
          </span>
          <ArrowUpRight className="tile__arrow" />
        </a>

        <a
          className="tile tile--address tile--row"
          href={address.mapsUrl}
          target="_blank"
          rel="noopener"
          data-reveal
          style={revealDelay(330)}
        >
          <span className="tile__icon" data-icon="address" aria-hidden="true" />
          <span className="tile__body">
            <span className="tile__label">Morada</span>
            <span className="tile__value">
              {address.lines.map((line, i) => (
                <span key={line}>
                  {i > 0 && ' '}
                  {/* Só o código postal + localidade ficam sempre juntos */}
                  <span className={i === address.lines.length - 1 ? 'nowrap' : undefined}>
                    {line}
                    {i < address.lines.length - 1 ? ',' : ''}
                  </span>
                </span>
              ))}
            </span>
          </span>
          <ArrowUpRight className="tile__arrow" />
        </a>

        <div className="tile tile--hours" data-reveal style={revealDelay(260)}>
          <h3 className="tile__label">Horário</h3>

          <div className={`hours__now${status ? '' : ' is-pending'}`} data-open={status?.open ? 'true' : 'false'}>
            <span className="hours__state">
              <span className="hours__dot" aria-hidden="true" />
              <span>{status?.label ?? 'Horário'}</span>
            </span>
            <span className="hours__detail">{status?.detail ?? ''}</span>
          </div>

          <dl className="hours__list">
            {hours.map((row) => (
              <div
                className={`hours__row${status && row.days.includes(status.day) ? ' is-today' : ''}`}
                key={row.label}
              >
                <dt>
                  {row.label}
                  <span className="hours__today">Hoje</span>
                </dt>
                <dd>
                  <time>{row.open}</time>
                  <span className="hours__dash" aria-hidden="true" />
                  <span className="sr-only">às</span>
                  <time>{row.close}</time>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
