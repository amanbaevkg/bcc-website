import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import styles from './legal.module.css';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <section className={styles.page}>
      <div className="wrap">
        <p className="label">404</p>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.body}>{t('body')}</p>
        <p className={styles.body}>
          <Link href="/">{t('back')}</Link>
        </p>
      </div>
    </section>
  );
}
