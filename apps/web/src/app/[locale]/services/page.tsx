import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { RichText } from '@/components/home/RichText';
import { PageHero } from '@/components/page/PageHero';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { ServiceIcon } from '@/components/ui/ServiceIcon';
import { pick } from '@/content/types';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { getServicesPage } from '@/lib/cms';
import { pageMetadata } from '@/lib/seo';
import styles from './services.module.css';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Nav' });
  const s = await getServicesPage();
  return pageMetadata({
    locale: locale as Locale,
    path: '/services',
    title: t('services'),
    description: s.hero.body.map((b) => pick(b, locale as Locale)).join(' '),
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations('Services');
  const th = await getTranslations('Home');
  const s = await getServicesPage();
  const cw = s.choose.coworking;
  const po = s.choose.privateOffices;

  return (
    <>
      <PageHero eyebrow={pick(s.hero.eyebrow, locale)} title={pick(s.hero.title, locale)}>
        {s.hero.body.map((b, i) => (
          <p key={i}>{pick(b, locale)}</p>
        ))}
      </PageHero>

      <section className={styles.choose} id="offices">
        <div className="wrap">
          <h2 className={`xl ${styles.chooseTitle}`}>{pick(s.choose.title, locale)}</h2>

          <article className={styles.coworking}>
            <Photo
              image={cw.image}
              locale={locale}
              className={styles.cwPhoto}
              sizes="(width < 900px) 100vw, 55vw"
            />
            <div className={styles.cwText}>
              <span className={`label ${styles.kicker}`}>{pick(cw.kicker, locale)}</span>
              <h3 className={`xl ${styles.offerTitle}`}>{pick(cw.title, locale)}</h3>
              <p className={styles.body}>
                <RichText runs={pick(cw.body, locale)} />
              </p>
              <p className={styles.body}>{pick(cw.packages, locale)}</p>
              <blockquote className={styles.highlight}>{pick(cw.highlight, locale)}</blockquote>
              <p className={styles.audience}>{pick(cw.audience, locale)}</p>
              <Button href={cw.cta.href} variant="dark">
                {pick(cw.cta.label, locale)}
              </Button>
            </div>
          </article>

          <article className={styles.private}>
            <div className={styles.pvHead}>
              <h3 className={`xl ${styles.offerTitle}`}>{pick(po.title, locale)}</h3>
              <Photo image={po.image} locale={locale} className={styles.pvPhoto} sizes="220px" />
            </div>
            <ul className={styles.sizes}>
              {po.sizes.map((n) => (
                <li key={n}>
                  <Link
                    href={{
                      pathname: '/contact',
                      query: { workspace: 'private-office', team: String(n) },
                    }}
                    className={styles.size}
                    aria-label={t('sizeLabel', { size: th('persons', { count: n }) })}
                  >
                    <span className={`xl ${styles.sizeNum}`}>{n}</span>
                    <span className={styles.sizeUnit}>
                      {th('persons', { count: n }).replace(/^\d+\s*/, '')}
                    </span>
                    <span className={styles.sizeNote}>{pick(po.sizeNote, locale)}</span>
                    <span className={styles.sizeCta}>
                      {t('sizeCta')}
                      <Icon name="arrowUpRight" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.offers}>
        <div className={`wrap ${styles.offersGrid}`}>
          <h2 className={`xl ${styles.offersTitle}`}>{pick(s.offers.title, locale)}</h2>
          <ul className={styles.offerGrid}>
            {s.offers.items.map((o) => (
              <li key={o.icon} className={styles.offer}>
                <span className={styles.icon}>
                  <ServiceIcon name={o.icon} size={36} />
                </span>
                <h3 className={styles.offerName}>{pick(o.title, locale)}</h3>
                <p>{pick(o.body, locale)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`wrap ${styles.ctaInner}`}>
          <h2 className={`xl ${styles.ctaTitle}`}>{pick(s.cta.title, locale)}</h2>
          <Button href={s.cta.link.href} variant="light">
            {pick(s.cta.link.label, locale)}
          </Button>
        </div>
      </section>
    </>
  );
}
