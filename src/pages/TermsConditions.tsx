import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-42 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Início
        </Link>

        <div className="bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
          <h1 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-6">Termos e Condições de Utilização</h1>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-10 text-sm text-gray-600 dark:text-gray-400 space-y-2 border border-gray-100 dark:border-gray-800">
            <p><strong className="text-gray-800 dark:text-gray-200">Última atualização:</strong> 7 de julho de 2026</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Website:</strong> www.jaautomoveis.pt</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Entidade Responsável:</strong> JOSE MIGUEL ANDRE - COMERCIO DE AUTOMOVEIS UNIPESSOAL LDA</p>
            <p><strong className="text-gray-800 dark:text-gray-200">NIF:</strong> 517 793 695</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Sede Legal:</strong> Parque Industrial do Canhoso, Rua C, Lote 20, 6200-027 Covilhã, Portugal</p>
            <p><strong className="text-gray-800 dark:text-gray-200">Contactos:</strong> +351 961 650 396 | jaautomoveis553@gmail.com</p>
          </div>

          <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">1. Objeto e Aceitação</h2>
              <p>O presente documento estabelece as regras que regulam o acesso e a utilização do website oficial da JOSE MIGUEL ANDRE - COMERCIO DE AUTOMOVEIS UNIPESSOAL LDA (adiante designada por JA Automóveis). Ao navegar neste website e ao utilizar os nossos formulários de contacto, o utilizador aceita integralmente e sem reservas os presentes Termos e Condições de Utilização, bem como a nossa Política de Privacidade.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">2. Finalidade do Website e Natureza das Informações</h2>
              <p className="mb-4">O website da JA Automóveis funciona como um catálogo digital das viaturas disponíveis em stock e como uma plataforma para agilizar o contacto comercial (orçamentos, test-drives, avaliações de retoma e processos de importação).</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Ausência de Vínculo Contratual Online:</strong> O preenchimento de qualquer formulário no website não constitui uma reserva firme da viatura nem um contrato de compra e venda. Qualquer transação comercial, adjudicação ou reserva exige a formalização presencial ou a assinatura de documentação legal própria remetida pela nossa equipa.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">3. Catálogo de Viaturas, Preços e Características (Cláusula de Salvaguarda)</h2>
              <p className="mb-4">A JA Automóveis envida todos os esforços para garantir que a informação apresentada no website está correta e atualizada. No entanto, alertamos para o seguinte:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Possíveis Inexatidões:</strong> As características técnicas, os equipamentos de série ou opcionais (extras), a quilometragem e os preços das viaturas são inseridos de forma manual. Por conseguinte, poderão ocorrer lapsos ou erros tipográficos.</li>
                <li><strong>Confirmação Obrigatória:</strong> As informações prestadas no website são meramente indicativas e não possuem caráter vinculativo. A configuração exata e o preço final de cada viatura carecem sempre de confirmação presencial junto da nossa equipa comercial no stand, antes da formalização de qualquer negócio.</li>
                <li><strong>Alterações:</strong> A JA Automóveis reserva-se o direito de alterar os preços, as campanhas e o stock de viaturas a qualquer momento, sem aviso prévio.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">4. Responsabilidade do Utilizador</h2>
              <p className="mb-4">Ao interagir com o website, o utilizador compromete-se a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer dados verdadeiros e exatos nos formulários de contacto (nome, telefone, e-mail), essenciais para o correto processamento do seu pedido.</li>
                <li>Não utilizar o website para fins ilícitos, fraudulentos ou que possam comprometer a segurança da infraestrutura informática do stand.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">5. Propriedade Intelectual</h2>
              <p>Todo o conteúdo disponível no website, incluindo logótipos, textos, design e as fotografias das viaturas, é propriedade exclusiva da JA Automóveis. É estritamente proibida a cópia, reprodução, alteração ou utilização comercial destes conteúdos (nomeadamente a apropriação de fotografias do nosso stock por terceiros) sem autorização prévia por escrito.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">6. Livro de Reclamações Eletrónico</h2>
              <p>Em cumprimento da legislação em vigor (Decreto-Lei n.º 74/2017), a JA Automóveis informa que dispõe do Livro de Reclamações Eletrónico. Caso o consumidor deseje apresentar uma reclamação formal, poderá fazê-lo através da plataforma oficial: <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="text-ja-blue hover:underline">www.livroreclamacoes.pt</a>.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">7. Resolução Alternativa de Litígios (RAL)</h2>
              <p className="mb-4">Em caso de litígio de consumo, o consumidor pode recorrer a uma Entidade de Resolução Alternativa de Litígios de Consumo. Tendo em conta a localização da nossa sede, sugerimos o recurso ao:</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl inline-block">
                <p className="font-semibold text-ja-dark dark:text-white">CNIACC - Centro Nacional de Informação e Arbitragem de Conflitos de Consumo</p>
                <p>Website: <a href="https://www.cniacc.pt" target="_blank" rel="noopener noreferrer" className="text-ja-blue hover:underline">www.cniacc.pt</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">8. Alterações e Foro Competente</h2>
              <p>A JA Automóveis reserva-se o direito de rever e atualizar estes Termos e Condições a qualquer momento. Os presentes Termos regem-se pela legislação portuguesa. Para a resolução de qualquer litígio emergente da utilização deste website ou da interpretação deste documento, é convencionado como competente o foro da Comarca da Covilhã, com expressa renúncia a qualquer outro.</p>
            </section>

            {/* Linha Divisória */}
            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-12"></div>

            {/* Nova Secção: Garantia Automóvel */}
            <section>
              <h2 className="text-3xl font-bold text-ja-dark dark:text-white mb-6">Garantia Automóvel</h2>
              
              <p className="mb-4">Na JA Automóveis, destacamo-nos pela excelência, transparência e fiabilidade dos nossos serviços. Ao escolher-nos, beneficia de uma cobertura que assegura a total tranquilidade necessária na compra do seu novo automóvel. O que nos diferencia é o nosso compromisso com a qualidade e o acompanhamento dedicado, tanto antes como após a venda. Confie na nossa equipa para garantir a sua satisfação em cada etapa do processo.</p>
              
              <p className="mb-8">Adquirir um veículo usado deve ser uma decisão segura e sem preocupações. É fundamental ter a certeza de que está protegido contra eventuais problemas mecânicos e eletrónicos. Por isso, na JA Automóveis, oferecemos um serviço de garantia rigoroso que lhe proporciona segurança total na estrada.</p>
              
              <p className="mb-6 font-semibold text-ja-dark dark:text-gray-200 text-lg">Os principais benefícios da nossa garantia incluem:</p>
              
              <ul className="space-y-6 mb-10">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-ja-blue shrink-0"></div>
                  <p><strong className="text-ja-dark dark:text-white">Garantia de 18 Meses (Mútuo Acordo):</strong> Em total conformidade com a legislação em vigor (Decreto-Lei n.º 84/2021), todas as nossas viaturas beneficiam de uma garantia de 18 meses, estabelecida por mútuo acordo no momento da compra, para sua máxima proteção.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-ja-blue shrink-0"></div>
                  <p><strong className="text-ja-dark dark:text-white">Cobertura Abrangente:</strong> Proteção eficaz contra falhas mecânicas e eletrónicas inesperadas, para que não tenha surpresas com o seu novo veículo.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-ja-blue shrink-0"></div>
                  <p><strong className="text-ja-dark dark:text-white">Gestão Própria de Reparações:</strong> Em caso de anomalia, nós tratamos de tudo. Asseguramos que todas as reparações abrangidas pela garantia são devidamente geridas pela nossa equipa e efetuadas por técnicos especializados com peças de qualidade.</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-ja-blue shrink-0"></div>
                  <p><strong className="text-ja-dark dark:text-white">Acompanhamento Dedicado:</strong> Estamos sempre ao seu dispor para o orientar, prestar assistência e resolver qualquer imprevisto de forma rápida e descomplicada.</p>
                </li>
              </ul>
              
              <p className="mb-4">Escolher a JA Automóveis é optar por uma empresa que coloca o cliente e a transparência em primeiro lugar. A nossa dedicação reflete-se na confiança de quem compra connosco. Conduza com a certeza de que está protegido contra imprevistos.</p>
              
              <p>Para informações mais detalhadas sobre as condições da nossa garantia e como asseguramos a sua tranquilidade, visite o nosso stand na Covilhã ou entre em contacto connosco. Estamos prontos para prestar o melhor serviço e garantir a sua total satisfação!</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}