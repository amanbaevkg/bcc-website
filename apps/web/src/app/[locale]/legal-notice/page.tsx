import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { LegalPage, legalMetadata } from '@/components/layout/LegalPage';
import type { Locale } from '@/i18n/routing';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return legalMetadata('legal-notice', (await params).locale as Locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage kind="legal-notice" locale={locale as Locale} />;
}
