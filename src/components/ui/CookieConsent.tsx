import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se já aceitou ao carregar a página
    const consent = localStorage.getItem('ja_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }

    // "Escutador" para abrir o modal quando o botão do Footer for clicado
    const handleOpenConsent = () => setIsVisible(true);
    window.addEventListener('open-cookie-consent', handleOpenConsent);

    return () => {
      window.removeEventListener('open-cookie-consent', handleOpenConsent);
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem('ja_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-[#18181b] border-t border-gray-200 dark:border-gray-800 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h4 className="text-lg font-bold text-ja-dark dark:text-white mb-2">
            Utilizamos cookies essenciais
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            O website da JA Automóveis utiliza cookies técnicos essenciais para garantir o funcionamento seguro da plataforma, a proteção dos formulários de contacto e a integração de mapas de localização. Não utilizamos cookies de rastreio publicitário ou analítico. Ao continuar a navegar no nosso catálogo, concorda com a nossa <Link to="/cookies" className="text-ja-blue hover:underline font-semibold">Política de Cookies</Link>.
          </p>
        </div>
        <div className="w-full md:w-auto shrink-0">
          <button 
            onClick={handleAccept} 
            className="w-full md:w-auto px-8 py-3 text-sm font-bold bg-ja-blue hover:bg-blue-600 text-white rounded-xl shadow-sm transition-colors"
          >
            Compreendi
          </button>
        </div>
      </div>
    </div>
  );
}