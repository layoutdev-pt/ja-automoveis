import { HomeFilterBar } from './HomeFilterBar'; // Importar o filtro

export function HeroSection() {
  return (
    // Mantidas exatamente as tuas proporções e margens do PC (mt-[116px] md:mt-[4px])
    // Mudamos para 'flex-col' para que no mobile a barra consiga ir para debaixo do vídeo
    <section className="relative w-full flex flex-col bg-[#0a0a0a] mt-[116px] md:mt-[4px] overflow-hidden">
      
      {/* ================= VÍDEO E MÁSCARA ================= */}
      <div className="relative w-full flex items-center justify-center overflow-hidden">
        
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

        {/* BARRA DE FILTROS FLUTUANTE TRANSPARENTE NO TOPO (Apenas PC) */}
        {/* O 'hidden lg:block' faz com que desapareça no telemóvel para não tapar o vídeo */}
        <div className="hidden lg:block absolute top-0 left-0 w-full z-20 pt-6 md:pt-[860px] px-4 sm:px-6 lg:px-8">
          <HomeFilterBar />
        </div>

      </div>

      {/* ================= BARRA DE FILTROS EMBUTIDA (Apenas Mobile/Tablet) ================= */}
      {/* O 'block lg:hidden' faz com que só apareça no telemóvel, posicionada debaixo do vídeo */}
      <div className="block lg:hidden w-full px-4 py-4 sm:p-6 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800 z-20 relative shadow-sm transition-colors duration-500">
        <HomeFilterBar />
      </div>

    </section>
  );
}