import { describe, expect, it } from 'vitest';
import { jsonLd, languageAlternates, pageMetadata } from './seo';

describe('SEO helpers', () => {
  it('links every language, with /lu/ declared as Luxembourgish (lb) and English as default', () => {
    expect(languageAlternates('/about')).toEqual({
      en: '/en/about',
      fr: '/fr/about',
      de: '/de/about',
      lb: '/lu/about',
      'x-default': '/en/about',
    });
  });

  it('never erases the site title or description with empty values', () => {
    const m = pageMetadata({ locale: 'fr', path: '' });
    expect('title' in m).toBe(false);
    expect('description' in m).toBe(false);
    expect(m.alternates?.canonical).toBe('/fr');
  });

  it('limits alternates to the languages a page exists in', () => {
    const m = pageMetadata({ locale: 'de', locales: ['de'], path: '/news/x', title: 'X' });
    expect(Object.keys(m.alternates?.languages ?? {})).toEqual(['de']);
  });

  it('escapes "<" so structured data cannot close its script tag', () => {
    expect(jsonLd({ name: '</script><b>' })).not.toContain('<');
  });
});
