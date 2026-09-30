'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pick, type HomePage } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import styles from './Hero.module.css';

type Hero = HomePage['hero'];

type Option = { value: string; label: string };

/**
 * Workspace selector in the hero. The choice is passed to the contact form as
 * ?workspace=…&team=… so the enquiry arrives pre-filled.
 */
export function Finder({ hero }: { hero: Hero }) {
  const t = useTranslations('Home');
  const locale = useLocale() as Locale;
  const [type, setType] = useState(hero.workspaceTypes[0]?.id ?? '');
  const [team, setTeam] = useState(hero.teamSizes[0] ?? 1);
  const current = hero.workspaceTypes.find((w) => w.id === type);
  const sized = !!current?.hasTeamSize && hero.teamSizes.length > 0;

  const query: Record<string, string> = { workspace: type };
  if (sized) query.team = String(team);

  return (
    <div className={styles.finder} role="group" aria-label={t('finderLabel')}>
      <Select
        label={t('workspaceLabel')}
        value={type}
        options={hero.workspaceTypes.map((w) => ({ value: w.id, label: pick(w.name, locale) }))}
        onChange={setType}
      />
      <Select
        label={t('teamSize')}
        value={sized ? String(team) : ''}
        placeholder={t('notApplicable')}
        disabled={!sized}
        options={hero.teamSizes.map((n) => ({
          value: String(n),
          label: t('persons', { count: n }),
        }))}
        onChange={(v) => setTeam(Number(v))}
      />
      <Link href={{ pathname: hero.cta.href, query }} className={styles.go}>
        {pick(hero.cta.label, locale)}
        <Icon name="arrowUpRight" />
      </Link>
    </div>
  );
}

type SelectProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

/** Custom listbox (the design needs a styled popup). Keyboard: arrows, Home/End, Enter, Escape. */
function Select({ label, value, options, onChange, disabled, placeholder }: SelectProps) {
  const id = useId();
  const [open, setOpenState] = useState(false);
  const [active, setActiveState] = useState(0);
  // Mirrors of the state for key handlers: fast typing can outrun React's re-render.
  const openRef = useRef(false);
  const activeRef = useRef(0);
  const setOpen = (v: boolean) => {
    openRef.current = v;
    setOpenState(v);
  };
  const setActive = (i: number) => {
    activeRef.current = i;
    setActiveState(i);
  };
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    listRef.current?.focus();
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, [open]);

  const show = () => {
    setActive(
      Math.max(
        0,
        options.findIndex((o) => o.value === value),
      ),
    );
    setOpen(true);
  };
  const choose = (i: number) => {
    const o = options[i];
    if (o) onChange(o.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const current = activeRef.current;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(current + 1, last),
      ArrowUp: Math.max(current - 1, 0),
      Home: 0,
      End: last,
    };
    if (e.key in moves) {
      e.preventDefault();
      setActive(moves[e.key]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(activeRef.current);
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      setOpen(false);
      if (e.key === 'Escape') buttonRef.current?.focus();
    }
  };

  return (
    <div ref={rootRef} className={styles.field}>
      <button
        ref={buttonRef}
        type="button"
        id={`${id}-button`}
        className={styles.fieldBtn}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-button`}
        disabled={disabled}
        onClick={() => (openRef.current ? setOpen(false) : show())}
        onKeyDown={(e) => {
          // Keys typed before focus reaches the open list still steer it.
          if (openRef.current) return onListKey(e);
          if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            show();
          }
        }}
      >
        <span id={`${id}-label`} className={styles.k}>
          {label}
        </span>
        <span className={styles.v}>{selected?.label ?? placeholder}</span>
        <Icon name="chevron" width={14} height={14} className={styles.chev} />
      </button>
      <ul
        ref={listRef}
        id={`${id}-list`}
        role="listbox"
        aria-labelledby={`${id}-label`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        tabIndex={-1}
        hidden={!open}
        className={styles.menu}
        onKeyDown={onListKey}
      >
        {options.map((o, i) => (
          <li
            key={o.value}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={o.value === value}
            className={i === active ? styles.hl : undefined}
            onPointerMove={() => activeRef.current !== i && setActive(i)}
            onClick={() => choose(i)}
          >
            {o.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
