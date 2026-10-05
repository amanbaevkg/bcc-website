import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pick, type HomePage } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { SpacesGallery } from './SpacesGallery';
import styles from './Spaces.module.css';

export function Spaces({ data, locale }: { data: HomePage['spaces']; locale: Locale }) {
  if (data.items.length === 0) return null;
  return (
    <section className={styles.spaces}>
      <div className={`wrap ${styles.head}`}>
        <h2 className={`xl ${styles.title}`}>{pick(data.title, locale)}</h2>
      </div>
      <SpacesGallery
        count={data.items.length}
        extra={
          <Link href={data.moreLink.href} className={`${styles.navBtn} ${styles.about}`}>
            <span className="visually-hidden">{pick(data.moreLink.label, locale)}</span>
            <Icon name="arrowUpRight" width={18} height={18} />
          </Link>
        }
      >
        {data.items.map((s, i) => (
          <figure key={i} className={styles.item}>
            <Photo
              image={s.image}
              locale={locale}
              className={styles.frame}
              sizes="(width < 900px) 80vw, 560px"
            />
            <figcaption>{pick(s.caption, locale)}</figcaption>
          </figure>
        ))}
      </SpacesGallery>
    </section>
  );
}
