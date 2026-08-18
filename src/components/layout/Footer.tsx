import { Link } from 'react-router-dom';

export function Footer() {
  return (
    // Fundo, texto e borda superior adaptam-se ao tema
    <footer className="bg-white dark:bg-[#0a0a0a] pt-20 pb-8 border-t border-gray-100 dark:border-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Topo do Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 border-b border-gray-100 dark:border-gray-800 pb-12 transition-colors duration-500">
          
          {/* Coluna 1: Logo e Descrição */}
          <div className="flex flex-col items-start">
            <Link to="/" className="mb-6 flex items-center gap-2">
              <img 
                src="/logo.png" 
                alt="JA Automóveis Logo" 
                // A logo preta inverte para branco no modo escuro
                className="h-10 object-contain dark:invert transition-all duration-500"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <span className="text-2xl font-bold tracking-tight text-ja-dark dark:text-white transition-colors duration-500">
                JA <span className="text-ja-blue">Automóveis</span>
              </span>
            </Link>
            
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs transition-colors duration-500">
              O seu parceiro de confiança na escolha do seu próximo carro. Garantimos transparência, qualidade e um serviço de excelência do início ao fim.
            </p>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-ja-dark dark:text-gray-200 transition-colors duration-500">Stand & Recursos</h4>
            <ul className="space-y-4">
              <li><Link to="/stand" className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm">Ver Catálogo</Link></li>
              <li><a href="https://wa.link/vygwxb" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm">Importamos o seu carro</a></li>
              <li><Link to="/contactos" className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm">Fale Connosco</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Termos Legais */}
          <div>
            <h4 className="text-lg font-semibold mb-6 uppercase tracking-wider text-ja-dark dark:text-gray-200 transition-colors duration-500">Termos Legais</h4>
            <ul className="space-y-4">
              <li><Link to="/politica-privacidade" className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm">Política de Privacidade</Link></li>
              <li><Link to="/termos-condicoes" className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm">Termos e Condições</Link></li>
              <li><a href="https://www.livroreclamacoes.pt/Inicio" target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm">Livro de Reclamações</a></li>
              {/* O BOTÃO QUE ABRE O MODAL DE COOKIES */}
              <li>
                <button 
                  onClick={() => window.dispatchEvent(new Event('open-cookie-consent'))}
                  className="text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-white transition-colors text-sm text-left"
                >
                  Gerir Cookies
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Fundo do Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium transition-colors duration-500">
            &copy; {new Date().getFullYear()} JA Automóveis. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs font-medium transition-colors duration-500">
            Desenvolvido por: <a href="https://layoutagency.pt/" target="_blank" rel="noopener noreferrer" className="font-bold text-gray-500 dark:text-gray-300 hover:text-ja-blue dark:hover:text-ja-blue transition-colors duration-500">Layout Agency</a>
          </p>
        </div>
      </div>
    </footer>
  );
}