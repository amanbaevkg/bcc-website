import 'server-only';
import { newsFixtures } from '@/content/fixtures/news';
import type { NewsPost, NewsSummary, RichDoc } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { image, type CmsMedia } from './map';
import { cmsQuery } from './payload';

/**
 * News comes only from the admin. Each article holds all four languages; when the page's
 * language has no title yet, the English version is shown instead (marked with its language).
 * Nothing is invented: without articles the list is empty, unless test fixtures are switched on
 * outside production (read on the server only and ignored when SITE_ENV=production).
 */
function fixturesOn() {
  return process.env.NEWS_FIXTURES === '1' && process.env.SITE_ENV !== 'production';
}

type PerLocale<T> = Partial<Record<Locale, T | null>>;
export type StoredPost = {
  slug?: string | null;
  title?: PerLocale<string>;
  date?: string | null;
  excerpt?: PerLocale<string>;
  body?: PerLocale<RichDoc>;
  cover?: CmsMedia;
  author?: string | null;
};

/** The article in the page language, or in English when it is not translated yet. */
export function inLocale(d: StoredPost, locale: Locale): NewsPost | undefined {
  const lang: Locale = d.title?.[locale] && d.excerpt?.[locale] ? locale : 'en';
  const title = d.title?.[lang];
  const excerpt = d.excerpt?.[lang];
  if (!d.slug || !title || !excerpt || !d.date) return undefined;
  return {
    slug: d.slug,
    title,
    date: d.date.slice(0, 10),
    excerpt,
    cover: image(d.cover),
    lang,
    body: d.body?.[lang] ?? d.body?.en ?? { root: { children: [] } },
    author: d.author ?? undefined,
  };
}

function endOfToday() {
  const d = new Date();
  d.setUTCHours(23, 59, 59, 999);
  return d.toISOString();
}

const readPosts = () =>
  cmsQuery(
    'news',
    async (p) =>
      (
        await p.find({
          collection: 'news',
          locale: 'all',
          depth: 2,
          draft: false,
          where: {
            and: [
              { _status: { equals: 'published' } },
              // Dated today or earlier: the date picker stores a day as its midday, so compare
              // with the end of today, not with this very moment.
              { date: { less_than_equal: endOfToday() } },
            ],
          },
          sort: '-date',
          limit: 200,
          pagination: false,
        })
      ).docs as StoredPost[],
  );

const summary = (p: NewsPost): NewsSummary => ({
  slug: p.slug,
  title: p.title,
  date: p.date,
  excerpt: p.excerpt,
  cover: p.cover,
  lang: p.lang,
});

export async function getNewsList(locale: Locale): Promise<NewsSummary[]> {
  if (fixturesOn()) return newsFixtures;
  try {
    return ((await readPosts()) ?? [])
      .map((d) => inLocale(d, locale))
      .filter((p): p is NewsPost => !!p)
      .map(summary);
  } catch (error) {
    console.error('[cms] news list query failed', error);
    return [];
  }
}

export async function getNewsPost(locale: Locale, slug: string): Promise<NewsPost | undefined> {
  if (fixturesOn()) return newsFixtures.find((p) => p.slug === slug);
  try {
    const doc = ((await readPosts()) ?? []).find((d) => d.slug === slug);
    return doc ? inLocale(doc, locale) : undefined;
  } catch (error) {
    console.error('[cms] news post query failed', error);
    return undefined;
  }
}

/** Every language × slug pair. */
export async function getNewsParams(locales: readonly Locale[]) {
  const lists = await Promise.all(
    locales.map(async (locale) => ({ locale, posts: await getNewsList(locale) })),
  );
  return lists.flatMap(({ locale, posts }) => posts.map((p) => ({ locale, slug: p.slug })));
}
