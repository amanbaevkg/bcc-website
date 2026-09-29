import { useTranslations } from 'next-intl';
import styles from '@/app/[locale]/legal.module.css';

/**
 * Legal pages stay placeholders until BCC supplies approved text.
 * No legal wording is written here on purpose; see README "Launch checklist".
 */
export function LegalPlaceholder({ titleKey }: { titleKey: 'privacy' | 'legalNotice' }) {
  const tFooter = useTranslations('Footer');
  const t = useTranslations('Legal');
  return (
    <section className={styles.page}>
      <div className="wrap">
        <h1 className={styles.title}>{tFooter(titleKey)}</h1>
        <p className={styles.body}>
          <strong>{t('pendingTitle')}.</strong> {t('pendingBody')}
        </p>
      </div>
    </section>
  );
}
