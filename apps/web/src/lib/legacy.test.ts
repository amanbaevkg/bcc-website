import { describe, expect, it } from 'vitest';
import { legacyRedirect } from './legacy';

describe('old site addresses', () => {
  it('sends the old pages to their new ones, with or without a trailing slash', () => {
    expect(legacyRedirect('/about-us/')).toBe('/about');
    expect(legacyRedirect('/about-us')).toBe('/about');
    expect(legacyRedirect('/projects/')).toBe('/contact');
    expect(legacyRedirect('/About-Us/')).toBe('/about');
  });

  it('sends empty posts, archives and feeds to the home page', () => {
    expect(legacyRedirect('/2020/01/01/x-3/')).toBe('/');
    expect(legacyRedirect('/2025/10/06/hello-world/')).toBe('/');
    expect(legacyRedirect('/category/uncategorized/')).toBe('/');
    expect(legacyRedirect('/author/cp/')).toBe('/');
    expect(legacyRedirect('/feed/')).toBe('/');
  });

  it('leaves the new site’s own addresses alone', () => {
    for (const p of ['/', '/en', '/en/about', '/fr/contact', '/contact', '/services', '/de/news/x'])
      expect(legacyRedirect(p)).toBeNull();
  });
});
