import { useEffect, useRef, useState } from 'react';
import { HomeFilterBar } from './HomeFilterBar'; // Importar o filtro

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useEffect(() => {
    // O vídeo (15 MB) só começa a carregar depois do primeiro paint e apenas
    // quando o hero está efetivamente visível. Até lá mostra-se o poster (105 KB),
    // que passa a ser o elemento LCP.
    if (typeof window === 'undefined') return;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection?.saveData;
    if (reducedMotion || saveData) return;

    const el = videoRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      // Fora do ciclo síncrono do efeito, para não encadear renderizações.
      const id = setTimeout(() => setShouldLoadVideo(true), 0);
      return () => clearTimeout(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(e => e.isIntersecting)) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoadVideo) videoRef.current?.load();
  }, [shouldLoadVideo]);

  return (
    // 1. Removido o 'overflow-hidden' daqui da <section> principal
    <section className="relative w-full flex flex-col bg-[#0a0a0a] mt-[116px] md:mt-[4px]">

      {/* ================= VÍDEO E MÁSCARA ================= */}
      {/* 2. Mantemos o 'overflow-hidden' NESTE bloco apenas para segurar a sombra gigante da máscara */}
      <div className="relative w-full flex items-center justify-center overflow-hidden z-10">

        {/* Fundo com Vídeo — poster leve + carregamento diferido */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/imagens/hero-poster.jpg"
          aria-label="Instalações da JA Automóveis na Covilhã"
          className="w-full h-auto block"
        >
          {shouldLoadVideo && (
            <source
              src="/videos/jr_stand_vid_compressed.mp4"
              type="video/mp4"
            />
          )}
        </video>

        {/* MÁSCARA (Logótipo) - Mantida com a tua opacity-70 e tamanhos */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden opacity-70">
          <img
            src="/ja_logo.svg"
            alt="JA Automóveis"
            width={450}
            height={140}
            fetchPriority="high"
            className="w-64 md:w-80 lg:w-[450px] object-contain shadow-[0_0_0_9999px_black]"
          />
        </div>

      </div>

      {/* ================= BARRA DE FILTROS FLUTUANTE SOBREPOSTA NO FUNDO DO VÍDEO (Apenas PC) ================= */}
      {/* 3. Posicionamento dinâmico no fundo do vídeo (bottom-6 / lg:bottom-8) para qualquer resolução de ecrã */}
      <div className="hidden lg:block absolute bottom-6 lg:bottom-8 left-0 w-full z-30 px-4 sm:px-6 lg:px-8 pointer-events-none">
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
