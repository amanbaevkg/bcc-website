import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { formatDate } from '@/components/news/date';
import styles from '@/components/news/News.module.css';
import { RichBody } from '@/components/news/RichBody';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { Link } from '@/i18n/navigation';
import { htmlLang, type Locale } from '@/i18n/routing';
import { JsonLd } from '@/components/seo/JsonLd';
import { getNewsPost } from '@/lib/cms/news';
import { env } from '@/lib/env';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string; slug: string }> };

/*
 * Articles are read from the admin on request (cached until the next save there), so a newly
 * published article appears at once. An unknown slug gets the 404 page.
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getNewsPost(locale as Locale, slug);
  if (!post) return {};
  // An English post shown on a French page points search engines at the English original.
  return pageMetadata({
    locale: post.lang,
    locales: [post.lang],
    path: `/news/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    noindex: post.fixture,
    type: 'article',
    publishedTime: post.date,
    image: post.cover && {
      url: post.cover.src,
      width: post.cover.width,
      height: post.cover.height,
    },
  });
}

export default async function NewsArticle({ params }: Props) {
  const { locale: raw, slug } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations('News');
  const post = await getNewsPost(locale, slug);
  if (!post) notFound();
  const lang = post.lang !== locale ? htmlLang[post.lang] : undefined;

  return (
    <article className={styles.article}>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          inLanguage: htmlLang[post.lang],
          image: post.cover ? [new URL(post.cover.src, env().SITE_URL).toString()] : undefined,
          author: post.author ? { '@type': 'Person', name: post.author } : undefined,
          publisher: { '@id': `${env().SITE_URL}/#business` },
          mainEntityOfPage: `${env().SITE_URL}/${post.lang}/news/${post.slug}`,
        }}
      />
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
        <RichBody doc={post.body} locale={locale} />
        {post.author && <p className={styles.author}>{t('author', { author: post.author })}</p>}
        <Link href="/news" className={styles.back2}>
          <Icon name="arrowLeft" />
          {t('allNews')}
        </Link>
      </div>
    </article>
  );
}
