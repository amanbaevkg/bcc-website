import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import styles from './page.module.css';

// Phase 1 placeholder. The home sections from the approved mockup arrive in phase 2.
export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('Meta');

  return (
    <section className={styles.hero} data-header-overlay>
      <div className="wrap">
        <h1 className={styles.title}>{t('siteName')}</h1>
        <p className={styles.lead}>{t('tagline')}</p>
      </div>
    </section>
  );
}
