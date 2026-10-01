import 'server-only';
import type { RichDoc } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { cmsQuery } from './payload';

export type LegalDoc = { title: string; body: RichDoc; updatedAt?: string; approved: boolean };

type Stored = {
  kind?: string;
  title?: Partial<Record<Locale, string | null>>;
  body?: Partial<Record<Locale, RichDoc | null>>;
  lastUpdated?: Partial<Record<Locale, string | null>>;
  approved?: Partial<Record<Locale, boolean | null>>;
};

const hasText = (d: RichDoc | null | undefined) => !!d?.root?.children?.length;

/** Both legal pages in every language, as stored in the admin. */
export const readLegalPages = () =>
  cmsQuery(
    'legal-pages',
    async (p) =>
      (
        await p.find({
          collection: 'legal-pages',
          locale: 'all',
          depth: 1,
          limit: 10,
          pagination: false,
        })
      ).docs as Stored[],
  );

/**
 * Privacy Policy / Legal Notice text in the page language, written by BCC's legal adviser in the
 * admin. A language without its own text shows the placeholder (legal text never falls back to
 * another language). Unapproved text is shown on staging for review; the live site does not
 * start until both pages are approved in all four languages (src/instrumentation.ts).
 */
export async function getLegalPage(
  kind: 'privacy' | 'legal-notice',
  locale: Locale,
): Promise<LegalDoc | undefined> {
  try {
    const doc = (await readLegalPages())?.find((d) => d.kind === kind);
    const title = doc?.title?.[locale];
    const body = doc?.body?.[locale];
    if (!title || !body || !hasText(body)) return undefined;
    return {
      title,
      body,
      updatedAt: doc?.lastUpdated?.[locale]?.slice(0, 10) ?? undefined,
      approved: !!doc?.approved?.[locale],
    };
  } catch (error) {
    console.error('[cms] legal page query failed', error);
    return undefined;
  }
}

export { missingApprovals } from './legal-check';
