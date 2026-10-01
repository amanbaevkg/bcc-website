import 'server-only';
import { unstable_cache } from 'next/cache';
import type { Payload } from 'payload';

/**
 * Reads the admin's content on the server through Payload's local API (no network).
 * Results are cached and tagged "cms"; every save in the admin clears the tag
 * (src/payload/revalidate.ts), and the cache also expires after 5 minutes.
 * During `next build` there is no database, so callers get null and use the built-in content.
 */
export async function cmsQuery<T>(
  key: string,
  fn: (payload: Payload) => Promise<T>,
): Promise<T | null> {
  if (process.env.NEXT_PHASE === 'phase-production-build' || process.env.CMS_DISABLED === '1') {
    return null;
  }
  return unstable_cache(
    async () => {
      const [{ getPayload }, { default: config }] = await Promise.all([
        import('payload'),
        import('@payload-config'),
      ]);
      return fn(await getPayload({ config }));
    },
    ['cms', key],
    { tags: ['cms'], revalidate: 300 },
  )();
}

/** A page's content in every language at once ({ en, fr, de, lu } per text). */
export const readGlobal = <T>(slug: string, depth = 2) =>
  cmsQuery(
    `global:${slug}`,
    async (p) =>
      (await p.findGlobal({ slug: slug as never, locale: 'all', depth, draft: false })) as T,
  );
