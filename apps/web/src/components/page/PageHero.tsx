import type { ReactNode } from 'react';
import styles from './PageHero.module.css';

/** Navy opening block for inner pages; the header sits transparent over it. */
export function PageHero({
  eyebrow,
  title,
  accent,
  children,
}: {
  eyebrow: string;
  title: string;
  /** Trailing words of the title set in italic serif. */
  accent?: string;
  children?: ReactNode;
}) {
  const i = accent ? title.lastIndexOf(accent) : -1;
  return (
    <section className={styles.hero} data-header-overlay>
      <div className="wrap">
        <span className={`label ${styles.eyebrow}`}>{eyebrow}</span>
        <h1 className={`xl ${styles.title}`}>
          {i > 0 ? (
            <>
              {title.slice(0, i)}
              <em className="serif-accent">{accent}</em>
            </>
          ) : (
            title
          )}
        </h1>
        {children && <div className={styles.body}>{children}</div>}
      </div>
    </section>
  );
}
