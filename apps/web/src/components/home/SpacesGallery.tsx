'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './Spaces.module.css';

/**
 * Horizontal gallery: native scrolling (touch, trackpad, keyboard) plus previous/next
 * buttons, a counter and a progress bar. Works with any number of photos.
 */
export function SpacesGallery({
  children,
  count,
  extra,
  labels,
}: {
  children: ReactNode;
  count: number;
  extra?: ReactNode;
  /** Screen-reader names; the home page's "spaces" wording by default. */
  labels?: { region: string; previous: string; next: string };
}) {
  const t = useTranslations('Home');
  const l = labels ?? { region: t('galleryLabel'), previous: t('previous'), next: t('next') };
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [bar, setBar] = useState({ left: 0, width: 100 });

  const items = () => [...(ref.current?.querySelectorAll<HTMLElement>(':scope > figure') ?? [])];

  const update = useCallback(() => {
    const g = ref.current;
    if (!g) return;
    const figs = items();
    const first = figs[0]?.offsetLeft ?? 0;
    let best = 0;
    figs.forEach((f, i) => {
      if (f.offsetLeft - first - 80 <= g.scrollLeft) best = i;
    });
    if (g.scrollLeft + g.clientWidth >= g.scrollWidth - 4) best = figs.length - 1;
    setIndex(best);
    const max = g.scrollWidth - g.clientWidth;
    const width = Math.max(12, (g.clientWidth / g.scrollWidth) * 100);
    setBar({ width, left: max > 0 ? (g.scrollLeft / max) * (100 - width) : 0 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const go = (step: number) => {
    const g = ref.current;
    const figs = items();
    const target = figs[Math.min(figs.length - 1, Math.max(0, index + step))];
    if (g && target) g.scrollTo({ left: target.offsetLeft - (figs[0]?.offsetLeft ?? 0) });
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      <div className={`wrap ${styles.controlsRow}`}>
        <div className={styles.ctrl}>
          <span className={styles.count} aria-hidden="true">
            {pad(index + 1)} / {pad(count)}
          </span>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(-1)}
            disabled={index === 0}
          >
            <span className="visually-hidden">{l.previous}</span>
            <Icon name="arrowLeft" width={18} height={18} />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => go(1)}
            disabled={index >= count - 1}
          >
            <span className="visually-hidden">{l.next}</span>
            <Icon name="arrow" width={18} height={18} />
          </button>
          {extra}
        </div>
      </div>
      <div
        ref={ref}
        className={styles.gallery}
        tabIndex={0}
        role="region"
        aria-label={l.region}
        onScroll={update}
      >
        {children}
      </div>
      <div className="wrap">
        <div className={styles.progress} aria-hidden="true">
          <span style={{ left: `${bar.left}%`, width: `${bar.width}%` }} />
        </div>
      </div>
    </>
  );
}
