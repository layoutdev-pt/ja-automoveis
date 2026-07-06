import { useRef, useEffect, useState } from "react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Iniciamos como true para garantir que o autoplay funcione
  const [isMuted, setIsMuted] = useState(true); 

  useEffect(() => {
    if (videoRef.current) {
      // Já deixamos o volume configurado para 20% para quando o usuário desmutar
      videoRef.current.volume = 0.2; 
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      // Inverte o estado atual (se tá mutado, desmuta, e vice-versa)
      const nextMutedState = !isMuted;
      videoRef.current.muted = nextMutedState;
      setIsMuted(nextMutedState);
    }
  };

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center mt-[-80px]">
      {/* Fundo com Vídeo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted} /* Agora o React controla se é mudo ou não */
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src="videos/jr_stand_vid_compressed.mp4" 
            type="video/mp4" 
          />
        </video>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Botão de Controle de Som */}
      <div className="absolute bottom-8 right-8 z-10">
        <button 
          onClick={toggleMute}
          className="flex items-center justify-center p-3 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all border border-white/20"
          aria-label={isMuted ? "Ativar som" : "Desativar som"}
        >
          {isMuted ? (
            // Ícone de Mudo (pode trocar pelo do Lucide/Heroicons se usar)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            // Ícone de Som Ativo
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          )}
        </button>
      </div>
    </section>
  );
}