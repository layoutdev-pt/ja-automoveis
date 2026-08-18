import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-42 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Início
        </Link>

        <ScrollReveal>
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <h1 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-6">Política de Privacidade</h1>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-10 text-sm text-gray-600 dark:text-gray-400 space-y-2 border border-gray-100 dark:border-gray-800">
              <p><strong className="text-gray-800 dark:text-gray-200">Última atualização:</strong> 13 de agosto de 2026</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Website:</strong> www.jaautomoveis.pt</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Entidade Responsável:</strong> JOSÉ MIGUEL ANDRÉ - COMÉRCIO DE AUTOMÓVEIS UNIPESSOAL LDA</p>
            </div>

            <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">1. O Compromisso com a Privacidade</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A JA Automóveis garante a proteção e a confidencialidade dos dados pessoais submetidos pelos utilizadores do nosso website.</li>
                  <li>Atuamos no estrito cumprimento do Regulamento Geral sobre a Proteção de Dados e da legislação portuguesa aplicável.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">2. Dados Recolhidos e Finalidade</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>O nosso website recolhe dados pessoais exclusivamente quando o utilizador preenche de forma voluntária os formulários de contacto.</li>
                  <li><strong>Dados recolhidos:</strong> Nome e Apelido, Endereço de E-mail, Número de Telefone e Mensagem.</li>
                  <li><strong>Finalidade:</strong> Dar seguimento a pedidos de informação geral, agendamento de test-drives, processos de importação automóvel, avaliações de retomas e orçamentação.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">3. Tratamento e Alojamento dos Dados</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A infraestrutura do nosso website encontra-se alojada nos servidores da Hostinger.</li>
                  <li>Ao submeter o formulário, as informações fornecidas não ficam retidas numa base de dados pública do site.</li>
                  <li>Os dados são encaminhados de forma segura e direta para o nosso endereço de correio eletrónico corporativo.</li>
                  <li>A JA Automóveis compromete-se a não vender, ceder ou partilhar estes dados com entidades terceiras para fins de marketing.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">4. Prazo de Conservação</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Os seus dados pessoais serão conservados pelo tempo necessário para dar resposta ao seu pedido.</li>
                  <li>Após a gestão do contacto inicial, as informações submetidas poderão ser mantidas em arquivo no nosso servidor de correio eletrónico de forma indeterminada para efeitos de histórico comercial e facilitação de futuros contactos.</li>
                  <li>Em caso de concretização de negócio, os dados associados à faturação e garantia serão conservados pelos prazos legais obrigatórios de 10 anos para documentação fiscal.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">5. Os Seus Direitos</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>O utilizador mantém o total controlo sobre os seus dados.</li>
                  <li>Pode exigir, a qualquer momento, o Acesso, Retificação, Limitação ou o Apagamento definitivo dos mesmos.</li>
                  <li>Para exercer estes direitos, deverá contactar-nos através do e-mail oficial.</li>
                </ul>
              </section>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}