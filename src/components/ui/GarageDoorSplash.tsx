import { useState, useEffect } from "react";

/**
 * GarageDoorSplash
 *
 * Animação de entrada simplificada com 4 fases sequenciais estritas:
 *
 * Fundo e Estrutura:
 * - Duas secções pretas sólidas e 100% opacas (#000000) unidas no centro horizontal.
 * - Scroll bloqueado na totalidade durante a animação.
 *
 * Fase 1: Exposição Inicial
 * - O logótipo branco surge no centro exato do ecrã por transição de opacidade (0 -> 1).
 *
 * Fase 2: Ocultação
 * - O logótipo desvanece por completo (1 -> 0) antes de qualquer outro evento.
 * - Garante que o vetor nunca é cortado ao meio durante a divisão.
 *
 * Fase 3: Eixo de Abertura
 * - O fundo preto cinde-se ao meio horizontalmente.
 * - Secção superior desliza em bloco pelo topo (translateY: -100%).
 * - Secção inferior desliza em bloco pela base (translateY: 100%).
 *
 * Fase 4: Libertação
 * - Concluído o movimento, a estrutura é inativada e desmontada.
 * - O bloqueio de scroll é levantado e o site fica imediatamente interativo.
 */

interface GarageDoorSplashProps {
  /** Se verdadeiro, força a execução da animação mesmo que já tenha ocorrido nesta sessão */
  forcePlay?: boolean;
  /** Callback opcional quando a animação termina */
  onComplete?: () => void;
}

