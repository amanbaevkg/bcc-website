import { describe, expect, it } from 'vitest';
import { homeFallback } from '@/content/fallback/home';
import { mapHome } from './index';
import { lines, localized, richLine } from './map';

const loc = (en: string, fr?: string) => [
  { _key: 'en', value: en },
  ...(fr ? [{ _key: 'fr', value: fr }] : []),
];

describe('CMS mapping', () => {
  it('uses the built-in content when there is no document', () => {
    expect(mapHome(null)).toBe(homeFallback);
  });

  it('keeps the built-in content for sections the editor has not filled', () => {
    const home = mapHome({ hero: { title: loc('New title') } });
    expect(home.hero.title).toEqual({ en: 'New title' });
    expect(home.hero.titleAccent).toBeUndefined();
    expect(home.hero.subtitle).toBe(homeFallback.hero.subtitle);
    expect(home.tomorrow).toBe(homeFallback.tomorrow);
    expect(home.spaces.items).toBe(homeFallback.spaces.items);
  });

  it('converts per-language values and ignores empty translations', () => {
    expect(localized([...loc('Hello', 'Bonjour'), { _key: 'de', value: ' ' }])).toEqual({
      en: 'Hello',
      fr: 'Bonjour',
    });
    expect(localized(loc(''))).toBeUndefined();
  });

  it('only offers a language for headline lines when every line is translated', () => {
    expect(lines([loc('A', 'Á'), loc('B')])).toEqual({ en: ['A', 'B'] });
  });

  it('keeps bold runs from block text', () => {
    const body = {
      en: [{ children: [{ text: 'Grow', marks: ['strong'] }, { text: ' fast' }] }],
    };
    expect(richLine(body)).toEqual({ en: [{ strong: 'Grow' }, ' fast'] });
  });

  it('skips incomplete gallery items and clamps ratings', () => {
    const home = mapHome({
      spaces: {
        items: [
          { caption: loc('Kitchen') },
          {
            caption: loc('Lounge'),
            image: {
              asset: {
                url: 'https://cdn.sanity.io/x.jpg',
                metadata: { dimensions: { width: 2000, height: 1500 } },
              },
            },
          },
        ],
      },
      testimonials: {
        items: [{ quote: 'Great', name: 'A', company: 'B', rating: 9, quoteLanguage: 'fr' }],
      },
    });
    expect(home.spaces.items.map((s) => s.caption.en)).toEqual(['Lounge']);
    expect(home.testimonials.items[0]).toMatchObject({ rating: 5, lang: 'fr' });
  });
});
