import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl } from './siteConfig';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product';
  jsonLd?: object | object[];
}

export function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  type = 'website',
  jsonLd,
}: SeoProps) {
  const canonical = absoluteUrl(path);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="pt-PT" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large" />
      )}

      <meta property="og:site_name" content="JA Automóveis" />
      <meta property="og:locale" content="pt_PT" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta name="geo.region" content="PT-05" />
      <meta name="geo.placename" content="Covilhã" />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}

export { SITE_URL };
