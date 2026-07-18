import { HomeFilterBar } from './HomeFilterBar'; // Importar o filtro

export function HeroSection() {
  return (
    // Mantivemos o teu margin-top e adicionámos overflow-hidden para a sombra não vazar
    <section className="relative w-full flex items-center justify-center bg-[#0a0a0a] mt-[116px] md:mt-[4px] overflow-hidden">
      
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
      
      {/* MÁSCARA (Logótipo) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden opacity-70">
        <img 
          src="/ja_logo.svg" 
          alt="JA Automóveis" 
          className="w-64 md:w-80 lg:w-[450px] object-contain shadow-[0_0_0_9999px_black]" 
        />
      </div>

      {/* BARRA DE FILTROS FLUTUANTE TRANSPARENTE NO TOPO */}
      <div className="absolute top-0 left-0 w-full z-20 pt-6 md:pt-40 px-4 sm:px-6 lg:px-8">
        <HomeFilterBar />
      </div>

    </section>
  );
}