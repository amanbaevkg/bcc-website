import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PageHero } from '@/components/page/PageHero';
import { Button } from '@/components/ui/Button';
import { Photo } from '@/components/ui/Photo';
import { pick } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import { getAboutPage } from '@/lib/cms';
import styles from './about.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Nav' });
  const about = await getAboutPage();
  return { title: t('about'), description: pick(about.hero.body, locale as Locale) };
}

export default async function AboutPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations('Nav');
  const a = await getAboutPage();

  return (
    <>
      <PageHero
        eyebrow={pick(a.hero.eyebrow, locale)}
        title={pick(a.hero.title, locale)}
        accent={a.hero.titleAccent && pick(a.hero.titleAccent, locale)}
      >
        <p>{pick(a.hero.body, locale)}</p>
        <div className={styles.actions}>
          <Button href={a.visit.cta.href} variant="light">
            {pick(a.visit.cta.label, locale)}
          </Button>
          <Button href="/services" variant="outline-light">
            {t('services')}
          </Button>
        </div>
      </PageHero>

      <div className={styles.band}>
        <div className="wrap">
          <Photo
            image={a.hero.image}
            locale={locale}
            className={styles.bandPhoto}
            sizes="(width < 1440px) 100vw, 1320px"
            priority
          />
        </div>
      </div>

      <section className={styles.facts}>
        <div className={`wrap ${styles.factsGrid}`}>
          <ul className={styles.highlights}>
            {a.highlights.map((h, i) => (
              <li key={i}>{pick(h, locale)}</li>
            ))}
          </ul>
          <div className={styles.side}>
            <dl className={styles.figures}>
              {a.figures.map((f) => (
                <div key={f.value}>
                  <dt className="xl">{f.value}</dt>
                  <dd>{pick(f.label, locale)}</dd>
                </div>
              ))}
            </dl>
            <p className={styles.location}>{pick(a.location, locale)}</p>
            <p className={styles.audience}>{pick(a.audience, locale)}</p>
          </div>
        </div>
      </section>

      {a.features.map((f, i) => (
        <section key={i} className={styles.feature} data-flip={i % 2 === 1 || undefined}>
          <div className={`wrap ${styles.featureGrid}`}>
            <Photo
              image={f.image}
              locale={locale}
              className={styles.featurePhoto}
              sizes="(width < 900px) 100vw, 50vw"
            />
            <div className={styles.featureText}>
              <h2 className={`xl ${styles.featureTitle}`}>{pick(f.title, locale)}</h2>
              <p className={styles.featureBody}>{pick(f.body, locale)}</p>
              {f.note && <p className={styles.note}>{pick(f.note, locale)}</p>}
              {f.cta && (
                <Button href={f.cta.href} variant="dark">
                  {pick(f.cta.label, locale)}
                </Button>
              )}
            </div>
          </div>
        </section>
      ))}

      <section className={styles.visit}>
        <Photo
          image={a.visit.image}
          locale={locale}
          className={styles.visitBg}
          sizes="100vw"
          still
        />
        <div className={styles.visitShade} aria-hidden="true" />
        <div className={`wrap ${styles.visitInner}`}>
          <span className={`label ${styles.visitEyebrow}`}>{pick(a.visit.eyebrow, locale)}</span>
          <h2 className={`xl ${styles.visitTitle}`}>{pick(a.visit.title, locale)}</h2>
          <div>
            <Button href={a.visit.cta.href} variant="light">
              {pick(a.visit.cta.label, locale)}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
