import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { pick, type ContactPage } from '@/content/types';
import { Photo } from '@/components/ui/Photo';
import { SpacesGallery } from '@/components/home/SpacesGallery';
import styles from '@/components/home/Spaces.module.css';

/** Photo tour of the building, in the same gallery as "Our spaces" on the home page. */
export async function ContactGallery({
  data,
  locale,
}: {
  data: ContactPage['gallery'];
  locale: Locale;
}) {
  if (data.photos.length === 0) return null;
  const t = await getTranslations('Contact');
  return (
    <section className={`${styles.spaces} ${styles.compact}`}>
      <div className={`wrap ${styles.head}`}>
        <h2 className={`xl ${styles.title}`}>{pick(data.title, locale)}</h2>
      </div>
      <SpacesGallery
        count={data.photos.length}
        labels={{
          region: t('galleryLabel'),
          previous: t('galleryPrevious'),
          next: t('galleryNext'),
        }}
      >
        {data.photos.map((photo, i) => (
          <figure key={i} className={styles.item}>
            <Photo
              image={photo}
              locale={locale}
              className={styles.frame}
              sizes="(width < 900px) 80vw, 560px"
            />
          </figure>
        ))}
      </SpacesGallery>
    </section>
  );
}
