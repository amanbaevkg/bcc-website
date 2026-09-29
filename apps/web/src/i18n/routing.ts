import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'fr', 'de', 'lu'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
  localePrefix: 'always',
  // The first visit is redirected to the browser's language; after that the
  // NEXT_LOCALE cookie remembers the visitor's own choice from the selector.
  localeDetection: true,
});

/**
 * The URL prefix is /lu/ (the business requirement), but the ISO 639-1 code
 * for Luxembourgish is "lb". Use this for <html lang>, hreflang and og:locale.
 */
export const htmlLang: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  de: 'de',
  lu: 'lb',
};

export const ogLocale: Record<Locale, string> = {
  en: 'en_GB',
  fr: 'fr_LU',
  de: 'de_LU',
  lu: 'lb_LU',
};

/** Language names are always written in their own language. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  lu: 'Lëtzebuergesch',
};
