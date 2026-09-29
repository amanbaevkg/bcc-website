'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { htmlLang, localeNames, routing, type Locale } from '@/i18n/routing';
import { Icon } from '@/components/ui/Icon';
import styles from './LanguageSelect.module.css';

/**
 * Dropdown language selector: a disclosure button that reveals a list of links.
 * Links (not buttons) so every language version is a real, crawlable URL.
 */
export function LanguageSelect({ className }: { className?: string }) {
  const t = useTranslations('LanguageSelect');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const links = [...e.currentTarget.querySelectorAll('a')];
    const i = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next =
      e.key === 'ArrowDown' ? (i + 1) % links.length : (i - 1 + links.length) % links.length;
    links[next]?.focus();
  };

  return (
    <div
      ref={rootRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={styles.button}
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t('button', { language: localeNames[locale] })}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
            requestAnimationFrame(() =>
              document.getElementById(listId)?.querySelector<HTMLAnchorElement>('a')?.focus(),
            );
          }
        }}
      >
        <span aria-hidden="true">{locale.toUpperCase()}</span>
        <Icon name="chevron" width={14} height={14} className={styles.chevron} />
      </button>
      <ul id={listId} className={styles.list} hidden={!open} onKeyDown={onListKey}>
        {routing.locales.map((l) => (
          <li key={l}>
            <Link
              href={pathname}
              locale={l}
              lang={htmlLang[l]}
              hrefLang={htmlLang[l]}
              aria-current={l === locale ? 'true' : undefined}
              className={styles.item}
              onClick={() => setOpen(false)}
            >
              <span className={styles.code}>{l.toUpperCase()}</span>
              {localeNames[l]}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
