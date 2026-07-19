import { HomeFilterBar } from './HomeFilterBar'; // Importar o filtro

export function HeroSection() {
  return (
    // 1. Removido o 'overflow-hidden' daqui da <section> principal
    <section className="relative w-full flex flex-col bg-[#0a0a0a] mt-[116px] md:mt-[4px]">
      
      {/* ================= VÍDEO E MÁSCARA ================= */}
      {/* 2. Mantemos o 'overflow-hidden' NESTE bloco apenas para segurar a sombra gigante da máscara */}
      <div className="relative w-full flex items-center justify-center overflow-hidden z-10">
        
        {/* Fundo com Vídeo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
        >
          <source 
            src="videos/jr_stand_vid_compressed.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* MÁSCARA (Logótipo) - Mantida com a tua opacity-70 e tamanhos */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden opacity-70">
          <img 
            src="/ja_logo.svg" 
            alt="JA Automóveis" 
            className="w-64 md:w-80 lg:w-[450px] object-contain shadow-[0_0_0_9999px_black]" 
          />
        </div>

      </div>

      {/* ================= BARRA DE FILTROS FLUTUANTE TRANSPARENTE NO TOPO (Apenas PC) ================= */}
      {/* 3. MÁGICA: Este bloco foi movido para FORA da div do vídeo! 
           Como já não está preso no 'overflow-hidden', o menu cai por cima da página à vontade. */}
      <div className="hidden lg:block absolute top-0 left-0 w-full z-30 pt-6 md:pt-[860px] px-4 sm:px-6 lg:px-8 pointer-events-none">
        <div className="pointer-events-auto">
          <HomeFilterBar />
        </div>
      </div>

      {/* ================= BARRA DE FILTROS EMBUTIDA (Apenas Mobile/Tablet) ================= */}
      <div className="block lg:hidden w-full px-4 py-4 sm:p-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 z-20 relative shadow-sm transition-colors duration-500">
        <HomeFilterBar />
      </div>

    </section>
  );
}