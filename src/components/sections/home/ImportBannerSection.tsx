import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ImportBannerSection() {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-500">
      <div className="relative rounded-3xl overflow-hidden bg-ja-dark shadow-2xl flex flex-col md:flex-row items-center border border-gray-800">
        
        {/* Fundo com Imagem e Máscara */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="imagens/Importado.jpeg" 
            alt="Importação de Automóveis" 
            className="w-full h-full object-cover opacity-40" 
          />
          {/* O gradiente imita o design da tua foto, fundindo o escuro com a imagem */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/5 to-transparent"></div>
          
          {/* Círculo decorativo ao estilo da tua imagem (usamos o ja-blue para combinar com o site) */}
          <div className="absolute -bottom-64 -right-20 w-96 h-96 bg-ja-blue/20 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 p-8 md:p-16 w-full md:w-2/3 lg:w-1/2">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-8">
            Importamos o seu <br/> <span className="text-ja-blue">carro</span>
          </h2>
          
          <ul className="space-y-4 mb-10">
            {[
              'Acesso a milhares de viaturas no mercado europeu.',
              'Tratamos de toda a burocracia e legalização.',
              'Transparência total nos custos e impostos.'
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-4 text-gray-300 text-sm md:text-base">
                <div className="bg-ja-blue/20 p-1.5 rounded-full flex-shrink-0">
                  <Check size={16} className="text-ja-blue" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <Link 
            to="/importacao" 
            className="inline-block bg-transparent border-2 border-ja-blue hover:bg-ja-blue text-white font-bold py-3 px-8 rounded-xl transition-colors duration-300"
          >
            Saber como funciona
          </Link>
        </div>
      </div>
    </section>
  );
}