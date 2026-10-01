import { useEffect, useState, type CSSProperties, type RefObject } from 'react';
import { hours, timeZone } from './data';

/** Atraso da animação de entrada de um elemento ([data-reveal]). */
export const revealDelay = (ms: number) => ({ '--delay': `${ms}ms` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Estado aberto/fechado (hora da Covilhã, seja qual for o fuso)      */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

export type OpenStatus = { open: boolean; label: string; detail: string; day: number; time: string };

export function getStatus(date = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const day = WEEKDAYS.indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const time = `${get('hour')}:${get('minute')}`;

  const today = hours.find((r) => r.days.includes(day));
  if (today) {
    if (minutes >= toMinutes(today.open) && minutes < toMinutes(today.close)) {
      return { open: true, label: 'Aberto agora', detail: `Fecha às ${today.close}`, day, time };
    }
    if (minutes < toMinutes(today.open)) {
      return { open: false, label: 'Fechado', detail: `Abre hoje às ${today.open}`, day, time };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const next = (day + i) % 7;
    const row = hours.find((r) => r.days.includes(next));
    if (row) {
      const when = i === 1 ? 'amanhã' : DAY_NAMES[next];
      return { open: false, label: 'Fechado', detail: `Abre ${when} às ${row.open}`, day, time };
    }
  }
  return { open: false, label: 'Fechado', detail: '', day, time };
}

/**
 * Estado atual, atualizado a cada minuto.
 * Devolve null no servidor e no 1.º render do cliente (evita erros de hidratação).
 */
export function useOpenStatus() {
  const [status, setStatus] = useState<OpenStatus | null>(null);
  useEffect(() => {
    const paint = () => setStatus(getStatus());
    paint();
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      paint();
      interval = window.setInterval(paint, 60_000);
    }, 60_000 - (Date.now() % 60_000) + 50);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);
  return status;
}

/* ------------------------------------------------------------------ */
/* Entradas animadas                                                    */
/* ------------------------------------------------------------------ */

/** Adiciona "is-in" aos [data-reveal] dentro de root quando entram no ecrã. */
export function useReveal(root: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = root.current;
    if (!enabled || !el) return;
    const items = el.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );
    items.forEach((item) => io.observe(item));
    return () => io.disconnect();
  }, [root, enabled]);
}

/** true depois de `ms` milissegundos desde a montagem. */
export function useAfter(ms: number) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), ms);
    return () => window.clearTimeout(t);
  }, [ms]);
  return done;
}

/** true a partir da montagem no cliente (false no servidor e no 1.º render). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  // Intencional: só passa a true depois da hidratação (SSR e 1.º render do cliente coincidem).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);
  return mounted;
}
