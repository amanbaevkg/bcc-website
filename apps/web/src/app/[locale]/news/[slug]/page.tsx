import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { formatDate } from '@/components/news/date';
import styles from '@/components/news/News.module.css';
import { RichBody } from '@/components/news/RichBody';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { Link } from '@/i18n/navigation';
import { htmlLang, routing, type Locale } from '@/i18n/routing';
import { getNewsParams, getNewsPost } from '@/lib/cms/news';

type Props = { params: Promise<{ locale: string; slug: string }> };

/*
 * Articles are pre-rendered. Unknown slugs match no page and get the full 404 (see
 * app/global-not-found.tsx); a newly published article appears after the next build,
 * which a Sanity webhook can trigger through the host's deploy hook.
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  return getNewsParams(routing.locales);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getNewsPost(locale as Locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    robots: post.fixture ? { index: false } : undefined,
    openGraph: {
      type: 'article',
      publishedTime: post.date,
      images: post.cover
        ? [{ url: post.cover.src, width: post.cover.width, height: post.cover.height }]
        : undefined,
    },
  };
}

export default async function NewsArticle({ params }: Props) {
  const { locale: raw, slug } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations('News');
  const post = await getNewsPost(locale, slug);
  // Only reachable for pre-rendered slugs, so a post is always found.
  if (!post) return null;
  const lang = post.lang !== locale ? htmlLang[post.lang] : undefined;

  return (
    <article className={styles.article}>
      <header className={styles.articleHead} data-header-overlay>
        <div className="wrap">
          <Link href="/news" className={styles.back}>
            <Icon name="arrowLeft" />
            {t('allNews')}
          </Link>
          <p className={styles.meta}>
            <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
            {lang && <span className={styles.tag}>{t('inEnglish')}</span>}
            {post.fixture && <span className={styles.tagTest}>{t('testData')}</span>}
          </p>
          <h1 className={`xl ${styles.articleTitle}`} lang={lang}>
            {post.title}
          </h1>
          <p className={styles.lede} lang={lang}>
            {post.excerpt}
          </p>
        </div>
      </header>
      {post.cover && (
        <div className={styles.coverBand}>
          <div className="wrap">
            <Photo
              image={post.cover}
              locale={locale}
              className={styles.cover}
              sizes="(width < 1440px) 100vw, 1320px"
              priority
            />
          </div>
        </div>
      )}
      <div className={`wrap ${styles.articleBody}`} lang={lang}>
        <RichBody blocks={post.body} locale={locale} />
        {post.author && <p className={styles.author}>{t('author', { author: post.author })}</p>}
        <Link href="/news" className={styles.back2}>
          <Icon name="arrowLeft" />
          {t('allNews')}
        </Link>
      </div>
    </article>
  );
}
