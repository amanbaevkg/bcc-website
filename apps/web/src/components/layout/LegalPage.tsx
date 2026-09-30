import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import styles from '@/app/[locale]/legal.module.css';
import { formatDate } from '@/components/news/date';
import { RichBody } from '@/components/news/RichBody';
import type { Locale } from '@/i18n/routing';
import { getLegalPage } from '@/lib/cms/legal';
import { pageMetadata } from '@/lib/seo';
import { LegalPlaceholder } from './LegalPlaceholder';

type Kind = 'privacy' | 'legal-notice';
const titleKey = { privacy: 'privacy', 'legal-notice': 'legalNotice' } as const;

/** Search engines see a legal page only once its text is approved. */
export async function legalMetadata(kind: Kind, locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Footer' });
  const doc = await getLegalPage(kind, locale);
  return pageMetadata({
    locale,
    path: `/${kind}`,
    title: doc?.title ?? t(titleKey[kind]),
    noindex: !doc?.approved,
  });
}

/**
 * Privacy Policy / Legal Notice: the text BCC's legal adviser entered in the CMS, or the
 * placeholder while there is none. No legal wording is written in this code.
 */
export async function LegalPage({ kind, locale }: { kind: Kind; locale: Locale }) {
  const doc = await getLegalPage(kind, locale);
  if (!doc) return <LegalPlaceholder titleKey={titleKey[kind]} />;
  const t = await getTranslations('Legal');
  return (
    <section className={styles.page}>
      <div className="wrap">
        {!doc.approved && <p className={styles.draft}>{t('draft')}</p>}
        <h1 className={styles.title}>{doc.title}</h1>
        {doc.updatedAt && (
          <p className={styles.updated}>
            {t('updated', { date: formatDate(doc.updatedAt, locale) })}
          </p>
        )}
        <div className={styles.text}>
          <RichBody blocks={doc.body} locale={locale} />
        </div>
      </div>
    </section>
  );
}
