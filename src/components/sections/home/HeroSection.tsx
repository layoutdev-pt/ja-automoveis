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
      
      {/* 
        A MÁSCARA ESTÁ AQUI:
        A opacidade neste container (ex: opacity-70 ou opacity-80) vai controlar 
        exatamente o quão escuro o vídeo fica no ecrã inteiro, permitindo que as letras 
        brilhem a 100% pelo meio.
      */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden opacity-70">
        <img 
          src="/ja_logo.svg" 
          alt="JA Automóveis" 
          // 1. O tamanho voltou ao normal (w-64 a w-[450px])
          // 2. A classe shadow-[0_0_0_9999px_black] cria um fundo preto infinito a partir das bordas da imagem
          className="w-64 md:w-80 lg:w-[450px] object-contain shadow-[0_0_0_9999px_black]" 
        />
      </div>

    </section>
  );
}