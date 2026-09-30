import { describe, expect, it } from 'vitest';
import { formatDate } from '@/components/news/date';
import { pickForLocale } from './news';

const doc = (slug: string, language: string, group: string, date = '2026-09-01') => ({
  slug,
  language,
  group,
  date,
  title: `${slug} title`,
  excerpt: `${slug} teaser`,
});

describe('news per language', () => {
  it('prefers the page language and falls back to English, newest first', () => {
    const list = pickForLocale(
      [
        doc('opening', 'en', 'g1', '2026-09-10'),
        doc('ouverture', 'fr', 'g1', '2026-09-10'),
        doc('parking', 'en', 'g2', '2026-09-20'),
        doc('only-german', 'de', 'g3'),
      ],
      'fr',
    );
    expect(list.map((p) => [p.slug, p.lang])).toEqual([
      ['parking', 'en'],
      ['ouverture', 'fr'],
    ]);
  });

  it('skips posts missing required fields', () => {
    expect(pickForLocale([{ slug: 'x', language: 'en', group: 'g' }], 'en')).toEqual([]);
  });
});

describe('dates', () => {
  it('formats in the page language without time-zone drift', () => {
    expect(formatDate('2026-09-15', 'en')).toBe('15 September 2026');
    expect(formatDate('2026-09-15', 'fr')).toBe('15 septembre 2026');
    expect(formatDate('2026-09-15', 'de')).toBe('15. September 2026');
  });
});
