import { describe, expect, it } from 'vitest';
import { htmlLang, localeNames, ogLocale, routing } from './routing';

describe('routing', () => {
  it('uses English as default with a prefix on every language', () => {
    expect(routing.defaultLocale).toBe('en');
    expect(routing.localePrefix).toBe('always');
    expect([...routing.locales]).toEqual(['en', 'fr', 'de', 'lu']);
  });

  it('maps the /lu/ prefix to the ISO code lb', () => {
    expect(htmlLang.lu).toBe('lb');
    expect(ogLocale.lu).toBe('lb_LU');
  });

  it('has a name for every language', () => {
    for (const l of routing.locales) expect(localeNames[l]).toBeTruthy();
  });
});
