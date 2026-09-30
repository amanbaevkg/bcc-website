import type { Metadata } from 'next';
import { siteFallback } from '@/content/site';
import { htmlLang, ogLocale, routing, type Locale } from '@/i18n/routing';
import type { SiteInfo } from '@/lib/cms/site';

/**
 * Search and sharing metadata shared by every page: canonical URL, the same page in the other
 * languages (hreflang), Open Graph / social preview, and robots. Paths are given without the
 * language prefix ("/about"); the home page is "".
 */
export function languageAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[htmlLang[l]] = `/${l}${path}`;
  // Visitors whose language is not offered land on the English version.
  languages['x-default'] = `/en${path}`;
  return languages;
}

export const defaultOgImage = {
  url: '/og/default.jpg',
  width: 1200,
  height: 630,
  alt: 'Business Center Capellen',
};

export function pageMetadata(opts: {
  locale: Locale;
  path: string;
  title?: string;
  description?: string;
  image?: { url: string; width: number; height: number; alt?: string };
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  /** Pages that exist in only some languages (e.g. a news article) list those here. */
  locales?: readonly Locale[];
}): Metadata {
  const { locale, path } = opts;
  const available = opts.locales ?? routing.locales;
  const languages = Object.fromEntries(
    Object.entries(languageAlternates(path)).filter(([lang]) =>
      lang === 'x-default' ? available.includes('en') : available.some((l) => htmlLang[l] === lang),
    ),
  );
  // Keys left undefined would erase the layout's defaults (e.g. the site title), so omit them.
  return {
    ...(opts.title && { title: opts.title }),
    ...(opts.description && { description: opts.description }),
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: {
      type: opts.type ?? 'website',
      siteName: siteFallback.name,
      locale: ogLocale[locale],
      alternateLocale: available.filter((l) => l !== locale).map((l) => ogLocale[l]),
      url: `/${locale}${path}`,
      title: opts.title ?? siteFallback.name,
      ...(opts.description && { description: opts.description }),
      images: [opts.image ?? defaultOgImage],
      ...(opts.publishedTime && { publishedTime: opts.publishedTime }),
    },
    twitter: { card: 'summary_large_image' },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  };
}

/** schema.org data describing BCC, from the site's own contact details (nothing added). */
export function organizationJsonLd(siteUrl: string, s: SiteInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteUrl}/#business`,
    name: s.name,
    alternateName: s.shortName,
    url: siteUrl,
    logo: `${siteUrl}/images/bcc-logo.png`,
    image: `${siteUrl}${defaultOgImage.url}`,
    email: s.email,
    telephone: s.phone.href.replace('tel:', ''),
    address: {
      '@type': 'PostalAddress',
      streetAddress: s.address.street,
      postalCode: s.address.postalCode,
      addressLocality: s.address.city,
      addressCountry: s.address.countryCode,
    },
    sameAs: s.social.map((x) => x.url),
  };
}

/** Serialises JSON-LD for a <script> tag; "<" is escaped so the data can never close the tag. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
