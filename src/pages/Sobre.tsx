import { ShieldCheck, Star, Users, Trophy } from 'lucide-react';

export function Sobre() {
  // Lista com os membros da equipa (Fotos mantidas como mockups temporariamente)
  const teamMembers = [
    {
      nome: "João Silva",
      cargo: "CEO & Fundador",
      foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      nome: "Maria Costa",
      cargo: "Diretora Comercial",
      foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      nome: "Carlos Santos",
      cargo: "Especialista em Importação",
      foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      nome: "Ana Oliveira",
      cargo: "Gestão e Pós-Venda",
      foto: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-44 pb-20 transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Página */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-ja-dark dark:text-white tracking-tight mb-6 transition-colors duration-500">
            Mais do que vender automóveis, <br className="hidden md:block" />
            <span className="text-ja-blue">entregamos confiança.</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed transition-colors duration-500">
            A JA Automóveis nasceu da paixão pelo setor automóvel e do compromisso em oferecer um serviço de excelência. Selecionamos cada viatura como se fosse para nós.
          </p>
        </div>

        {/* Secção de Valores (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500 shadow-sm hover:shadow-md">
            <div className="w-14 h-14 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
              <ShieldCheck size={28} className="text-ja-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-3 transition-colors duration-500">Transparência Total</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-500 leading-relaxed text-sm">
              Conhecemos o histórico de todas as nossas viaturas. Acreditamos que a honestidade é a base de qualquer negócio duradouro.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500 shadow-sm hover:shadow-md">
            <div className="w-14 h-14 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
              <Star size={28} className="text-ja-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-3 transition-colors duration-500">Qualidade Premium</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-500 leading-relaxed text-sm">
              O nosso stock e o nosso processo de importação focam-se num rigoroso controlo de qualidade, garantindo que leva para casa o melhor.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors duration-500 shadow-sm hover:shadow-md">
            <div className="w-14 h-14 bg-ja-blue/10 dark:bg-ja-blue/20 rounded-xl flex items-center justify-center mb-6 transition-colors duration-500">
              <Trophy size={28} className="text-ja-blue dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-3 transition-colors duration-500">Acompanhamento</h3>
            <p className="text-gray-500 dark:text-gray-400 transition-colors duration-500 leading-relaxed text-sm">
              Desde a escolha da viatura até ao serviço pós-venda, a nossa equipa está sempre disponível para o apoiar em cada etapa.
            </p>
          </div>
        </div>

        {/* ================= SECÇÃO DE MISSÃO (CARTÕES LADO A LADO C/ HOVER) ================= */}
        <div className="max-w-7xl mx-auto mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white mb-4 transition-colors duration-500">
              A Nossa Missão
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 transition-colors duration-500">
              O compromisso que nos move diariamente
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pilar 1 */}
            <div className="group bg-gray-50 dark:bg-[#121212] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-ja-blue/30 flex flex-col relative">
              {/* O número cinzento que fica azul em hover */}
              <div className="text-5xl font-black text-gray-200 dark:text-gray-800 transition-colors duration-500 group-hover:text-ja-blue dark:group-hover:text-blue-500 mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-4">Revolucionar o Mercado</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                Nascemos com a visão clara de transformar a compra de automóveis num processo simples. Queremos romper com o tradicional e estabelecer um novo padrão de confiança no setor automóvel.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="group bg-gray-50 dark:bg-[#121212] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-ja-blue/30 flex flex-col relative">
              <div className="text-5xl font-black text-gray-200 dark:text-gray-800 transition-colors duration-500 group-hover:text-ja-blue dark:group-hover:text-blue-500 mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-4">Transparência Total</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                Acreditamos que a segurança do cliente está em primeiro lugar. Oferecemos um acompanhamento rigoroso e honesto em cada etapa, garantindo que sabe exatamente o que está a adquirir.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="group bg-gray-50 dark:bg-[#121212] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-ja-blue/30 flex flex-col relative">
              <div className="text-5xl font-black text-gray-200 dark:text-gray-800 transition-colors duration-500 group-hover:text-ja-blue dark:group-hover:text-blue-500 mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-4">Soluções Chave-na-Mão</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                Seja através do nosso stock ou no serviço especializado de importação, tratamos de toda a burocracia e logística. O nosso objetivo é eliminar as complicações para o cliente.
              </p>
            </div>

            {/* Pilar 4 */}
            <div className="group bg-gray-50 dark:bg-[#121212] p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-ja-blue/30 flex flex-col relative">
              <div className="text-5xl font-black text-gray-200 dark:text-gray-800 transition-colors duration-500 group-hover:text-ja-blue dark:group-hover:text-blue-500 mb-4">
                04
              </div>
              <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-4">Experiência do Cliente</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                Mais do que vender viaturas, focamo-nos na satisfação de quem confia em nós. Trabalhamos para que a única preocupação do cliente seja desfrutar da sua nova viatura com total tranquilidade.
              </p>
            </div>

          </div>
        </div>

        {/* ================= SECÇÃO DA EQUIPA ================= */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4 bg-ja-blue/10 dark:bg-ja-blue/20 px-4 py-2 rounded-full">
            <Users size={20} className="text-ja-blue dark:text-blue-400" />
            <span className="font-semibold text-ja-blue dark:text-blue-400 uppercase tracking-wider text-sm">A Nossa Equipa</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ja-dark dark:text-white transition-colors duration-500">
            Conheça quem faz acontecer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="bg-gray-50 dark:bg-[#121212] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col group"
            >
              {/* Foto Superior */}
              <div className="aspect-[4/5] w-full overflow-hidden relative">
                <img 
                  src={member.foto} 
                  alt={member.nome} 
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              
              {/* Informação */}
              <div className="p-6 text-center flex flex-col justify-center bg-white dark:bg-[#18181b] z-10 -mt-2 rounded-t-2xl relative border-t border-gray-50 dark:border-gray-800">
                <h3 className="text-xl font-bold text-ja-dark dark:text-white mb-1">
                  {member.nome}
                </h3>
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400">
                  {member.cargo}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}