import type { PointerEvent, ReactNode } from 'react';
import { revealDelay } from './hooks';

type CardProps = {
  className: string;
  /** Se definido, o cartão é um link externo (abre num separador novo). */
  href?: string;
  label?: string;
  delay?: number;
  children: ReactNode;
};

/** Luz subtil que segue o cursor (o CSS só a mostra com rato). */
const followPointer = (e: PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
};

export function Card({ className, href, label, delay = 0, children }: CardProps) {
  // A className é estática: o "is-in" é acrescentado pelo useReveal e não pode ser sobrescrito.
  const common = {
    className: `card ${className}${href ? ' card--link' : ''}`,
    'data-reveal': true,
    style: revealDelay(delay),
    onPointerMove: followPointer,
  };

  return href ? (
    <a {...common} href={href} target="_blank" rel="noopener" aria-label={label}>
      {children}
    </a>
  ) : (
    <article {...common}>{children}</article>
  );
}
