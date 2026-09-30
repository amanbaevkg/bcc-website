import { describe, expect, it } from 'vitest';
import { missingApprovals } from './check-launch.mjs';

describe('launch gate', () => {
  it('lists every page that is missing or not approved', () => {
    const docs = [
      { kind: 'privacy', language: 'en', approved: true },
      { kind: 'privacy', language: 'fr', approved: false },
    ];
    const missing = missingApprovals(docs);
    expect(missing).toContain('privacy (fr): not approved');
    expect(missing).toContain('legal-notice (en): not written');
    expect(missing).not.toContain('privacy (en): not approved');
    expect(missing).toHaveLength(7);
  });

  it('passes when all eight pages are approved', () => {
    const docs = ['privacy', 'legal-notice'].flatMap((kind) =>
      ['en', 'fr', 'de', 'lu'].map((language) => ({ kind, language, approved: true })),
    );
    expect(missingApprovals(docs)).toEqual([]);
  });
});