export function GarageDoorSplash({
  forcePlay = false,
  onComplete,
}: GarageDoorSplashProps) {
  // Estados da sequência:
  // 'initial'   -> portas fechadas, logo invisível
  // 'fadeIn'    -> logo transita 0 -> 1
  // 'visible'   -> logo totalmente visível no centro
  // 'fadeOut'   -> logo transita 1 -> 0
  // 'splitting' -> portas abrem para cima e para baixo
  // 'finished'  -> tudo terminado, scroll restaurado, componente removido
  const SESSION_KEY = "ja_splash_played";

  /** Só deve tocar uma vez por sessão — e nunca em SSR/pré-renderização. */
  const shouldPlay = () => {
    if (typeof window === "undefined") return false;
    if (forcePlay) return true;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) !== "1";
    } catch {
      return false;
    }
  };

  // A primeira renderização do cliente tem de ser idêntica ao HTML
  // pré-renderizado (que nunca contém o splash), caso contrário a hidratação
  // falha com o erro React #418. Por isso arrancamos sempre vazio e só
  // ativamos a animação depois da montagem.
  const [phase, setPhase] = useState<
    "initial" | "fadeIn" | "visible" | "fadeOut" | "splitting" | "finished"
  >("finished");
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    // Já tocou nesta sessão (ou estamos em SSR): não bloqueia nada nem anima.
    if (!shouldPlay()) {
      return;
    }

    // Só agora, depois da hidratação, o splash entra em cena. O arranque é
    // agendado para fora do ciclo síncrono do efeito, evitando o encadeamento
    // de renderizações que o React sinaliza.
    const start = window.setTimeout(() => {
      setIsRendered(true);
      setPhase("initial");
    }, 0);

    try {
      window.sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* sessionStorage indisponível (modo privado): a animação corre à mesma */
    }

    // Bloquear estritamente o scroll da página durante a animação
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Cronologia de execução:
    // 0ms: Início (portas fechadas)
    // 50ms: Fase 1 - Exposição Inicial (fade-in do logótipo durante 700ms)
    const t1 = setTimeout(() => {
      setPhase("fadeIn");
    }, 50);

    // 800ms: Logótipo totalmente visível (pausa dramática de contemplação da marca de 500ms)
    const t2 = setTimeout(() => {
      setPhase("visible");
    }, 800);

    // 1300ms: Fase 2 - Ocultação (fade-out completo do logótipo durante 500ms)
    const t3 = setTimeout(() => {
      setPhase("fadeOut");
    }, 1300);

    // 1850ms: Fase 3 - Eixo de Abertura (o logótipo já está 100% invisível; as portas cindem-se em bloco durante 900ms)
    const t4 = setTimeout(() => {
      setPhase("splitting");
    }, 1850);

    // 2800ms: Fase 4 - Libertação (conclusão do movimento mecânico)
    const t5 = setTimeout(() => {
      setPhase("finished");
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      if (onComplete) onComplete();

      // Desmontar o componente após garantir a limpeza
      setTimeout(() => {
        setIsRendered(false);
      }, 50);
    }, 2800);

    // Permitir avançar imediatamente com tecla Escape ou clique se o utilizador desejar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipAnimation();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(start);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [forcePlay, onComplete]);

  const skipAnimation = () => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    setPhase("finished");
    setIsRendered(false);
    if (onComplete) onComplete();
  };

  if (!isRendered || phase === "finished") {
    return null;
  }

  // Controlo da opacidade do logótipo:
  // - initial: 0
  // - fadeIn: 1
  // - visible: 1
  // - fadeOut: 0
  // - splitting / finished: 0
  const isLogoVisible = phase === "fadeIn" || phase === "visible";

  // Controlo da posição das portas pretas:
  // - splitting: aberta (topo sobe -100%, base desce +100%)
  const isDoorsOpen = phase === "splitting";

  return (
    <div
      className="fixed inset-0 z-9999999 pointer-events-auto select-none overflow-hidden"
      aria-label="Abertura JA Automóveis"
      onClick={skipAnimation}
    >
      {/* ================= SECÇÃO SUPERIOR (PORTÃO DO TOPO) ================= */}
      <div
        className="absolute top-0 left-0 w-full h-[50.2vh] bg-gradient-to-br from-ja-dark to-ja-blue bg-[length:100vw_100vh] bg-top will-change-transform"
        style={{
          transform: isDoorsOpen
            ? "translate3d(0, -100%, 0)"
            : "translate3d(0, 0, 0)",
          transition: isDoorsOpen
            ? "transform 900ms cubic-bezier(0.77, 0, 0.175, 1)"
            : "none",
        }}
      />

      {/* ================= SECÇÃO INFERIOR (PORTÃO DA BASE) ================= */}
      <div
        className="absolute bottom-0 left-0 w-full h-[50.2vh] bg-gradient-to-br from-ja-dark to-ja-blue bg-[length:100vw_100vh] bg-bottom will-change-transform"
        style={{
          transform: isDoorsOpen
            ? "translate3d(0, 100%, 0)"
            : "translate3d(0, 0, 0)",
          transition: isDoorsOpen
            ? "transform 900ms cubic-bezier(0.77, 0, 0.175, 1)"
            : "none",
        }}
      />

      {/* ================= LOGÓTIPO BRANCO NO CENTRO EXATO ================= */}
      {/* 
        Posicionado no centro absoluto do ecrã (top: 50%, left: 50%, translate: -50% -50%).
        Fica sobreposto ao fundo preto sólido.
        Na Fase 2 (fadeOut), a opacidade transita para 0 ANTES de qualquer movimento das portas.
      */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center pointer-events-none will-change-opacity"
        style={{
          opacity: isLogoVisible ? 1 : 0,
          transition:
            phase === "fadeIn"
              ? "opacity 700ms cubic-bezier(0.4, 0, 0.2, 1)"
              : phase === "fadeOut"
                ? "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)"
                : "opacity 0ms",
        }}
      >
        {/* Vetor do Logótipo Branco JA */}
        <div className="flex flex-col items-center gap-3">
          <img
            src="/ja_logo_clean_white.svg"
            alt="JA Automóveis"
            className="w-48 sm:w-60 md:w-72 lg:w-80 h-auto object-contain brightness-0 invert drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
          />

          <div className="flex flex-col items-center tracking-wider">
            <span className="text-white text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase opacity-90 mt-1">
              AUTOMÓVEIS
            </span>
            <span className="text-gray-400 text-[10px] sm:text-xs tracking-[0.25em] uppercase mt-0.5 opacity-75">
              Since 1993
            </span>
          </div>
        </div>
      </div>


    </div>
  );
}
