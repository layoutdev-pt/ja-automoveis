import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../../../data/faqs';


export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>();
  const faqs = FAQS;

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
              aria-expanded={openIndex === idx}
              aria-controls={`faq-resposta-${idx}`}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <h3 className="font-semibold text-ja-dark dark:text-white transition-colors text-base">{faq.q}</h3>
              <ChevronDown 
                className={`text-gray-400 dark:text-gray-500 transition-transform duration-300 flex-shrink-0 ml-4 ${openIndex === idx ? 'rotate-180 text-ja-blue' : ''}`} 
              />
            </button>
            <div
              id={`faq-resposta-${idx}`}
              // O texto permanece SEMPRE no DOM (apenas colapsado visualmente),
              // para que seja extraível por motores de resposta e leitores de ecrã.
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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