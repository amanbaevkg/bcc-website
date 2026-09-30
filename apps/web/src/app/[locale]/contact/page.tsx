import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { homeFallback } from '@/content/fallback/home';
import { siteFallback } from '@/content/site';
import type { Locale } from '@/i18n/routing';
import styles from './contact.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  return { title: t('metaTitle'), description: t('introBody') };
}

export default async function ContactPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations('Contact');
  const tf = await getTranslations('Footer');
  const site = siteFallback;

  const cards = [
    {
      label: t('callUs'),
      value: site.phone.display,
      href: site.phone.href,
    },
    {
      label: t('visitUs'),
      value: `${site.address.street}\n${site.address.postalCode} ${site.address.city}\n${tf('country')}`,
      href: site.mapUrl,
      external: true,
    },
    {
      label: t('writeUs'),
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  return (
    <>
      <section className={styles.top} data-header-overlay>
        <div className="wrap">
          <span className={`label ${styles.eyebrow}`}>{t('eyebrow')}</span>
          <h1 className={`xl ${styles.title}`}>{t('title')}</h1>
          <p className={`serif-accent ${styles.subtitle}`}>{t('subtitle')}</p>
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
            <h2 className={`xl ${styles.introTitle}`}>{t('introTitle')}</h2>
            <p className={styles.introBody}>{t('introBody')}</p>
          </div>
          <div className={styles.formCard}>
            <ContactForm fallbackEmail={site.email} />
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <Photo
          image={homeFallback.final.image}
          locale={locale}
          className={styles.ctaBg}
          sizes="100vw"
          still
        />
        <div className={styles.ctaShade} aria-hidden="true" />
        <div className={`wrap ${styles.ctaInner}`}>
          <h2 className={`xl ${styles.ctaTitle}`}>{t('ctaTitle')}</h2>
          <p className={styles.ctaBody}>{t('ctaBody')}</p>
          <div className={styles.ctaActions}>
            <Button href={site.phone.href} variant="light">
              {site.phone.display}
            </Button>
            <Button href={site.mapUrl} variant="outline-light">
              {tf('openMap')}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
