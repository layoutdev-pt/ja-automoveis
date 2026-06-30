import { ShieldCheck, Award, Handshake } from 'lucide-react';

export function WhyChooseUsSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-colors duration-500">
      <div className="flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Lado Esquerdo - Texto e Tópicos */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-2 transition-colors">
            Porquê a JA Automóveis?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10 transition-colors">
            O que nos distingue da concorrência
          </p>

          <div className="space-y-8">
            <div className="flex gap-4 group">
              <div className="mt-1 flex-shrink-0"><ShieldCheck className="text-ja-blue group-hover:scale-110 transition-transform" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-2 transition-colors">Qualidade Garantida</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors">Os nossos carros são cuidadosamente selecionados e inspecionados para garantir a máxima qualidade e fiabilidade. Entramos em cada detalhe para oferecer as melhores opções aos nossos clientes.</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="mt-1 flex-shrink-0"><Award className="text-ja-blue group-hover:scale-110 transition-transform" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-2 transition-colors">Experiência Comprovada</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors">Com uma vasta experiência e conhecimento do mercado automóvel, prestamos um serviço de excelência e aconselhamento técnico rigoroso antes, durante e após a venda.</p>
              </div>
            </div>

            <div className="flex gap-4 group">
              <div className="mt-1 flex-shrink-0"><Handshake className="text-ja-blue group-hover:scale-110 transition-transform" size={28} /></div>
              <div>
                <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-2 transition-colors">Confiança e Transparência</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors">Mantemos total transparência em todas as transações, sem surpresas nem custos ocultos. A nossa reputação é construída com base na confiança que os nossos clientes depositam em nós.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Imagem com as molduras nos cantos */}
        <div className="w-full lg:w-1/2 relative p-4">
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
             {/* Podes trocar esta foto pela foto da fachada do teu stand mais tarde */}
             <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Instalações JA Automóveis" className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-1000" />
          </div>
          
          {/* Decorações dos Cantos (Iguais à tua imagem de referência) */}
          <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-ja-blue rounded-br-2xl z-20"></div>
          <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-ja-blue rounded-tl-2xl z-20"></div>
        </div>

      </div>
    </section>
  );
}