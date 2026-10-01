import type { Vehicle } from '../types';
import {
  BUSINESS, OPENING_HOURS, SITE_URL, SOCIAL, WARRANTY_MONTHS, absoluteUrl,
} from './siteConfig';

const ORG_ID = `${SITE_URL}/#autodealer`;

export const localBusinessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'AutoDealer',
  '@id': ORG_ID,
  name: BUSINESS.name,
  legalName: BUSINESS.legalName,
  url: SITE_URL,
  logo: BUSINESS.logo,
  image: BUSINESS.image,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  priceRange: BUSINESS.priceRange,
  currenciesAccepted: 'EUR',
  areaServed: { '@type': 'Country', name: 'Portugal' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postalCode,
    addressCountry: BUSINESS.country,
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
  openingHoursSpecification: OPENING_HOURS.map(h => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  })),
  sameAs: [...SOCIAL],
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BUSINESS.name,
  // O Google usa name/alternateName para o "nome do site" nos resultados.
  alternateName: ['JA Automoveis', 'jaautomoveis.pt'],
  inLanguage: 'pt-PT',
  publisher: { '@id': ORG_ID },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/stand?marca={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const howToSchema = (
  name: string,
  description: string,
  steps: { title: string; description: string }[],
) => ({
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name,
  description,
  inLanguage: 'pt-PT',
  totalTime: 'P45D',
  provider: { '@id': ORG_ID },
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.title.replace(/^\d+\.\s*/, ''),
    text: s.description,
    url: `${SITE_URL}/importacao#passo-${i + 1}`,
  })),
});

const FUEL_MAP: Record<string, string> = {
  'Diesel': 'Diesel',
  'Gasolina': 'Gasoline',
  'Eléctrico': 'Electric',
  'Híbrido (Gasolina)': 'Hybrid',
  'Híbrido Plug-in Gasolina': 'Plug-in Hybrid',
};

/**
 * `estado === 'Novo'` na base de dados significa, na prática, "nova entrada no
 * stand" — surge em viaturas com vários anos. Declarar NewCondition numa
 * viatura usada é uma afirmação factualmente incorreta no schema, pelo que só
 * a assumimos quando os restantes dados a confirmam.
 */
const conditionOf = (vehicle: Vehicle) => {
  const km = vehicle.quilometros;
  const ehNova =
    vehicle.estado === 'Novo' &&
    (km == null || km <= 100) &&
    vehicle.ano >= new Date().getFullYear() - 1;
  return ehNova
    ? 'https://schema.org/NewCondition'
    : 'https://schema.org/UsedCondition';
};

export const vehicleSchema = (vehicle: Vehicle) => {
  const path = `/stand/${vehicle.id}`;
  const url = absoluteUrl(path);
  const nome = [vehicle.marca, vehicle.modelo, vehicle.versao].filter(Boolean).join(' ');
  const fotos = (vehicle.fotos || []).filter(f => f && !/\.(mp4|webm|ogg|mov|m4v)$/i.test(f));
  const garantia = vehicle.garantia;

  return {
    '@context': 'https://schema.org',
    '@type': 'Vehicle',
    '@id': `${url}#vehicle`,
    name: nome,
    url,
    description:
      vehicle.descricao ||
      `${nome} de ${vehicle.ano} disponível na JA Automóveis, na Covilhã.`,
    brand: { '@type': 'Brand', name: vehicle.marca },
    model: vehicle.modelo,
    vehicleModelDate: String(vehicle.ano),
    productionDate: String(vehicle.ano),
    itemCondition: conditionOf(vehicle),
    image: fotos.length ? fotos : [BUSINESS.image],
    ...(vehicle.combustivel && {
      fuelType: FUEL_MAP[vehicle.combustivel] || vehicle.combustivel,
    }),
    ...(vehicle.transmissao && { vehicleTransmission: vehicle.transmissao }),
    ...(vehicle.segmento && { bodyType: vehicle.segmento }),
    ...(vehicle.motor && { vehicleEngine: { '@type': 'EngineSpecification', name: vehicle.motor } }),
    ...(vehicle.quilometros != null && {
      mileageFromOdometer: {
        '@type': 'QuantitativeValue',
        value: vehicle.quilometros,
        unitCode: 'KMT',
      },
    }),
    ...(garantia && {
      warranty: {
        '@type': 'WarrantyPromise',
        durationOfWarranty: {
          '@type': 'QuantitativeValue',
          value: WARRANTY_MONTHS,
          unitCode: 'MON',
        },
      },
    }),
    offers: {
      '@type': 'Offer',
      '@id': `${url}#offer`,
      url,
      price: vehicle.preco,
      priceCurrency: 'EUR',
      itemCondition: conditionOf(vehicle),
      availability: vehicle.em_stock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/SoldOut',
      seller: { '@id': ORG_ID },
      availableAtOrFrom: { '@id': ORG_ID },
    },
  };
};

export const itemListSchema = (vehicles: Vehicle[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: vehicles.length,
  itemListElement: vehicles.slice(0, 30).map((v, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: absoluteUrl(`/stand/${v.id}`),
    name: [v.marca, v.modelo].filter(Boolean).join(' '),
  })),
});
