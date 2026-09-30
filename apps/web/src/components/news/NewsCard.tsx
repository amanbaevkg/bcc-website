import { useTranslations } from 'next-intl';
import type { NewsSummary } from '@/content/types';
import { Link } from '@/i18n/navigation';
import { htmlLang, type Locale } from '@/i18n/routing';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { formatDate } from './date';
import styles from './News.module.css';

export function NewsCard({
  post,
  locale,
  featured,
}: {
  post: NewsSummary;
  locale: Locale;
  featured?: boolean;
}) {
  const t = useTranslations('News');
  return (
    <article className={[styles.card, featured && styles.featured].filter(Boolean).join(' ')}>
      <Link href={`/news/${post.slug}`} className={styles.cardLink}>
        {post.cover ? (
          <Photo
            image={post.cover}
            locale={locale}
            className={styles.cardPhoto}
            sizes={featured ? '(width < 900px) 100vw, 60vw' : '(width < 600px) 100vw, 33vw'}
          />
        ) : (
          <div className={styles.cardPlain} aria-hidden="true">
            <span className="xl">BCC</span>
          </div>
        )}
        <div className={styles.cardText}>
          <p className={styles.meta}>
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            {post.lang !== locale && <span className={styles.tag}>{t('inEnglish')}</span>}
            {post.fixture && <span className={styles.tagTest}>{t('testData')}</span>}
          </p>
          <h2
            className={styles.cardTitle}
            lang={post.lang !== locale ? htmlLang[post.lang] : undefined}
          >
            {post.title}
          </h2>
          <p
            className={styles.excerpt}
            lang={post.lang !== locale ? htmlLang[post.lang] : undefined}
          >
            {post.excerpt}
          </p>
          <span className={styles.more}>
            {t('readMore')}
            <Icon name="arrowUpRight" />
          </span>
        </div>
      </Link>
    </article>
  );
}
