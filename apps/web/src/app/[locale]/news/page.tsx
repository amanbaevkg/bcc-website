import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { NewsCard } from '@/components/news/NewsCard';
import styles from '@/components/news/News.module.css';
import { PageHero } from '@/components/page/PageHero';
import { Button } from '@/components/ui/Button';
import type { Locale } from '@/i18n/routing';
import { getNewsList } from '@/lib/cms/news';
import { pageMetadata } from '@/lib/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'News' });
  const posts = await getNewsList(locale as Locale);
  return pageMetadata({
    locale: locale as Locale,
    path: '/news',
    title: t('title'),
    description: t('intro'),
    // An empty list is not worth indexing.
    noindex: posts.length === 0,
  });
}

export default async function NewsPage({ params }: Props) {
  const { locale: raw } = await params;
  setRequestLocale(raw);
  const locale = raw as Locale;
  const t = await getTranslations('News');
  const tn = await getTranslations('Nav');
  const posts = await getNewsList(locale);
  const [first, ...rest] = posts;

  return (
    <>
      <PageHero eyebrow={t('title')} title={t('intro')} />
      <section className={styles.list}>
        <div className="wrap">
          {first ? (
            <>
              <NewsCard post={first} locale={locale} featured />
              {rest.length > 0 && (
                <div className={styles.grid}>
                  {rest.map((p) => (
                    <NewsCard key={p.slug} post={p} locale={locale} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.empty}>
              <h2 className={`xl ${styles.emptyTitle}`}>{t('emptyTitle')}</h2>
              <p>{t('emptyBody')}</p>
              <Button href="/contact" variant="dark">
                {tn('contact')}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
