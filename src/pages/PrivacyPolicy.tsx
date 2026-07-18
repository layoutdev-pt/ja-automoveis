import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-42 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Início
        </Link>

        <div className="bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-6">Política de Privacidade</h1>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-10 text-sm text-gray-600 dark:text-gray-400 space-y-2 border border-gray-100 dark:border-gray-800">
            <p><strong className="text-gray-800 dark:text-gray-200">Última atualização:</strong> 7 de julho de 2026</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Entidade Responsável:</strong> JOSE MIGUEL ANDRE - COMERCIO DE AUTOMOVEIS UNIPESSOAL LDA</p>
            <p><strong className="text-gray-800 dark:text-gray-200">NIF:</strong> 517 793 695</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Sede Legal:</strong> Parque Industrial do Canhoso, Rua C, Lote 20, 6200-027 Covilhã, Portugal</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Contacto:</strong> +351 961 650 396 | jaautomoveis553@gmail.com</p>
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">1. O Compromisso com a Privacidade</h2>
              <p>A JOSE MIGUEL ANDRE - COMERCIO DE AUTOMOVEIS UNIPESSOAL LDA (doravante designada por JA Automóveis) garante a proteção e a confidencialidade dos dados pessoais submetidos pelos utilizadores do nosso website, no estrito cumprimento do Regulamento Geral sobre a Proteção de Dados (RGPD) e da legislação portuguesa aplicável.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">2. Que dados recolhemos e com que finalidade?</h2>
              <p className="mb-4">O nosso website recolhe dados pessoais exclusivamente quando o utilizador preenche de forma voluntária o formulário "Envie-nos uma Mensagem". Os dados recolhidos incluem:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Nome e Apelido</li>
                <li>Endereço de E-mail e Número de Telefone</li>
                <li>Assunto e Mensagem descritiva</li>
              </ul>
              <p className="mb-4"><strong className="text-gray-800 dark:text-gray-200">Finalidade:</strong> Estes dados destinam-se única e exclusivamente a dar resposta ao seu pedido de contacto comercial. O tratamento dos dados visa dar seguimento aos seguintes assuntos selecionados no formulário:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Informação Geral:</strong> esclarecimento de dúvidas gerais;</li>
                <li><strong>Agendar Test-Drive:</strong> marcação de visitas e testes às viaturas;</li>
                <li><strong>Processo de Importação:</strong> informações e orçamentos para importação automóvel;</li>
                <li><strong>Quero Vender a Minha Viatura:</strong> avaliação de veículos para compra ou retoma;</li>
                <li>Bem como o tratamento de qualquer outro assunto, dúvida ou pedido específico que o utilizador decida detalhar no campo de texto livre da mensagem.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">3. Tratamento e Alojamento dos Dados</h2>
              <p>Ao submeter o formulário, prestando o seu consentimento ativo através da respetiva caixa de seleção, as informações fornecidas são encaminhadas de forma segura para o nosso endereço de correio eletrónico oficial (jaautomoveis553@gmail.com). A JA Automóveis compromete-se a não vender, ceder ou partilhar estes dados com entidades terceiras para fins de marketing.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">4. Prazo de Conservação</h2>
              <p>Os seus dados pessoais serão conservados pelo tempo estritamente necessário para dar seguimento e resposta ao seu pedido de contacto inicial. Após a gestão do seu pedido, as informações submetidas (e-mail e histórico de comunicação) poderão ser mantidas em arquivo no nosso servidor de correio eletrónico para efeitos de histórico comercial, orçamentação e facilitação de futuros contactos. O utilizador mantém, no entanto, o total controlo sobre os seus dados, podendo exigir a sua eliminação imediata a qualquer momento. Em caso de concretização de negócio (compra, venda ou importação), os dados associados à faturação e garantia serão conservados pelos prazos legais obrigatórios (10 anos para documentação fiscal).</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">5. Os Seus Direitos</h2>
              <p>Na qualidade de titular dos dados, assiste-lhe o direito de solicitar, a qualquer momento, o Acesso, Retificação, Limitação do tratamento ou o Apagamento definitivo dos seus dados pessoais. Para exercer qualquer um destes direitos, deverá enviar um e-mail com o seu pedido para jaautomoveis553@gmail.com. A JA Automóveis processará o seu pedido no prazo máximo de 30 dias.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}