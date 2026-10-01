import { describe, expect, it } from 'vitest';
import { formatDate } from '@/components/news/date';
import { inLocale } from './news';

const body = { root: { children: [] } };
const post = (slug: string, titles: Record<string, string>, date = '2026-09-01') => ({
  slug,
  date: `${date}T00:00:00.000Z`,
  title: titles,
  excerpt: Object.fromEntries(Object.keys(titles).map((l) => [l, `${slug} teaser ${l}`])),
  body: { en: body },
});

describe('news per language', () => {
  it('shows the page language and falls back to English', () => {
    expect(inLocale(post('opening', { en: 'Opening', fr: 'Ouverture' }), 'fr')).toMatchObject({
      title: 'Ouverture',
      lang: 'fr',
      date: '2026-09-01',
    });
    expect(inLocale(post('parking', { en: 'Parking' }), 'de')).toMatchObject({
      title: 'Parking',
      lang: 'en',
    });
  });

  it('skips posts missing required fields', () => {
    expect(inLocale({ slug: 'x', title: { en: 'X' } }, 'en')).toBeUndefined();
  });
});

describe('dates', () => {
  it('formats in the page language without time-zone drift', () => {
    expect(formatDate('2026-09-15', 'en')).toBe('15 September 2026');
    expect(formatDate('2026-09-15', 'fr')).toBe('15 septembre 2026');
    expect(formatDate('2026-09-15', 'de')).toBe('15. September 2026');
  });
});
