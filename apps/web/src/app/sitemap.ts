import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getNewsList } from '@/lib/cms/news';
import { languageAlternates } from '@/lib/seo';

/**
 * Every indexable page in every language, each linked to its translations (hreflang).
 * Legal pages join once they are approved (they are noindex placeholders until then);
 * News joins once an article is published.
 */
// Built on request: it lists news articles from the admin's database.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? 'http://localhost:3000';
  const abs = (langs: Record<string, string>) =>
    Object.fromEntries(Object.entries(langs).map(([k, v]) => [k, `${base}${v}`]));

  const pages = ['', '/about', '/services', '/contact'];
  const entries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    pages.map((path) => ({
      url: `${base}/${locale}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.8,
      alternates: { languages: abs(languageAlternates(path)) },
    })),
  );

  for (const locale of routing.locales) {
    const posts = (await getNewsList(locale)).filter((p) => p.lang === locale && !p.fixture);
    if (!posts.length) continue;
    entries.push({ url: `${base}/${locale}/news`, changeFrequency: 'weekly', priority: 0.6 });
    for (const p of posts) {
      entries.push({
        url: `${base}/${locale}/news/${p.slug}`,
        lastModified: p.date,
        priority: 0.5,
      });
    }
  }
  return entries;
}
