import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm, type FormTexts } from '@/components/contact/ContactForm';
import { ContactGallery } from '@/components/contact/ContactGallery';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { pick, type ContactPage as ContactContent } from '@/content/types';
import { getContactPage } from '@/lib/cms/contact';
import { getSiteInfo } from '@/lib/cms/site';
import type { Locale } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import styles from './contact.module.css';

type Props = { params: Promise<{ locale: string }> };

/** The form's words and answers in the page's language. */
function formTexts(form: ContactContent['form'], locale: Locale): FormTexts {
  const { officeTypes, services, ...words } = form;
  const out = Object.fromEntries(
    Object.entries(words).map(([k, v]) => [k, pick(v, locale)]),
  ) as Omit<FormTexts, 'officeTypes' | 'services'>;
  const answers = (list: typeof officeTypes) =>
    list.map((c) => ({ ...c, label: pick(c.label, locale) }));
  return { ...out, officeTypes: answers(officeTypes), services: answers(services) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  const page = await getContactPage();
  return pageMetadata({
    locale: locale as Locale,
    path: '/contact',
    title: t('metaTitle'),
    description: pick(page.form.body, locale as Locale),
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const tf = await getTranslations('Footer');
  const [site, page] = await Promise.all([getSiteInfo(), getContactPage()]);

  const cards = [
    {
      label: pick(page.top.callUs, locale),
      value: site.phone.display,
      href: site.phone.href,
    },
    {
      label: pick(page.top.visitUs, locale),
      value: `${site.address.street}\n${site.address.postalCode} ${site.address.city}\n${tf('country')}`,
      href: site.mapUrl,
      external: true,
    },
    {
      label: pick(page.top.writeUs, locale),
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  return (
    <>
      <section className={styles.top} data-header-overlay>
        <div className="wrap">
          <span className={`label ${styles.eyebrow}`}>{pick(page.top.eyebrow, locale)}</span>
          <h1 className={`xl ${styles.title}`}>{pick(page.top.title, locale)}</h1>
          <p className={`serif-accent ${styles.subtitle}`}>{pick(page.top.subtitle, locale)}</p>
          <ul className={styles.cards}>
            {cards.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  className={styles.card}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className={styles.cardLabel}>{c.label}</span>
                  <span className={styles.cardValue}>{c.value}</span>
                  <Icon name="arrowUpRight" className={styles.cardArrow} width={20} height={20} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.formSection} id="form">
        <div className={`wrap ${styles.formGrid}`}>
          <div className={styles.intro}>
            <h2 className={`xl ${styles.introTitle}`}>{pick(page.form.title, locale)}</h2>
            <p className={styles.introBody}>{pick(page.form.body, locale)}</p>
          </div>
          <div className={styles.formCard}>
            <ContactForm fallbackEmail={site.email} texts={formTexts(page.form, locale)} />
          </div>
        </div>
      </section>

      <ContactGallery data={page.gallery} locale={locale} />

      <section className={styles.cta}>
        <Photo
          image={page.cta.image}
          locale={locale}
          className={styles.ctaBg}
          sizes="100vw"
          still
        />
        <div className={styles.ctaShade} aria-hidden="true" />
        <div className={`wrap ${styles.ctaInner}`}>
          <h2 className={`xl ${styles.ctaTitle}`}>{pick(page.cta.title, locale)}</h2>
          <p className={styles.ctaBody}>{pick(page.cta.body, locale)}</p>
          <div className={styles.ctaActions}>
            <Button href={site.phone.href} variant="light">
              {site.phone.display}
            </Button>
            <Button href={site.mapUrl} variant="outline-light">
              {pick(page.cta.mapButton, locale)}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
