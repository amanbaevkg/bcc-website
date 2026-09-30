import { setRequestLocale } from 'next-intl/server';
import { Coworking, PrivateOffices } from '@/components/home/Offers';
import { Final, FindMore, Testimonials } from '@/components/home/Closing';
import { Hero } from '@/components/home/Hero';
import { Spaces } from '@/components/home/Spaces';
import { Tomorrow } from '@/components/home/Tomorrow';
import { Trust } from '@/components/home/Trust';
import type { Metadata } from 'next';
import { pick } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getHomePage } from '@/lib/cms';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const home = await getHomePage();
  return pageMetadata({ locale, path: '', description: pick(home.hero.subtitle, locale) });
}

// The section order is fixed by design; the CMS only fills them.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const home = await getHomePage();

  return (
    <>
      <Hero hero={home.hero} locale={locale} />
      <Coworking offer={home.coworking} locale={locale} />
      <PrivateOffices
        offer={home.privateOffices}
        servicesLink={home.servicesLink}
        locale={locale}
      />
      <Trust trust={home.trust} locale={locale} />
      <Tomorrow data={home.tomorrow} locale={locale} />
      <Spaces data={home.spaces} locale={locale} />
      <FindMore data={home.findMore} locale={locale} />
      <Testimonials data={home.testimonials} locale={locale} />
      <Final data={home.final} locale={locale} />
    </>
  );
}
