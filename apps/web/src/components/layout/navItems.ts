/** Main navigation. Labels come from messages "Nav.*"; routes are shared by all languages. */
const items = [
  { key: 'about', href: '/about' },
  { key: 'services', href: '/services' },
  { key: 'news', href: '/news' },
  { key: 'contact', href: '/contact' },
] as const;

export type NavItem = (typeof items)[number];

/** News is listed only once at least one article is published. */
export function navItems(showNews: boolean): readonly NavItem[] {
  return showNews ? items : items.filter((i) => i.key !== 'news');
}
