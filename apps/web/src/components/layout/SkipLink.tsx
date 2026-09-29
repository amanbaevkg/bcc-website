import { useTranslations } from 'next-intl';
import styles from './SkipLink.module.css';

export function SkipLink() {
  const t = useTranslations('Common');
  return (
    <a className={styles.skip} href="#main">
      {t('skipToContent')}
    </a>
  );
}
