import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { RichBlock } from '@/content/types';
import { image, type SanityImage } from '@/lib/cms/map';
import type { Locale } from '@/i18n/routing';
import { Photo } from '@/components/ui/Photo';
import styles from './RichBody.module.css';

/**
 * Article text from the CMS, rendered as React elements (never raw HTML).
 * Only the structure the design supports: paragraphs, two heading levels, quotes,
 * bold/italic, links and photos.
 */
export function RichBody({ blocks, locale }: { blocks: RichBlock[]; locale: Locale }) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p>{children}</p>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
      blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    },
    marks: {
      link: ({ value, children }) => {
        const href = String((value as { href?: string })?.href ?? '');
        const safe = /^(https?:|mailto:|tel:|\/)/.test(href) ? href : undefined;
        if (!safe) return <>{children}</>;
        const external = safe.startsWith('http');
        return (
          <a href={safe} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {children}
          </a>
        );
      },
    },
    types: {
      imageWithAlt: ({ value }) => {
        const img = image(value as SanityImage);
        return img ? (
          <Photo
            image={img}
            locale={locale}
            className={styles.photo}
            sizes="(width < 900px) 100vw, 760px"
          />
        ) : null;
      },
    },
  };
  return (
    <div className={styles.body}>
      <PortableText value={blocks as never} components={components} />
    </div>
  );
}
