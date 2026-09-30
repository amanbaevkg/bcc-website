import type { Locale } from '@/i18n/routing';
import { pick, type HomePage } from '@/content/types';
import { Photo } from '@/components/ui/Photo';
import styles from './Tomorrow.module.css';

/** Full-bleed building photo, three-line headline (last line in serif), card crossing into the next section. */
export function Tomorrow({ data, locale }: { data: HomePage['tomorrow']; locale: Locale }) {
  const lines = pick(data.lines, locale);
  return (
    <section className={styles.tomorrow}>
      <Photo image={data.image} locale={locale} className={styles.bg} sizes="100vw" still />
      <div className={styles.shade} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <h2 className={`xl ${styles.title}`}>
          {lines.map((line, i) => (
            <span
              key={i}
              className={i === lines.length - 1 && lines.length > 1 ? 'serif-accent' : undefined}
            >
              {line}
            </span>
          ))}
        </h2>
        <div className={styles.card}>
          <p>{pick(data.card, locale)}</p>
        </div>
      </div>
    </section>
  );
}
