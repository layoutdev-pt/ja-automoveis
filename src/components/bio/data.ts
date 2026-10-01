/**
 * Conteúdo e dados da JA Automóveis usados no biosite (/bio).
 * Único sítio a editar para mudar textos, horário, contactos e links.
 */

export const brand = {
  name: 'JA Automóveis',
} as const;

/**
 * Links internos do site principal (React Router).
 * Os botões levam à homepage, exceto "Veja as viaturas disponíveis", que leva ao stand.
 */
export const routes = {
  home: '/',
  homeLabel: 'jaautomoveis.pt',
  stand: '/stand',
} as const;

export const credits = {
  name: 'Layout Agency',
  url: 'https://layoutagency.pt',
} as const;

export const location = {
  label: 'Covilhã, Portugal',
  city: 'Covilhã',
  // Coordenadas da cidade da Covilhã (usadas apenas para o globo).
  lat: 40.2806,
  lng: -7.5045,
} as const;

export type HoursRow = {
  label: string;
  /** 0 = domingo … 6 = sábado */
  days: number[];
  open: string;
  close: string;
};

export const hours: HoursRow[] = [
  { label: 'Seg – Sáb', days: [1, 2, 3, 4, 5, 6], open: '09:30', close: '19:30' },
  { label: 'Domingo', days: [0], open: '14:30', close: '19:30' },
];

export const timeZone = 'Europe/Lisbon';

// Mensagem pré-preenchida do WhatsApp: termina em "..." para a pessoa completar.
const whatsappMessage = 'Olá! Vim através do biosite e gostava de falar sobre...';

export const contacts = {
  phone: {
    prefix: '+351',
    number: '961 650 396',
    href: 'tel:+351961650396',
    note: 'Chamada para a rede móvel nacional',
  },
  whatsapp: {
    href: `https://wa.me/351961650396?text=${encodeURIComponent(whatsappMessage)}`,
  },
  email: {
    display: 'jaautomoveis553@gmail.com',
    href: 'mailto:jaautomoveis553@gmail.com',
  },
  address: {
    lines: ['Av. Cidade do Rio de Janeiro', '6200-563 Covilhã'],
    mapsUrl: 'https://maps.google.com/?cid=15482352610267792361',
  },
} as const;

export const copy = {
  showcase: {
    eyebrow: 'Descubra mais',
    title: 'Visite o nosso novo site.',
    text: 'Conheça melhor a JA Automóveis e consulte as viaturas disponíveis, num só lugar.',
    highlight: 'Veja as viaturas disponíveis',
    primaryCta: 'Visitar site',
    secondaryCta: 'Contactar stand',
  },
  contact: {
    eyebrow: 'Contactos',
    title: 'Fale connosco!',
  },
} as const;

/** Vídeo do stand mostrado no portátil (ficheiros em public/bio/media). */
export const media = {
  video: '/bio/media/site-desktop',
  /** Logótipo branco já existente no site principal (public/). */
  whiteLogo: '/ja_logo_clean_white.svg',
} as const;

/** Tempo (ms) até o portão do GarageDoorSplash abrir: a entrada do biosite começa aí. */
export const SPLASH_OPEN_MS = 1850;
