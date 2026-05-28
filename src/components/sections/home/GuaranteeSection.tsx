import { Headset, Award, Timer } from 'lucide-react';

export function GuaranteeSection() {
  const guarantees = [
    {
      icon: <Headset size={32} className="text-ja-blue" />,
      title: 'Apoio ao Cliente',
      description: 'A nossa equipa está sempre disponível para ajudar antes, durante e após a compra.'
    },
    {
      icon: <Award size={32} className="text-ja-blue" />,
      title: 'Reconhecimento',
      description: 'Saiba o que compra: avaliações honestas, classificações e total transparência no estado do veículo.'
    },
    {
      icon: <Timer size={32} className="text-ja-blue" />,
      title: 'Reserva Rápida',
      description: 'Não perca tempo. A nossa equipa garante que o seu novo carro está pronto a levantar em tempo recorde.'
    }
  ];

  return (
    // Fundo adapta-se de branco para escuro profundo
    <section className="py-24 bg-white dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título da Secção */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4 text-ja-dark dark:text-white transition-colors duration-500">
            A Nossa Garantia!
          </h2>
          {/* Sublinhado temático */}
          <div className="w-16 h-1 bg-ja-blue mx-auto rounded-full"></div>
        </div>

        {/* Grelha de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guarantees.map((item, index) => (
            <div 
              key={index} 
              // Cartões adaptam-se com um efeito de hover que lhes dá sombra no modo claro
              className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl dark:hover:shadow-none transition-all duration-300"
            >
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-ja-blue/10 rounded-full inline-block transition-colors duration-500">
                  {item.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-ja-dark dark:text-white transition-colors duration-500">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm transition-colors duration-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}