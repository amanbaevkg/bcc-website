import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { LegalPlaceholder } from '@/components/layout/LegalPlaceholder';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Footer' });
  // Placeholder until BCC approves the text: kept out of search results.
  return pageMetadata({
    locale: locale as Locale,
    path: '/privacy',
    title: t('privacy'),
    noindex: true,
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPlaceholder titleKey="privacy" />;
}
