import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { media, routes } from './data';
import { Lock, Pause, Play } from './icons';

type Phase = 'closed' | 'open' | 'on' | 'booted';

/**
 * Portátil 3D (estilo MacBook) com o vídeo do stand no ecrã. Só CSS 3D.
 * Ao chegar à secção: a tampa abre (1,2 s) → o ecrã liga com o logótipo → o site aparece.
 * Sem JavaScript (ou antes da hidratação) aparece aberto, com o poster do vídeo.
 */
export function LaptopMockup() {
  const rootRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [armed, setArmed] = useState(false);
  const [phase, setPhase] = useState<Phase>('closed');
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const booted = phase === 'booted';

  // Observadores: carregar o vídeo, abrir a tampa e reproduzir só quando visível.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    setArmed(true);

    const timers: number[] = [];
    const loader = new IntersectionObserver(([e]) => e.isIntersecting && setLoaded(true), {
      rootMargin: '600px 0px',
    });
    const opener = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        opener.disconnect();
        setPhase('open');
        timers.push(window.setTimeout(() => setPhase('on'), 1000));
        timers.push(window.setTimeout(() => setPhase('booted'), 1900));
      },
      { threshold: 0.5 },
    );
    const viewer = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });

    loader.observe(root);
    opener.observe(root);
    viewer.observe(root);
    return () => {
      loader.disconnect();
      opener.disconnect();
      viewer.disconnect();
      timers.forEach(window.clearTimeout);
    };
  }, []);

  // As <source> só entram quando a secção se aproxima: o vídeo tem de recarregar.
  useEffect(() => {
    if (loaded) videoRef.current?.load();
  }, [loaded]);

  // O site só começa a correr depois de o portátil "ligar".
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (booted && inView && !userPaused) video.play().catch(() => {});
    else video.pause();
  }, [booted, inView, userPaused, loaded]);

  // Inclinação 3D subtil a seguir o cursor (só com rato).
  const tilt = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !bodyRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    bodyRef.current.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    bodyRef.current.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`);
  };
  const untilt = () => {
    bodyRef.current?.style.setProperty('--ry', '0deg');
    bodyRef.current?.style.setProperty('--rx', '0deg');
  };

  const className = [
    'laptop',
    armed && 'is-armed',
    phase !== 'closed' && 'is-open',
    (phase === 'on' || booted) && 'is-on',
    booted && 'is-booted',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure ref={rootRef} className={className} onPointerMove={tilt} onPointerLeave={untilt}>
      <div className="laptop__stage">
        <div ref={bodyRef} className="laptop__body">
          <div className="laptop__lid">
            {/* Face exterior da tampa (visível quando está fechada) */}
            <div className="laptop__back" aria-hidden="true" />

            {/* Face interior: aro + ecrã */}
            <div className="laptop__front">
              <span className="laptop__camera" aria-hidden="true" />
              <Link className="laptop__screen" to={routes.home} aria-label={`Abrir ${routes.homeLabel}`}>
                <video
                  ref={videoRef}
                  className="laptop__video"
                  muted
                  loop
                  playsInline
                  preload={loaded ? 'auto' : 'none'}
                  disablePictureInPicture
                  aria-hidden="true"
                  tabIndex={-1}
                  poster={`${media.video}-poster.webp`}
                >
                  {loaded && <source src={`${media.video}.webm`} type="video/webm" />}
                  {loaded && <source src={`${media.video}.mp4`} type="video/mp4" />}
                </video>
                <span className="laptop__boot" aria-hidden="true">
                  <img src={media.whiteLogo} alt="" width={200} height={200} />
                </span>
                <span className="laptop__glare" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="laptop__base" aria-hidden="true">
            <span className="laptop__notch" />
          </div>
        </div>
        <div className="laptop__shadow" aria-hidden="true" />
      </div>

      <figcaption className="laptop__caption">
        <Link className="laptop__url" to={routes.home}>
          <Lock />
          <span>{routes.homeLabel}</span>
        </Link>
        <button
          className="laptop__toggle"
          type="button"
          aria-pressed={userPaused}
          aria-label={userPaused ? 'Reproduzir a pré-visualização' : 'Pausar a pré-visualização'}
          onClick={() => setUserPaused((p) => !p)}
        >
          {userPaused ? <Play /> : <Pause />}
        </button>
      </figcaption>
    </figure>
  );
}
