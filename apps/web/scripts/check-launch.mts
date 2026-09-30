/**
 * Launch gate. A production build (SITE_ENV=production) stops unless the Privacy Policy
 * and Legal Notice exist in the CMS in every language and are marked approved by BCC's
 * legal adviser. Staging and development builds are not affected.
 */
import { createClient } from '@sanity/client';

const LOCALES = ['en', 'fr', 'de', 'lu'];
const KINDS = ['privacy', 'legal-notice'];

type LegalDoc = { kind?: string; language?: string; approved?: boolean };

export function missingApprovals(docs: LegalDoc[]): string[] {
  const missing: string[] = [];
  for (const kind of KINDS) {
    for (const lang of LOCALES) {
      const doc = docs.find((d) => d.kind === kind && d.language === lang);
      if (!doc) missing.push(`${kind} (${lang}): not written`);
      else if (!doc.approved) missing.push(`${kind} (${lang}): not approved`);
    }
  }
  return missing;
}

async function main() {
  if (process.env.SITE_ENV !== 'production') return;
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  let problems: string[];
  if (!projectId) {
    problems = ['No CMS configured: the legal pages are still placeholders.'];
  } else {
    const client = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
      apiVersion: '2026-09-01',
      useCdn: false,
      perspective: 'published',
    });
    const docs = await client.fetch<LegalDoc[]>(
      '*[_type == "legalPage"]{ kind, language, approved }',
    );
    problems = missingApprovals(docs);
  }
  if (problems.length) {
    console.error(
      [
        'Production build stopped: legal pages are not ready.',
        ...problems.map((p) => `  - ${p}`),
      ].join('\n'),
    );
    process.exit(1);
  }
  console.log('Launch gate: legal pages approved in all languages.');
}

if (process.argv[1]?.endsWith('check-launch.mts')) await main();
