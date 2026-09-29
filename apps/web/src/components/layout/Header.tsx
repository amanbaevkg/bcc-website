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
export function Header() {
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 40);
      setAway(y > 400 && y > lastY + 4);
      if (Math.abs(y - lastY) > 4) lastY = y;
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
          {navItems.map((item) => (
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
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
