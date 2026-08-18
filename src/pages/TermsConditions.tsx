import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ScrollReveal } from '../components/ui/ScrollReveal';

export function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-42 pb-20 transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-ja-blue dark:hover:text-blue-400 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Voltar ao Início
        </Link>

        <ScrollReveal>
          <div className="bg-white dark:bg-[#121212] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-500">
            <h1 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-6">Termos e Condições de Utilização</h1>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl mb-10 text-sm text-gray-600 dark:text-gray-400 space-y-2 border border-gray-100 dark:border-gray-800">
              <p><strong className="text-gray-800 dark:text-gray-200">Última atualização:</strong> 13 de agosto de 2026</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Website:</strong> www.jaautomoveis.pt</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Entidade Responsável:</strong> JOSÉ MIGUEL ANDRÉ - COMÉRCIO DE AUTOMÓVEIS UNIPESSOAL LDA</p>
              <p><strong className="text-gray-800 dark:text-gray-200">NIPC:</strong> 517 793 695</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Sede Legal:</strong> Parque Industrial do Canhoso, Rua C, Lote 20, 6200-027 Covilhã, Portugal</p>
              <p><strong className="text-gray-800 dark:text-gray-200">Contactos:</strong> +351 961 650 396 | jaautomoveis553@gmail.com</p>
            </div>

            <div className="space-y-8 text-gray-600 dark:text-gray-300 leading-relaxed">
              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">1. Objeto e Aceitação</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>O presente documento estabelece as regras que regulam o acesso e a utilização do website oficial da JOSÉ MIGUEL ANDRÉ - COMÉRCIO DE AUTOMÓVEIS UNIPESSOAL LDA (adiante designada por JA Automóveis).</li>
                  <li>Ao navegar neste website e ao utilizar os nossos formulários de contacto, o utilizador aceita integralmente e sem reservas os presentes Termos e Condições de Utilização, bem como a nossa Política de Privacidade.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">2. Finalidade do Website e Natureza das Informações</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>O website da JA Automóveis funciona como um catálogo digital das viaturas disponíveis em stock e como uma plataforma para agilizar o contacto comercial.</li>
                  <li>A plataforma serve para solicitar orçamentos, test-drives, avaliações de retoma e processos de importação.</li>
                  <li><strong>Ausência de Vínculo Contratual Online:</strong> O preenchimento de qualquer formulário no website não constitui uma reserva firme da viatura nem um contrato de compra e venda.</li>
                  <li>Qualquer transação comercial, adjudicação ou reserva exige a formalização presencial ou a assinatura de documentação legal própria remetida pela nossa equipa.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">3. Catálogo de Viaturas, Preços e Características (Isenção de Responsabilidade)</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A JA Automóveis envida todos os esforços para garantir que a informação apresentada no website seja exata e atualizada.</li>
                  <li><strong>Preços e Características:</strong> As descrições técnicas, os equipamentos de série ou opcionais (extras), a quilometragem e os preços das viaturas têm um caráter meramente indicativo e orientador.</li>
                  <li><strong>Erros e Atualizações:</strong> Sendo a inserção de dados manual, a informação apresentada no website pode conter erros tipográficos, falhas na atualização da disponibilidade de stock ou incorreções nos preços de venda ao público.</li>
                  <li><strong>Validação Obrigatória:</strong> As informações prestadas online não possuem caráter vinculativo. A configuração exata de cada viatura, o preço final e a sua disponibilidade carecem sempre de confirmação presencial junto da nossa equipa comercial no stand, antes da formalização de qualquer negócio.</li>
                  <li><strong>Isenção:</strong> A JA Automóveis reserva-se o direito de alterar os preços, as campanhas e o stock de viaturas a qualquer momento, sem aviso prévio. A JA Automóveis não assume qualquer responsabilidade por eventuais prejuízos decorrentes de erros de informação no website.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">4. Garantia Automóvel</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Na JA Automóveis, destacamo-nos pela excelência, transparência e fiabilidade dos nossos serviços.</li>
                  <li>Ao escolher-nos, beneficia de uma cobertura que assegura a total tranquilidade necessária na compra do seu novo automóvel.</li>
                  <li><strong>Períodos de Garantia Flexíveis:</strong> As nossas viaturas beneficiam de garantia automóvel cujo período poderá ser de 6, 12, 18 ou 24 meses.</li>
                  <li>O prazo exato é definido casuisticamente e formalizado por mútuo acordo no momento da compra. Este prazo adapta-se às características específicas da viatura e à modalidade de negócio aplicável, assegurando sempre a sua máxima proteção.</li>
                  <li><strong>Cobertura Abrangente:</strong> Proteção eficaz contra falhas mecânicas e eletrónicas inesperadas.</li>
                  <li><strong>Gestão Própria de Reparações:</strong> Em caso de anomalia, nós tratamos de tudo. Asseguramos que todas as reparações abrangidas pela garantia são devidamente geridas pela nossa equipa e efetuadas por técnicos especializados com peças de qualidade.</li>
                  <li><strong>Acompanhamento Dedicado:</strong> Estamos sempre ao seu dispor para o orientar, prestar assistência e resolver qualquer imprevisto.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">5. Responsabilidade do Utilizador</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ao interagir com o website, o utilizador compromete-se a fornecer dados verdadeiros e exatos nos formulários de contacto. Os dados corretos são essenciais para o processamento do seu pedido.</li>
                  <li>O utilizador compromete-se a não utilizar o website para fins ilícitos, fraudulentos ou que possam comprometer a segurança da infraestrutura informática do stand.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">6. Propriedade Intelectual</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Todo o conteúdo disponível no website, incluindo logótipos, textos, design e as fotografias das viaturas, é propriedade exclusiva da JA Automóveis.</li>
                  <li>É estritamente proibida a cópia, reprodução, alteração ou utilização comercial destes conteúdos sem autorização prévia por escrito.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">7. Livro de Reclamações Eletrónico e RAL</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Em cumprimento do Decreto-Lei n.º 74/2017, informamos que dispomos de Livro de Reclamações Eletrónico em <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer" className="text-ja-blue hover:underline">www.livroreclamacoes.pt</a>.</li>
                  <li>Em caso de litígio de consumo, o consumidor pode recorrer ao Centro Nacional de Informação e Arbitragem de Conflitos de Consumo em <a href="https://www.cniacc.pt" target="_blank" rel="noopener noreferrer" className="text-ja-blue hover:underline">www.cniacc.pt</a>.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-ja-dark dark:text-white mb-4">8. Alterações e Foro Competente</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Os presentes Termos regem-se pela legislação portuguesa.</li>
                  <li>Para a resolução de qualquer litígio, é convencionado como competente o foro da Comarca da Covilhã.</li>
                </ul>
              </section>

            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}