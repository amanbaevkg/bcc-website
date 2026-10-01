/**
 * Addresses of the previous WordPress site (businesscentercapellen.lu), sent permanently
 * to their new pages so bookmarks, links from other sites and search results keep working.
 * Targets have no language prefix: the language middleware then picks the visitor's language.
 * List taken from the old site's sitemap (wp-sitemap.xml) and menu, October 2026.
 */
const pages: Record<string, string> = {
  '/about-us': '/about',
  '/projects': '/contact', // titled "Contact Us" on the old site
  '/contact-us': '/contact',
  '/our-services': '/services',
  // WordPress placeholders and feeds with no counterpart: the home page.
  '/sample-page': '/',
  '/feed': '/',
  '/comments/feed': '/',
};

/** Old blog posts (/2020/01/01/x/), category and author archives: none had real content. */
const archives = [/^\/\d{4}\/\d{2}\/\d{2}\/[^/]+$/, /^\/category\/.+$/, /^\/author\/.+$/];

/** The new path for an old address, or null when the path is not one of them. */
export function legacyRedirect(pathname: string): string | null {
  const path = pathname.toLowerCase().replace(/\/+$/, '') || '/';
  if (path in pages) return pages[path]!;
  return archives.some((re) => re.test(path)) ? '/' : null;
}
