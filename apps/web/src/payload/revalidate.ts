import { revalidateTag } from 'next/cache';

/** After any save in the admin, the very next page view reads the new content. */
export function refreshSite() {
  try {
    revalidateTag('cms', { expire: 0 });
  } catch {
    // Outside a Next.js request (seed script, migrations) there is no cache to refresh.
  }
}

export const refreshAfterChange = [() => refreshSite()];
