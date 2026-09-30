import 'server-only';
import { createClient, type QueryParams } from '@sanity/client';

/** Public identifiers. When the project ID is empty, the site uses its built-in content. */
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
};

export const cmsEnabled = /^[a-z0-9]+$/.test(sanityConfig.projectId);

const client = cmsEnabled
  ? createClient({
      ...sanityConfig,
      apiVersion: '2026-09-01',
      useCdn: true,
      perspective: 'published',
    })
  : null;

/**
 * Cached for 5 minutes, and tagged so a Sanity webhook can refresh pages at once
 * after an editor publishes.
 */
export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(query, params, { next: { revalidate: 300, tags: ['sanity'] } });
}
