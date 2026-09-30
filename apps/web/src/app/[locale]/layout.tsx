import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { htmlLang, routing, type Locale } from '@/i18n/routing';
import { getNewsList } from '@/lib/cms/news';
import { env } from '@/lib/env';
import '@/styles/globals.css';

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

// Only the four languages exist; any other first segment falls through to global-not-found.
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return {
    metadataBase: new URL(env().SITE_URL),
    title: { default: t('siteName'), template: `%s | ${t('siteName')}` },
    description: t('tagline'),
    robots: env().SITE_ENV === 'production' ? undefined : { index: false, follow: false },
  };
}

export const viewport: Viewport = {
  themeColor: '#efebe5',
  colorScheme: 'light',
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const showNews = (await getNewsList(locale as Locale)).length > 0;

  return (
    <html lang={htmlLang[locale as Locale]}>
      <head>
        <link
          rel="preload"
          href="/fonts/Archivo-normal-100-900-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <SkipLink />
          <Header showNews={showNews} />
          <main id="main" tabIndex={-1}>
            {children}
          </main>
          <Footer showNews={showNews} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
