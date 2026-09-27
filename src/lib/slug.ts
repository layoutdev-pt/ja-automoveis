/** Normaliza um valor para uso seguro em URLs (ex.: "Citroën" -> "citroen"). */
export const slugify = (value: string): string =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
