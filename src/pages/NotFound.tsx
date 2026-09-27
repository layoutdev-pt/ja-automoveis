import { Link } from 'react-router-dom';
import { Home as HomeIcon, Search } from 'lucide-react';
import { Seo } from '../seo/Seo';

export function NotFound() {
  return (
    <>
      <Seo
        title="Página não encontrada (404) | JA Automóveis"
        description="A página que procura não existe ou foi movida. Consulte o stand de viaturas usadas e semi-novas da JA Automóveis na Covilhã."
        path="/404"
        noindex
      />

      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-44 pb-20 px-4 transition-colors duration-500">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-7xl md:text-8xl font-black text-ja-blue mb-4">404</p>

          <h1 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white tracking-tight mb-4">
            Página não encontrada
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
            O endereço que introduziu não existe ou a viatura já não se encontra disponível.
            Veja as viaturas atualmente em stock no nosso stand na Covilhã.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/stand"
              className="inline-flex items-center justify-center gap-2 bg-ja-blue text-white px-8 py-3 rounded-xl hover:bg-blue-600 transition-colors font-semibold shadow-md"
            >
              <Search size={18} />
              Ver todo o stand
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-ja-dark dark:text-white px-8 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-semibold"
            >
              <HomeIcon size={18} />
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
