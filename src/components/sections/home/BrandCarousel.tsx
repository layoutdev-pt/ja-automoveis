export function BrandCarousel() {
  // Lista de marcas com os caminhos corretos baseados na tua pasta public/imagens/logos/
  const brands = [
    { name: 'Audi', src: '/imagens/logos/audi.webp' },
    { name: 'BMW', src: '/imagens/logos/bmw.webp' },
    { name: 'Citroën', src: '/imagens/logos/citroen.webp' },
    { name: 'Dacia', src: '/imagens/logos/dacia.webp' },
    { name: 'Ford', src: '/imagens/logos/ford.webp' },
    { name: 'Kia', src: '/imagens/logos/kia.webp' },
    { name: 'Mercedes-Benz', src: '/imagens/logos/mercedes.webp' },
    { name: 'Nissan', src: '/imagens/logos/nissan.webp' },
    { name: 'Peugeot', src: '/imagens/logos/peugeot.webp' },
    { name: 'Renault', src: '/imagens/logos/renault.webp' }, // Troca esta imagem na tua pasta!
    { name: 'Seat', src: '/imagens/logos/seat.webp' },
    { name: 'Toyota', src: '/imagens/logos/toyota.webp' },
    { name: 'Volkswagen', src: '/imagens/logos/volkswagen.webp' },
    { name: 'Volvo', src: '/imagens/logos/volvo.webp' }
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0a0a0a] py-12 border-b border-gray-100 dark:border-gray-900 overflow-hidden transition-colors duration-500">
      
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
          .pause-on-hover:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-10 transition-colors duration-500">
          Marcas que comercializamos
        </p>
        
        <div className="relative flex overflow-hidden pause-on-hover [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          
          {/* Pista 1 */}
          <div className="flex shrink-0 animate-marquee items-center gap-12 md:gap-20 pr-12 md:pr-20">
            {brands.map((brand, index) => (
              <div 
                key={`brand1-${index}`} 
                className="flex items-center justify-center cursor-pointer"
              >
                <img 
                  src={brand.src} 
                  alt={`Logótipo ${brand.name}`} 
                  // ADICIONADO: mix-blend-multiply para fundos brancos (dark:mix-blend-normal para não estragar o modo escuro)
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain grayscale opacity-60 mix-blend-multiply dark:mix-blend-normal hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 dark:brightness-200 dark:contrast-200 dark:hover:brightness-100 dark:hover:contrast-100" 
                />
              </div>
            ))}
          </div>

          {/* Pista 2 */}
          <div className="flex shrink-0 animate-marquee items-center gap-12 md:gap-20 pr-12 md:pr-20" aria-hidden="true">
            {brands.map((brand, index) => (
              <div 
                key={`brand2-${index}`} 
                className="flex items-center justify-center cursor-pointer"
              >
                <img 
                  src={brand.src} 
                  alt={`Logótipo ${brand.name}`} 
                  className="h-10 md:h-12 lg:h-14 w-auto object-contain grayscale opacity-60 mix-blend-multiply dark:mix-blend-normal hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 dark:brightness-200 dark:contrast-200 dark:hover:brightness-100 dark:hover:contrast-100" 
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}