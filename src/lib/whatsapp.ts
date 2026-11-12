import { BUSINESS } from '../seo/siteConfig';
import type { Vehicle } from '../types';

/** wa.me só aceita dígitos (sem "+", espaços ou traços). */
const WHATSAPP_NUMBER = BUSINESS.phone.replace(/\D/g, '');

/** Link wa.me com mensagem pré-preenchida. */
export const whatsappLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

/** Mensagem personalizada sobre uma viatura. */
export const vehicleWhatsappMessage = (vehicle: Vehicle): string => {
  const nome = [vehicle.marca, vehicle.modelo, vehicle.versao].filter(Boolean).join(' ');

  const detalhes = [
    String(vehicle.ano),
    vehicle.quilometros != null ? `${new Intl.NumberFormat('pt-PT').format(vehicle.quilometros)} km` : null,
    formatPrice(vehicle.preco),
  ].filter(Boolean).join(' · ');

  return `Olá! Tenho interesse no ${nome} (${detalhes}). ` +
    'Ainda está disponível? Gostava de saber mais detalhes.';
};
