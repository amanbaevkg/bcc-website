import type { RichDoc } from '@/content/types';
import type { Locale } from '@/i18n/routing';

/* Shared by the legal pages and the launch gate (src/instrumentation.ts). No server-only import:
 * the gate loads it while the server starts. */

type Stored = {
  kind?: string;
  title?: Partial<Record<Locale, string | null>>;
  body?: Partial<Record<Locale, RichDoc | null>>;
  approved?: Partial<Record<Locale, boolean | null>>;
};

const hasText = (d: RichDoc | null | undefined) => !!d?.root?.children?.length;

/** Kinds × languages still missing an approved text (empty = ready for launch). */
export function missingApprovals(docs: Stored[] | null, locales: readonly Locale[]): string[] {
  const missing: string[] = [];
  for (const kind of ['privacy', 'legal-notice'] as const) {
    const doc = docs?.find((d) => d.kind === kind);
    for (const l of locales) {
      if (!doc?.title?.[l] || !hasText(doc?.body?.[l]) || !doc?.approved?.[l])
        missing.push(`${kind}/${l}`);
    }
  }
  return missing;
}
