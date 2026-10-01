import { describe, expect, it } from 'vitest';
import { missingApprovals } from '@/lib/cms/legal-check';

const text = { root: { children: [{ type: 'paragraph' }] } };
const page = (kind: string, approved: Record<string, boolean>) => ({
  kind,
  title: { en: 'T', fr: 'T', de: 'T', lu: 'T' },
  body: { en: text, fr: text, de: text, lu: text },
  approved,
});
const all = { en: true, fr: true, de: true, lu: true };
const LOCALES = ['en', 'fr', 'de', 'lu'] as const;

describe('launch gate', () => {
  it('passes when both legal pages are approved in every language', () => {
    expect(missingApprovals([page('privacy', all), page('legal-notice', all)], LOCALES)).toEqual(
      [],
    );
  });

  it('lists every missing or unapproved page and language', () => {
    const missing = missingApprovals([page('privacy', { ...all, lu: false })], LOCALES);
    expect(missing).toContain('privacy/lu');
    expect(missing).toEqual(expect.arrayContaining(LOCALES.map((l) => `legal-notice/${l}`)));
    expect(missing).toHaveLength(5);
  });

  it('treats an empty database as not ready', () => {
    expect(missingApprovals(null, LOCALES)).toHaveLength(8);
  });
});
