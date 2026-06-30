import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  
  const phoneNumber = "+351 961 650 396"; // Substitui pelo número real
  const defaultMessage = "Olá! Gostaria de obter mais informações sobre os veículos.";
  const waLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Botão Redondo Principal - Fica relativo para segurar o tamanho da div */}
      <button
        onClick={() => setIsOpen(true)}
        className={`bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#1ebd57] transition-all duration-300 ease-out flex items-center justify-center focus:outline-none origin-center ${
          isOpen 
            ? 'opacity-0 scale-50 rotate-90 pointer-events-none' 
            : 'opacity-100 scale-100 rotate-0 pointer-events-auto hover:scale-110'
        }`}
        aria-label="Abrir janela do WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8 md:w-9 md:h-9" />
      </button>

      {/* A Mini Janela (Popover) - Agora ancorada ao bottom-0 right-0 */}
      <div 
        className={`absolute bottom-0 right-0 w-80 bg-gray-50 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 origin-bottom-right transition-all duration-300 ease-out ${
          isOpen 
            ? 'opacity-100 scale-100 pointer-events-auto' 
            : 'opacity-0 scale-50 pointer-events-none'
        }`}
      >
        {/* Cabeçalho Verde */}
        <div className="bg-[#25D366] p-5 flex items-start justify-between">
          <div className="flex items-center gap-3 text-white">
            <WhatsAppIcon className="w-8 h-8 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">JA Automóveis</h4>
              <p className="text-xs text-green-100 mt-0.5 leading-tight">
                Envie-nos as suas questões e dúvidas.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-green-600 p-1.5 rounded-full transition-colors focus:outline-none"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Corpo (Botão de Redirecionamento) */}
        <div className="p-5">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-center justify-between transition-colors shadow-sm group"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#25D366] p-2 rounded-full text-white">
                <WhatsAppIcon className="w-5 h-5" />
              </div>
              <span className="font-bold text-ja-dark text-sm group-hover:text-[#25D366] transition-colors">
                JA Automóveis
              </span>
            </div>
            <ChevronRight size={18} className="text-gray-400 group-hover:text-[#25D366] transition-colors" />
          </a>
        </div>
      </div>
      
    </div>
  );
}