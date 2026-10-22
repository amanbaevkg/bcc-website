'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { Icon } from '@/components/ui/Icon';
import { LanguageSelect } from './LanguageSelect';
import { MobileNav } from './MobileNav';
import { navItems } from './navItems';
import styles from './Header.module.css';

/**
 * Sticky header. Over a page hero (an element with [data-header-overlay]) it starts
 * transparent with light text, decided in CSS so the first paint is already right.
 * After scrolling it turns solid; it slides away while scrolling down and returns
 * when scrolling up or when anything inside it gets focus.
 */
export function Header({
  showNews,
  contact,
}: {
  showNews: boolean;
  contact: { email: string; phone: { display: string; href: string } };
}) {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);

  useEffect(() => {
    // The header hides only after a clear scroll down and comes back after a clear scroll up.
    // Phones scroll in steps of a few pixels (and bounce at the ends), so direction is decided
    // over a distance, not per frame: otherwise the header flickers in and out.
    const HIDE_AFTER = 48;
    const SHOW_AFTER = 24;
    // While shown: the highest point reached; while hidden: the lowest. A small bounce the
    // other way does not count until it is larger than the threshold.
    let turn = Math.max(0, window.scrollY);
    let hidden = false;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 40);
      if (y < 200) {
        hidden = false;
        turn = y;
      } else if (!hidden) {
        turn = Math.min(turn, y);
        if (y - turn > HIDE_AFTER) {
          hidden = true;
          turn = y;
        }
      } else {
        turn = Math.max(turn, y);
        if (turn - y > SHOW_AFTER) {
          hidden = false;
          turn = y;
        }
      }
      setAway(hidden);
    };
    update();
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <header
      className={[styles.header, scrolled && styles.scrolled, away && styles.away]
        .filter(Boolean)
        .join(' ')}
      onFocusCapture={() => setAway(false)}
    >
      <div className={`wrap ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={tc('homeLink')}>
          <Image src="/images/bcc-logo.png" alt="" width={569} height={257} priority />
        </Link>

        <nav aria-label={t('label')} className={styles.nav}>
          {navItems(showNews).map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <LanguageSelect className={styles.lang} />
          <span className={styles.rule} aria-hidden="true" />
          <Link href="/contact" className={styles.cta}>
            {t('cta')}
            <Icon name="arrow" />
          </Link>
          <MobileNav showNews={showNews} contact={contact} />
        </div>
      </div>
    </header>
  );
}
