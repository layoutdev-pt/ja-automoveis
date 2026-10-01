import { Link } from 'react-router-dom';
import { brand, credits, routes } from './data';
import { ArrowUpRight } from './icons';
import logoRound from './assets/ja-logo-round.webp';

export function BioFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__brand">
        <img className="footer__logo" src={logoRound} alt="" width={28} height={28} />
        <span>{brand.name}</span>
      </div>
      <div className="footer__meta">
        <p>
          © {year} {brand.name}
        </p>
        <p>
          Desenvolvido por{' '}
          <a className="footer__credit" href={credits.url} target="_blank" rel="noopener">
            {credits.name}
          </a>
        </p>
      </div>
      <Link className="footer__link" to={routes.home}>
        {routes.homeLabel}
        <ArrowUpRight size={14} />
      </Link>
    </footer>
  );
}
