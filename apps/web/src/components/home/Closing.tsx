import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { pick, type HomePage } from '@/content/types';
import { Button } from '@/components/ui/Button';
import { Star } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import styles from './Closing.module.css';

export function FindMore({ data, locale }: { data: HomePage['findMore']; locale: Locale }) {
  return (
    <section className={styles.findmore}>
      <div className={`wrap ${styles.fmInner}`}>
        <h2 className={`xl ${styles.fmTitle}`}>{pick(data.title, locale)}</h2>
        <Button href={data.cta.href} variant="dark">
          {pick(data.cta.label, locale)}
        </Button>
      </div>
    </section>
  );
}

/**
 * Testimonials are shown word for word in the language they were written in.
 * Layouts cycle every three quotes: a large one, then two side-by-side variants.
 */
export function Testimonials({ data, locale }: { data: HomePage['testimonials']; locale: Locale }) {
  const t = useTranslations('Home');
  if (data.items.length === 0) return null;
  return (
    <section className={styles.voices}>
      <div className={`wrap ${styles.vInner}`}>
        <div className={styles.vHead}>
          <div className={styles.qmark} aria-hidden="true">
            “
          </div>
          <h2 className={`xl ${styles.vTitle}`}>{pick(data.title, locale)}</h2>
        </div>
        <div className={styles.vList}>
          {data.items.map((q) => (
            <figure key={q.name + q.company} className={styles.voice}>
              <blockquote lang="en">{pick(q.quote, locale)}</blockquote>
              <figcaption className={styles.who}>
                <span
                  className={styles.stars}
                  role="img"
                  aria-label={t('rating', { rating: q.rating })}
                >
                  {Array.from({ length: q.rating }, (_, i) => (
                    <Star key={i} />
                  ))}
                </span>
                <span className={styles.co}>{q.company}</span>
                <span className={styles.nm}>
                  {q.name}, {pick(q.role, locale)}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Final({ data, locale }: { data: HomePage['final']; locale: Locale }) {
  const lines = pick(data.lines, locale);
  return (
    <section className={styles.final}>
      <Photo image={data.image} locale={locale} className={styles.bg} sizes="100vw" still />
      <div className={styles.shade} aria-hidden="true" />
      <div className={`wrap ${styles.fInner}`}>
        <h2 className={`xl ${styles.fTitle}`}>
          {lines.map((line, i) => (
            <span key={i} className={i > 0 ? 'serif-accent' : undefined}>
              {line}
            </span>
          ))}
        </h2>
        <div>
          <Button href={data.cta.href} variant="light">
            {pick(data.cta.label, locale)}
          </Button>
        </div>
      </div>
    </section>
  );
}
