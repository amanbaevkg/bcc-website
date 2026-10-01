import { describe, expect, it } from 'vitest';
import { homeFallback } from '@/content/fallback/home';
import { paragraphs } from '@/payload/lexical';
import { mapHome } from './index';
import { image, lines, localized, richLine } from './map';

/* The admin (Payload) returns texts with locale "all" as { en, fr, de, lu }. */
const loc = (en: string, fr?: string) => ({ en, ...(fr ? { fr } : {}) });
const photo = (url: string) => ({
  url,
  width: 2000,
  height: 1500,
  alt: loc('A room'),
  focalX: 30,
  focalY: 70,
});

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
    expect(localized({ en: 'Hello', fr: 'Bonjour', de: ' ', lu: null })).toEqual({
      en: 'Hello',
      fr: 'Bonjour',
    });
    expect(localized({ en: '', fr: 'Bonjour' })).toBeUndefined();
  });

  it('splits headline text into lines per language', () => {
    expect(lines(loc('BUILDING\nTOMORROW’S\n NOW ', 'BÂTIR\nDEMAIN'))).toEqual({
      en: ['BUILDING', 'TOMORROW’S', 'NOW'],
      fr: ['BÂTIR', 'DEMAIN'],
    });
  });

  it('keeps bold runs from the rich-text editor', () => {
    const body = { en: paragraphs([{ strong: 'Grow' }, ' fast']) };
    expect(richLine(body)).toEqual({ en: [{ strong: 'Grow' }, ' fast'] });
  });

  it('turns an uploaded photo into an image with its focal point', () => {
    expect(image(photo('/api/media/file/a.jpg'))).toEqual({
      src: '/api/media/file/a.jpg',
      width: 2000,
      height: 1500,
      alt: { en: 'A room' },
      hotspot: { x: 0.3, y: 0.7 },
    });
    expect(image(12)).toBeUndefined();
  });

  it('skips incomplete gallery items and clamps ratings', () => {
    const home = mapHome({
      spaces: {
        items: [
          { caption: loc('Kitchen') },
          { caption: loc('Lounge'), image: photo('/api/media/file/l.jpg') },
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
