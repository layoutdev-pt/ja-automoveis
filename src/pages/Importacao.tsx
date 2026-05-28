import { Search, ShieldCheck, FileText, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Importacao() {
  const steps = [
    {
      icon: <Search size={32} className="text-ja-blue" />,
      title: '1. Pesquisa à Medida',
      description: 'Diga-nos exatamente o que procura. Marca, modelo, ano, equipamento e orçamento. A nossa equipa vasculha o mercado europeu (maioritariamente Alemanha e Países Baixos) para encontrar a viatura ideal.'
    },
    {
      icon: <ShieldCheck size={32} className="text-ja-blue" />,
      title: '2. Inspeção e Histórico',
      description: 'Antes de qualquer compromisso, verificamos o histórico de manutenções, a ausência de acidentes e confirmamos a quilometragem real. Só avançamos com viaturas irrepreensíveis.'
    },
    {
      icon: <FileText size={32} className="text-ja-blue" />,
      title: '3. Legalização e Burocracia',
      description: 'Tratamos de todo o processo burocrático: ISV, inspeção B, atribuição de matrícula portuguesa e registo automóvel. Não tem de se preocupar com filas ou papelada.'
    },
    {
      icon: <Truck size={32} className="text-ja-blue" />,
      title: '4. Entrega Chave na Mão',
      description: 'A viatura é transportada em segurança, sujeita a uma revisão completa e detalhe automóvel antes de lhe ser entregue, pronta a circular com total tranquilidade.'
    }
  ];

  const guarantees = [
    'Quilometragem 100% real e comprovada',
    'Histórico de manutenção completo na marca',
    'Garantia de ausência de danos estruturais',
    'Processo chave na mão (legalização incluída)',
    'Garantia por mútuo acordo de 18 meses',
    'Acompanhamento e transparência em cada fase'
  ];

  return (
    // O fundo principal da página muda para o tom escuro profundo
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 pb-20 transition-colors duration-500">
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-ja-dark dark:text-white tracking-tight mb-6 transition-colors duration-500">
          Importação Segura e Transparente
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed transition-colors duration-500">
          O carro dos seus sonhos pode estar fora de Portugal. Nós tratamos de o trazer até si com total segurança, tratando de toda a burocracia e garantindo o melhor negócio, sem surpresas.
        </p>
      </section>

      {/* Como Funciona (Passo a Passo) */}
      <section className="bg-white dark:bg-[#0a0a0a] py-20 border-y border-gray-100 dark:border-gray-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-ja-dark dark:text-white mb-4 transition-colors duration-500">Como Funciona o Processo?</h2>
            <div className="w-16 h-1 bg-ja-blue mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                // Os cartões dos passos ganham um fundo translúcido no modo escuro
                className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md dark:hover:shadow-none transition-all duration-300 relative mt-4"
              >
                {/* A caixinha do ícone que fica sobreposta */}
                <div className="absolute -top-6 left-8 bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-500">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-ja-dark dark:text-white mt-6 mb-3 transition-colors duration-500">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantias e Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-ja-dark dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl flex flex-col lg:flex-row border border-transparent dark:border-gray-800 transition-colors duration-500">
          
          <div className="p-10 lg:p-16 lg:w-3/5 text-white flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-6">O Nosso Compromisso</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Importar um carro não tem de ser uma dor de cabeça. A JA Automóveis assegura que a viatura importada cumpre exatamente os mesmos padrões rigorosos de qualidade dos carros que temos no nosso stand físico.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {guarantees.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-ja-blue flex-shrink-0" />
                  <span className="text-sm text-gray-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div>
              <Link 
                to="/contactos" 
                state={{ scrollToForm: true, assunto: 'Processo de Importação' }}
                className="inline-flex items-center gap-2 bg-ja-blue hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-sm"
              >
                Pedir Orçamento Gratuito
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Imagem Ilustrativa Direita */}
          <div className="lg:w-2/5 min-h-[300px] relative bg-gray-800">
            <img 
              src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=1000&auto=format&fit=crop" 
              alt="Transporte de Veículos" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          </div>

        </div>
      </section>

    </div>
  );
}