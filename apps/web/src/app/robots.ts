import type { MetadataRoute } from 'next';

/** Production is open to search engines; staging and previews are closed. */
export default function robots(): MetadataRoute.Robots {
  const url = process.env.SITE_URL ?? 'http://localhost:3000';
  if (process.env.SITE_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
    sitemap: `${url}/sitemap.xml`,
    host: url,
  };
}
