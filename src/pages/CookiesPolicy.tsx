import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-42 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Início
        </Link>

        <ScrollReveal>
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <h1 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-6">Política de Cookies</h1>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-10 text-sm text-gray-600 dark:text-gray-400 space-y-2 border border-gray-100 dark:border-gray-800">
              <p><strong className="text-gray-800 dark:text-gray-200">Última atualização:</strong> 13 de agosto de 2026</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Website:</strong> www.jaautomoveis.pt</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Entidade Responsável:</strong> JOSÉ MIGUEL ANDRÉ - COMÉRCIO DE AUTOMÓVEIS UNIPESSOAL LDA</p>
            </div>

            <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">1. O que são Cookies</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cookies são pequenos ficheiros de texto armazenados no seu dispositivo através do navegador de internet.</li>
                  <li>São essenciais para garantir o funcionamento técnico, rápido e seguro do nosso catálogo digital de viaturas.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">2. O que NÃO utilizamos</h2>
                <p className="mb-4">O website da JA Automóveis foi desenvolvido com foco na transparência e na proteção de dados:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>NÃO utilizamos cookies estatísticos ou analíticos de rastreio contínuo.</li>
                  <li>NÃO utilizamos cookies de publicidade direcionada ou campanhas de retargeting.</li>
                  <li>NÃO partilhamos o seu comportamento de navegação com agências de marketing.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">3. Que Cookies utilizamos</h2>
                <p className="mb-6">Para assegurar o funcionamento da plataforma e dos formulários, utilizamos apenas as seguintes categorias:</p>
                
                <div className="mb-6">
                  <h3 className="font-bold text-ja-dark dark:text-gray-200 mb-2">Cookies Estritamente Necessários (Próprios)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>São ficheiros técnicos gerados automaticamente pela infraestrutura de alojamento na Hostinger e pelo sistema do website.</li>
                    <li>Servem para registar a sua preferência no aviso de cookies, evitando que o banner apareça repetidamente em todas as páginas.</li>
                    <li>Servem para permitir o processamento seguro e a proteção contra spam no envio de mensagens através dos nossos formulários.</li>
                    <li>Sendo estritamente essenciais para o site funcionar, a legislação não exige o consentimento prévio para a instalação destes ficheiros.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-ja-dark dark:text-gray-200 mb-2">Cookies de Terceiros (Google Maps)</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Para facilitar a localização do nosso stand, o website integra mapas interativos da Google.</li>
                    <li>O carregamento desta ferramenta implica que a Google instale autonomamente os seus próprios cookies técnicos e de sessão.</li>
                    <li>Estes ficheiros servem apenas para memorizar as preferências de visualização e os níveis de zoom do mapa.</li>
                    <li>A gestão e recolha destes dados é da inteira responsabilidade da Google, aplicando-se a sua própria Política de Privacidade.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">4. Gestão e Desativação de Cookies</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>O utilizador tem total controlo sobre a gestão de cookies nas definições do seu navegador.</li>
                  <li>Alertamos que o bloqueio forçado dos nossos cookies essenciais poderá impedir o correto funcionamento do formulário de marcação de test-drives ou pedidos de contacto.</li>
                </ul>
              </section>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}