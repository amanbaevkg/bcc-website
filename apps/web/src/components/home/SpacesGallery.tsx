'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './Spaces.module.css';

/** Speed of the automatic glide, in pixels per second. */
const GLIDE = 40;
/** After the visitor scrolls, the glide waits this long before it carries on. */
const IDLE_MS = 3000;

/**
 * Horizontal gallery: native scrolling (touch, trackpad, keyboard) plus previous/next
 * buttons, a counter and a progress bar. Works with any number of photos.
 * The photos glide by on their own, like the logo strip; the glide pauses while the pointer
 * is over the gallery, while it has keyboard focus, and for a moment after any manual scroll,
 * then starts over from the first photo at the end. No glide with "reduce motion".
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

  // The automatic glide.
  const hold = useRef({ hover: false, focus: false, until: 0 });
  const [gliding, setGliding] = useState(false);
  const manual = useCallback(() => {
    hold.current.until = performance.now() + IDLE_MS;
  }, []);

  useEffect(() => {
    const g = ref.current;
    if (!g || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let visible = false;
    const seen = new IntersectionObserver(([e]) => (visible = !!e?.isIntersecting));
    seen.observe(g);
    let frame = 0;
    let last = 0;
    let pos = g.scrollLeft;
    let on = false;
    let rewind = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(100, now - (last || now));
      last = now;
      const h = hold.current;
      const max = g.scrollWidth - g.clientWidth;
      const run = visible && !document.hidden && !h.hover && !h.focus && now >= h.until && max > 0;
      if (run !== on) {
        on = run;
        setGliding(run);
        pos = g.scrollLeft;
      }
      if (!run) return;
      if (pos >= max - 1) {
        // At the last photo: a short pause, then back to the first one.
        h.until = now + 1500 + IDLE_MS;
        rewind = window.setTimeout(() => g.scrollTo({ left: 0, behavior: 'smooth' }), 1500);
        return;
      }
      pos = Math.min(max, pos + (GLIDE * dt) / 1000);
      g.scrollLeft = pos;
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(rewind);
      seen.disconnect();
    };
  }, []);

  const go = (step: number) => {
    manual();
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
        className={`${styles.gallery} ${gliding ? styles.gliding : ''}`}
        tabIndex={0}
        role="region"
        aria-label={l.region}
        onScroll={update}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') hold.current.hover = true;
        }}
        onPointerLeave={() => {
          hold.current.hover = false;
        }}
        onPointerDown={manual}
        onTouchStart={manual}
        onTouchEnd={manual}
        onWheel={manual}
        onKeyDown={manual}
        onFocus={(e) => {
          // Keyboard focus only: a mouse click on a photo should not stop the glide for good.
          hold.current.focus = e.target.matches(':focus-visible');
        }}
        onBlur={() => {
          hold.current.focus = false;
        }}
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
