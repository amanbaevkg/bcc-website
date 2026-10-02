import en from '../../../messages/en.json';
import fr from '../../../messages/fr.json';
import de from '../../../messages/de.json';
import lu from '../../../messages/lu.json';
import type { Localized } from '../types';

const all = { en, fr, de, lu } as const;
const msg = (pick: (m: typeof en) => string): Localized =>
  Object.fromEntries(Object.entries(all).map(([l, m]) => [l, pick(m as typeof en)])) as Localized;

/** Footer texts used until "Footer & contact details" in the admin are filled in. */
export const footerFallback = {
  tagline: msg((m) => m.Meta.tagline),
  getInTouch: msg((m) => m.Footer.getInTouch),
  quickLinks: msg((m) => m.Footer.quickLinks),
  follow: msg((m) => m.Footer.follow),
  address: msg((m) => m.Footer.address),
  language: msg((m) => m.Footer.language),
  openMap: msg((m) => m.Footer.openMap),
  // The year is added in front on the site: "©2026. " + this line.
  rights: msg((m) => m.Footer.rights.replace(/^©\{year\}\.\s*/, '')),
};

export type FooterTexts = typeof footerFallback;
