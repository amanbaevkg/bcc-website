import { describe, expect, it } from 'vitest';
import { safeHref } from './safeHref';

describe('article links', () => {
  it('keeps web, e-mail, phone links and paths on this site', () => {
    for (const url of ['https://bcc.lu', 'HTTP://x.lu', 'mailto:a@b.lu', 'tel:+352', '/en/contact'])
      expect(safeHref(url)).toBe(url);
  });

  it('drops scripts and addresses that lead to another site', () => {
    for (const url of [
      'javascript:alert(1)',
      '//evil.test',
      '/\\evil.test',
      '/\t/evil.test',
      ' /x',
      'data:text/html,x',
    ])
      expect(safeHref(url)).toBeUndefined();
  });
});
