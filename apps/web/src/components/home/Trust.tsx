import Image from 'next/image';
import type { CSSProperties } from 'react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { pick, type ClientLogo, type HomePage } from '@/content/types';
import styles from './Trust.module.css';

function Logos({
  clients,
  locale,
  hidden,
}: {
  clients: ClientLogo[];
  locale: Locale;
  hidden?: boolean;
}) {
  return (
    <ul aria-hidden={hidden || undefined}>
      {clients.map((c) => {
        const img = (
          <Image
            src={c.logo.src}
            alt={hidden ? '' : pick(c.logo.alt, locale)}
            width={c.logo.width}
            height={c.logo.height}
            sizes="190px"
          />
        );
        return (
          <li key={c.name}>
            {c.url && !hidden ? (
              <a href={c.url} rel="noopener noreferrer" target="_blank">
                {img}
              </a>
            ) : (
              img
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Client logos. With enough logos to fill the row they scroll in a loop (paused on hover
 * and for reduced motion); with only a few they sit still in a row.
 */
export function Trust({ trust, locale }: { trust: HomePage['trust']; locale: Locale }) {
  const t = useTranslations('Home');
  if (trust.clients.length === 0) return null;
  const loop = trust.clients.length >= 5;
  return (
    <section className={styles.band}>
      <div className={`wrap ${styles.trust}`}>
        <h2 className="xl">{pick(trust.title, locale)}</h2>
        <div
          className={loop ? styles.marquee : styles.still}
          role="region"
          aria-label={t('clientsLabel')}
        >
          <div className={styles.track} style={{ '--n': trust.clients.length } as CSSProperties}>
            <Logos clients={trust.clients} locale={locale} />
            {loop && <Logos clients={trust.clients} locale={locale} hidden />}
          </div>
        </div>
      </div>
    </section>
  );
}
