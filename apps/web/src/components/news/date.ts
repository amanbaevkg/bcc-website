import { htmlLang, type Locale } from '@/i18n/routing';

/** "15 September 2026" in the page language. Dates are stored as YYYY-MM-DD (no time zone). */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  // British date order for English, matching the site's British spelling.
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : htmlLang[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}
