/**
 * Otimização de imagens no browser, antes do upload para o Supabase.
 * Converte para WebP e limita a 1080p (máx. 1920×1080, sem aumentar imagens pequenas).
 * Os mesmos limites são usados em scripts/optimize-images.mjs para as imagens antigas.
 */
export const MAX_WIDTH = 1920;
export const MAX_HEIGHT = 1080;
export const WEBP_QUALITY = 0.82;

/** Calcula as dimensões que cabem em 1920×1080 mantendo a proporção. */
export const fitWithin1080p = (width: number, height: number) => {
  const scale = Math.min(1, MAX_WIDTH / width, MAX_HEIGHT / height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
};

const canvasToWebp = (canvas: HTMLCanvasElement): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob && blob.type === 'image/webp' ? resolve(blob) : reject(new Error('O browser não conseguiu gerar WebP.'))),
      'image/webp',
      WEBP_QUALITY,
    );
  });

/** Desenha um canvas já recortado (ex.: Cropper) para WebP ≤ 1080p. */
export const canvasToOptimizedWebp = (source: HTMLCanvasElement): Promise<Blob> => {
  const { width, height } = fitWithin1080p(source.width, source.height);
  if (width === source.width && height === source.height) return canvasToWebp(source);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D indisponível.');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, width, height);
  return canvasToWebp(canvas);
};

/** Converte um ficheiro de imagem (JPG, PNG, HEIC suportado pelo browser…) para WebP ≤ 1080p. */
export const optimizeImageFile = async (file: Blob): Promise<Blob> => {
  // imageOrientation: respeita a rotação EXIF das fotos tiradas com o telemóvel.
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const { width, height } = fitWithin1080p(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D indisponível.');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, width, height);
    return await canvasToWebp(canvas);
  } finally {
    bitmap.close();
  }
};
