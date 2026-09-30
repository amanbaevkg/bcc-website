import { afterEach, describe, expect, it, vi } from 'vitest';
import robots from './robots';

afterEach(() => vi.unstubAllEnvs());

describe('robots.txt', () => {
  it('opens production to search engines and points to the sitemap', () => {
    vi.stubEnv('SITE_ENV', 'production');
    vi.stubEnv('SITE_URL', 'https://www.businesscentercapellen.lu');
    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: ['/api/'] },
      sitemap: 'https://www.businesscentercapellen.lu/sitemap.xml',
      host: 'https://www.businesscentercapellen.lu',
    });
  });

  it('closes every other environment', () => {
    vi.stubEnv('SITE_ENV', 'staging');
    expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } });
  });
});
