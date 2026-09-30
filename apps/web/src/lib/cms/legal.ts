import 'server-only';
import type { RichBlock } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { sanityFetch } from './sanity';

export type LegalDoc = { title: string; body: RichBlock[]; updatedAt?: string; approved: boolean };

/**
 * Privacy Policy / Legal Notice text in the page language, written by BCC's legal adviser in the
 * CMS. Without it the page shows the placeholder. Unapproved text is shown on staging for review
 * and blocks production builds (see scripts/check-launch.mts).
 */
export async function getLegalPage(
  kind: 'privacy' | 'legal-notice',
  locale: Locale,
): Promise<LegalDoc | undefined> {
  try {
    const doc = await sanityFetch<{
      title?: string;
      body?: RichBlock[];
      updatedAt?: string;
      approved?: boolean;
    }>(
      `*[_type == "legalPage" && kind == $kind && language == $locale][0]{ title, body, updatedAt, approved }`,
      { kind, locale },
    );
    if (!doc?.title || !doc.body?.length) return undefined;
    return { title: doc.title, body: doc.body, updatedAt: doc.updatedAt, approved: !!doc.approved };
  } catch (error) {
    console.error('[cms] legal page query failed', error);
    return undefined;
  }
}
