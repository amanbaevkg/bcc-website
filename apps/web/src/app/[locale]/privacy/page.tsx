import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage, legalMetadata } from '@/components/layout/LegalPage';
import type { Locale } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return legalMetadata('privacy', (await params).locale as Locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage kind="privacy" locale={locale as Locale} />;
}
