'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { htmlLang, localeNames, routing } from '@/i18n/routing';
import { siteFallback } from '@/content/site';
import { Icon } from '@/components/ui/Icon';
import { navItems } from './navItems';
import styles from './MobileNav.module.css';

/**
 * Full-screen menu below 900 px. A native modal <dialog> gives focus trapping,
 * Escape to close and an inert page behind it without extra code.
 */
export function MobileNav() {
  const t = useTranslations('Nav');
  const tl = useTranslations('LanguageSelect');
  const locale = useLocale();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Close after navigating (including a language switch).
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname, locale]);

  return (
    <>
      <button
        type="button"
        className={styles.toggle}
        aria-haspopup="dialog"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span className="visually-hidden">{t('openMenu')}</span>
        <Icon name="menu" width={24} height={24} />
      </button>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-label={t('label')}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
      >
        <div className={styles.panel}>
          <div className={styles.top}>
            <button
              type="button"
              className={styles.close}
              onClick={() => dialogRef.current?.close()}
              autoFocus
            >
              <span className="visually-hidden">{t('closeMenu')}</span>
              <Icon name="close" width={24} height={24} />
            </button>
          </div>

          <nav aria-label={t('label')}>
            <ul className={styles.links}>
              {navItems.map((item) => (
                <li key={item.key}>
                  <Link href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.langs}>
            <p className="label">{tl('label')}</p>
            <ul>
              {routing.locales.map((l) => (
                <li key={l}>
                  <Link
                    href={pathname}
                    locale={l}
                    lang={htmlLang[l]}
                    hrefLang={htmlLang[l]}
                    aria-current={l === locale ? 'true' : undefined}
                  >
                    <span aria-hidden="true">{l.toUpperCase()}</span>
                    {localeNames[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.contact}>
            <a href={`mailto:${siteFallback.email}`}>{siteFallback.email}</a>
            <a href={siteFallback.phone.href}>{siteFallback.phone.display}</a>
          </div>
        </div>
      </dialog>
    </>
  );
}
