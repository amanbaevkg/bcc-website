import 'server-only';
import { newsFixtures } from '@/content/fixtures/news';
import type { NewsPost, NewsSummary, RichBlock } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { image, type SanityImage } from './map';
import { sanityFetch } from './sanity';

/**
 * News comes only from the CMS: one document per language. When a post has no version in the
 * page's language yet, the English version is listed instead (marked with its language).
 * Nothing is invented: without a CMS the list is empty, unless test fixtures are switched on
 * outside production (the switch is read on the server only and ignored when SITE_ENV=production).
 */
function fixturesOn() {
  return process.env.NEWS_FIXTURES === '1' && process.env.SITE_ENV !== 'production';
}

const SUMMARY = `{
  "slug": slug.current, title, date, excerpt, language,
  "group": coalesce(*[_type == "translation.metadata" && references(^._id)][0]._id, _id),
  cover { alt, hotspot, asset->{ url, metadata { dimensions } } }
}`;

type SummaryDoc = {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  language?: string;
  group?: string;
  cover?: SanityImage;
};

const published = `_type == "newsPost" && defined(slug.current) && date <= now()`;

function toSummary(d: SummaryDoc): NewsSummary | undefined {
  if (!d.slug || !d.title || !d.date || !d.excerpt) return undefined;
  const lang = (['en', 'fr', 'de', 'lu'] as const).find((l) => l === d.language) ?? 'en';
  return {
    slug: d.slug,
    title: d.title,
    date: d.date,
    excerpt: d.excerpt,
    cover: image(d.cover),
    lang,
  };
}

/** Posts in the page language, plus English versions of posts not yet translated. */
export function pickForLocale(docs: SummaryDoc[], locale: Locale): NewsSummary[] {
  const byGroup = new Map<string, SummaryDoc>();
  for (const d of docs) {
    const key = d.group ?? d.slug ?? '';
    const current = byGroup.get(key);
    if (d.language === locale || (!current && d.language === 'en')) byGroup.set(key, d);
  }
  return [...byGroup.values()]
    .map(toSummary)
    .filter((s): s is NewsSummary => !!s)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNewsList(locale: Locale): Promise<NewsSummary[]> {
  if (fixturesOn()) return newsFixtures;
  try {
    const docs = await sanityFetch<SummaryDoc[]>(
      `*[${published} && language in [$locale, "en"]] | order(date desc) ${SUMMARY}`,
      { locale },
    );
    return pickForLocale(docs ?? [], locale);
  } catch (error) {
    console.error('[cms] news list query failed', error);
    return [];
  }
}

export async function getNewsPost(locale: Locale, slug: string): Promise<NewsPost | undefined> {
  if (fixturesOn()) return newsFixtures.find((p) => p.slug === slug);
  try {
    const doc = await sanityFetch<SummaryDoc & { body?: RichBlock[]; author?: string }>(
      `*[${published} && slug.current == $slug && language in [$locale, "en"]]
        | order(select(language == $locale => 0, 1))[0]{
          ...${SUMMARY},
          author,
          body[]{ ..., _type == "imageWithAlt" => { alt, hotspot, asset->{ url, metadata { dimensions } } } }
        }`,
      { locale, slug },
    );
    const summary = doc && toSummary(doc);
    return summary ? { ...summary, body: doc.body ?? [], author: doc.author } : undefined;
  } catch (error) {
    console.error('[cms] news post query failed', error);
    return undefined;
  }
}

/** Every language × slug pair to pre-render. */
export async function getNewsParams(locales: readonly Locale[]) {
  const lists = await Promise.all(
    locales.map(async (locale) => ({ locale, posts: await getNewsList(locale) })),
  );
  return lists.flatMap(({ locale, posts }) => posts.map((p) => ({ locale, slug: p.slug })));
}
