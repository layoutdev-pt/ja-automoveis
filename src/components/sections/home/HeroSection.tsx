import { useRef, useEffect } from "react";

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Define o volume (0.0 é mudo, 1.0 é máximo). 
      // 0.2 equivale a 20% do volume original.
      videoRef.current.volume = 0.2; 
    }
  }, []);

  return (
    <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center mt-[-80px]">
      {/* Fundo com Vídeo */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
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
    </section>
  );
}