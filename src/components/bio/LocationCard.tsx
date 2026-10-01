import { useEffect, useRef, useState } from 'react';
import { Card } from './Card';
import { contacts, location } from './data';
import { ArrowUpRight, Pin } from './icons';

/** Converte latitude/longitude nos ângulos do cobe. */
const toAngles = (lat: number, lng: number) => [
  Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
  (lat * Math.PI) / 180,
];

/**
 * Globo WebGL (cobe, ~6 KB) carregado só quando o card se aproxima do ecrã.
 * Roda continuamente muito devagar (1°/s) e pára fora do ecrã.
 */
function Globe() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    let disposed = false;
    let cleanup = () => {};

    const mount = async () => {
      let createGlobe: typeof import('cobe').default;
      try {
        createGlobe = (await import('cobe')).default;
      } catch {
        return;
      }
      if (disposed) return;

      const { lat, lng } = location;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const small = window.matchMedia('(max-width: 639px)').matches;
      // Visão perto do equador e um pouco a oeste de Portugal: o país fica no topo visível.
      const [phi0] = toAngles(lat, lng - 4);
      let width = canvas.offsetWidth;
      let globe: ReturnType<typeof createGlobe>;
      try {
        globe = createGlobe(canvas, {
          devicePixelRatio: dpr,
          width: width * dpr,
          height: width * dpr,
          phi: phi0,
          theta: 0.05,
          dark: 1,
          diffuse: 1.15,
          scale: 1,
          mapSamples: small ? 11000 : 16000,
          mapBrightness: 7,
          mapBaseBrightness: 0,
          baseColor: [0.32, 0.32, 0.35],
          markerColor: [0, 0.333, 1],
          glowColor: [0.1, 0.12, 0.2],
          markers: [{ location: [lat, lng], size: 0.06 }],
          opacity: 1,
        });
      } catch {
        return; // Sem WebGL: o card continua legível sem o globo.
      }

      // Rotação contínua muito lenta: 1° por segundo, no sentido natural da Terra.
      const SPEED = Math.PI / 180;
      let phi = phi0;
      let raf = 0;
      let last = 0;
      let visible = false;

      const frame = (now: number) => {
        const dt = last ? Math.min(now - last, 50) : 0;
        last = now;
        phi += (dt / 1000) * SPEED;
        const pulse = 0.055 + (Math.sin(now / 650) + 1) * 0.012;
        globe.update({ phi, markers: [{ location: [lat, lng], size: pulse }] });
        if (visible) raf = requestAnimationFrame(frame);
      };

      const ro = new ResizeObserver(() => {
        width = canvas.offsetWidth;
        globe.update({ width: width * dpr, height: width * dpr });
        if (!visible) globe.update({ phi });
      });
      ro.observe(canvas);

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(raf);
        last = 0;
        if (visible) raf = requestAnimationFrame(frame);
      });
      io.observe(wrapper);

      // O mapa do cobe carrega de forma assíncrona: redesenha até a textura chegar.
      globe.update({ phi });
      const retries = [120, 400, 1000, 2500].map((ms) =>
        window.setTimeout(() => !visible && globe.update({ phi }), ms),
      );
      setOn(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        retries.forEach(window.clearTimeout);
        io.disconnect();
        ro.disconnect();
        globe.destroy();
      };
    };

    // Só carrega quando o card se aproxima do ecrã.
    const lazy = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        lazy.disconnect();
        mount();
      },
      { rootMargin: '200px' },
    );
    lazy.observe(wrapper);

    return () => {
      disposed = true;
      lazy.disconnect();
      cleanup();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`globe${on ? ' is-on' : ''}`} aria-hidden="true">
      <canvas ref={canvasRef} className="globe__canvas" />
    </div>
  );
}

export function LocationCard({ delay = 0 }: { delay?: number }) {
  const { lines, mapsUrl } = contacts.address;
  return (
    <Card
      className="location"
      href={mapsUrl}
      label={`${location.label}, ${lines.join(', ')}. Abrir no Google Maps`}
      delay={delay}
    >
      <Globe />
      <div className="location__fade" aria-hidden="true" />

      <div className="location__top">
        <span className="chip" aria-hidden="true">
          <Pin />
        </span>
        <span className="arrow" aria-hidden="true">
          <ArrowUpRight />
        </span>
      </div>

      <div className="location__bottom">
        <h2 className="location__label">{location.label}</h2>
        <p className="mono location__address">
          {lines.map((line, i) => (
            <span key={line}>
              {i > 0 && ' '}
              <span className="nowrap">
                {line}
                {i < lines.length - 1 ? ',' : ''}
              </span>
            </span>
          ))}
        </p>
      </div>
    </Card>
  );
}
