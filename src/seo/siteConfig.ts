export const SITE_URL = 'https://jaautomoveis.pt';

export const BUSINESS = {
  name: 'JA Automóveis',
  legalName: 'JA Automóveis, Lda.',
  street: 'Av. Cidade do Rio de Janeiro',
  city: 'Covilhã',
  region: 'Castelo Branco',
  postalCode: '6200-563',
  country: 'PT',
  phone: '+351961650396',
  phoneDisplay: '+351 961 650 396',
  email: 'jaautomoveis553@gmail.com',
  latitude: 40.283471,
  longitude: -7.492407,
  logo: `${SITE_URL}/ja_logo.svg`,
  image: `${SITE_URL}/imagens/Importado.jpeg`,
  priceRange: '€€',
} as const;

export const SOCIAL = [
  'https://www.instagram.com/ja_automoveislda/',
  'https://www.facebook.com/p/JA-Automoveis-61552577480402/',
] as const;

export const OPENING_HOURS = [
  { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '19:00' },
  { days: ['Saturday'], opens: '09:00', closes: '13:00' },
] as const;

/**
 * Valor único de garantia usado em todo o site.
 * Substitui as contradições anteriores (18 meses no FAQ/Importação,
 * 24 meses nos cartões, 6/12/18/24 nos Termos).
 */
export const WARRANTY_MONTHS = 18;
export const WARRANTY_LABEL = `${WARRANTY_MONTHS} meses`;
export const WARRANTY_SENTENCE = `garantia por mútuo acordo de ${WARRANTY_MONTHS} meses`;

export const DEFAULT_OG_IMAGE = `${SITE_URL}/ja_logo_white.png`;

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
