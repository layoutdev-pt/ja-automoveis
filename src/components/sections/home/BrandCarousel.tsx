export function BrandCarousel() {
  // Lista de marcas (adicionei algumas extras para garantir que preenche ecrãs ultrawide no loop)
  const brands = [
    'Renault', 'Peugeot', 'Mercedes-Benz', 'Toyota', 
    'BMW', 'Dacia', 'Volkswagen', 'Citroën', 'Nissan',
    'Audi', 'Volvo', 'Ford', 'Seat', 'Kia'
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-12 border-b border-gray-100 dark:border-gray-900 overflow-hidden transition-colors duration-500">
      
      {/* Estilos inline para a animação do carrossel funcionar out-of-the-box */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
          /* Pausa a animação quando o rato passa por cima */
          .pause-on-hover:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-8 transition-colors duration-500">
          Marcas que comercializamos
        </p>
        
        {/* Contentor do Carrossel com máscara de desvanecimento (fade) nos cantos */}
        <div className="relative flex overflow-hidden pause-on-hover [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          
          {/* Pista 1 */}
          <div className="flex shrink-0 animate-marquee items-center gap-12 md:gap-16 pr-12 md:pr-16 opacity-70">
            {brands.map((brand, index) => (
              <div 
                key={`brand1-${index}`} 
                className="text-xl md:text-2xl font-bold text-gray-300 dark:text-gray-600 hover:text-ja-dark dark:hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {/* Futuramente podes trocar {brand} por <img src="..." /> */}
                {brand}
              </div>
            ))}
          </div>

          {/* Pista 2 (Duplicada exatamenta igual para o loop infinito não ter quebras) */}
          <div className="flex shrink-0 animate-marquee items-center gap-12 md:gap-16 pr-12 md:pr-16 opacity-70" aria-hidden="true">
            {brands.map((brand, index) => (
              <div 
                key={`brand2-${index}`} 
                className="text-xl md:text-2xl font-bold text-gray-300 dark:text-gray-600 hover:text-ja-dark dark:hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {brand}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}