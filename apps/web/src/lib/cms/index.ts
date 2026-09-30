import 'server-only';
import { homeFallback } from '@/content/fallback/home';
import type { HomePage } from '@/content/types';

/**
 * Content access for pages. Until a Sanity project is configured
 * (NEXT_PUBLIC_SANITY_PROJECT_ID), everything comes from src/content/fallback.
 * Pages call these functions only, so switching to the CMS changes nothing in the sections.
 */
export async function getHomePage(): Promise<HomePage> {
  return homeFallback;
}
