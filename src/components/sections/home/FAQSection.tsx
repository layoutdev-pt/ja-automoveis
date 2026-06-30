import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>();

  const faqs = [
    { 
      q: "Quais tipos de veículos posso encontrar na JA Automóveis?", 
      a: "Trabalhamos com uma vasta gama de viaturas multimarcas, desde utilitários económicos a SUVs familiares e modelos premium desportivos, focando-nos sempre no excelente estado de conservação." 
    },
    { 
      q: "A JA Automóveis oferece garantia nos carros usados?", 
      a: "Sim, absolutamente. Todas as nossas viaturas são entregues com garantia por mútuo acordo, válida por 18 meses, para lhe assegurar total tranquilidade após a compra." 
    },
    { 
      q: "É possível fazer uma retoma do meu carro usado por outro veículo?", 
      a: "Sem dúvida! Avaliamos a sua viatura atual de forma justa e transparente, utilizando o seu valor para facilitar a transição para o seu novo automóvel." 
    },
    { 
      q: "A JA Automóveis oferece serviços de financiamento?", 
      a: "Sim, dispomos de parcerias com as melhores entidades financeiras para lhe apresentar opções de crédito automóvel com as melhores taxas do mercado, adaptadas ao seu orçamento mensal." 
    },
    { 
      q: "Como funciona exatamente o vosso serviço de importação?", 
      a: "É um serviço 'Chave na Mão'. Escolhemos a viatura no mercado europeu, realizamos a vistoria física, transportamos, tratamos da legalização completa e entregamos-lhe o carro pronto a circular com matrícula portuguesa." 
    }
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto transition-colors duration-500">
      
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-ja-dark dark:text-white inline-block relative transition-colors">
          Perguntas frequentes
          <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-ja-blue rounded-full"></div>
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx} 
            className="bg-gray-50 dark:bg-[#111111] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-colors duration-500"
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="font-semibold text-ja-dark dark:text-white transition-colors">{faq.q}</span>
              <ChevronDown 
                className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === idx ? 'rotate-180 text-ja-blue' : ''}`} 
              />
            </button>
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 text-gray-500 dark:text-gray-400 text-sm leading-relaxed transition-colors">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </section>
  );
}