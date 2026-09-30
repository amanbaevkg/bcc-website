import Image from 'next/image';
import type { Locale } from '@/i18n/routing';
import { pick, type ImageAsset } from '@/content/types';
import styles from './Photo.module.css';

type Props = {
  image: ImageAsset;
  locale: Locale;
  /** CSS sizes hint for responsive image selection, e.g. "(width < 900px) 100vw, 50vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Background photos skip the hover zoom. */
  still?: boolean;
};

/**
 * A photo that fills its slot. The slot (set by the section) decides the size and ratio;
 * the image's hotspot keeps the subject in frame at every width.
 */
export function Photo({ image, locale, sizes, className, priority, still }: Props) {
  const position = image.hotspot
    ? `${Math.round(image.hotspot.x * 100)}% ${Math.round(image.hotspot.y * 100)}%`
    : undefined;
  return (
    <figure className={[styles.photo, still && styles.still, className].filter(Boolean).join(' ')}>
      <Image
        src={image.src}
        alt={pick(image.alt, locale)}
        fill
        sizes={sizes}
        priority={priority}
        style={position ? { objectPosition: position } : undefined}
      />
    </figure>
  );
}
