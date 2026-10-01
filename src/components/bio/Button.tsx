import type { MouseEvent, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUpRight } from './icons';

type ButtonProps = {
  /** Rota interna ("/", "/stand") ou âncora na página ("#contacto"). */
  to: string;
  variant?: 'primary' | 'ghost';
  icon?: 'external' | 'arrow-down' | 'none';
  children: ReactNode;
};

/** Scroll suave para uma âncora da própria página (sem passar pelo router). */
const scrollToHash = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
  const target = document.getElementById(hash.slice(1));
  if (!target) return;
  e.preventDefault();
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
};

export function Button({ to, variant = 'primary', icon = 'none', children }: ButtonProps) {
  const className = `btn btn--${variant}`;
  const content = (
    <>
      <span className="btn__label">{children}</span>
      {icon !== 'none' && (
        <span className={`btn__icon btn__icon--${icon}`} aria-hidden="true">
          {icon === 'external' ? <ArrowUpRight /> : <ArrowDown />}
        </span>
      )}
    </>
  );

  if (to.startsWith('#')) {
    return (
      <a className={className} href={to} onClick={(e) => scrollToHash(e, to)}>
        {content}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {content}
    </Link>
  );
}
