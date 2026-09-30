'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { VideoAsset } from '@/content/types';
import styles from './Hero.module.css';

const noSubscribe = () => () => {};

function chooseSource(video: VideoAsset): string | null {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData;
  if (reduce || saveData) return null;
  const px = Math.min(window.innerWidth * window.devicePixelRatio, 3840);
  const wanted = px >= 1280 ? 1080 : px >= 720 ? 720 : 480;
  const sorted = [...video.sources].sort((a, b) => b.height - a.height);
  return (sorted.find((s) => s.height <= wanted) ?? sorted.at(-1))?.src ?? null;
}

/**
 * Background video over the poster image (the poster is rendered by the server and is the LCP).
 * The video is only attached after hydration, and never when the visitor prefers reduced motion
 * or has Data Saver on. The file is chosen by screen size: phones get 480p, tablets 720p.
 * It pauses while off screen or in a background tab, and has a visible pause button (WCAG 2.2.2).
 */
export function HeroVideo({ video }: { video: VideoAsset }) {
  const t = useTranslations('Home');
  const ref = useRef<HTMLVideoElement>(null);
  // Decided in the browser only; the server always renders the poster alone.
  const src = useSyncExternalStore(
    noSubscribe,
    () => chooseSource(video),
    () => null,
  );
  // Once the first frame plays, the video stays over the poster (also while paused).
  const [started, setStarted] = useState(false);
  const [userPaused, setUserPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    const sync = (visible: boolean) => {
      if (visible && !document.hidden && !userPaused) el.play().catch(() => {});
      else el.pause();
    };
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync(visible);
    });
    io.observe(el);
    const onVisibility = () => sync(visible);
    document.addEventListener('visibilitychange', onVisibility);
    sync(visible);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [src, userPaused]);

  if (!src) return null;

  return (
    <>
      <video
        ref={ref}
        className={[styles.video, started && styles.videoOn].filter(Boolean).join(' ')}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        onPlaying={() => setStarted(true)}
      />
      <button
        type="button"
        className={styles.pause}
        aria-pressed={userPaused}
        onClick={() => setUserPaused((v) => !v)}
      >
        <span className="visually-hidden">{userPaused ? t('playVideo') : t('pauseVideo')}</span>
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">
          {userPaused ? (
            <path fill="currentColor" d="M8 5v14l11-7z" />
          ) : (
            <path fill="currentColor" d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
          )}
        </svg>
      </button>
    </>
  );
}
