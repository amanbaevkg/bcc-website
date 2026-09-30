import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon } from './Icon';
import styles from './Button.module.css';

type Props = {
  href: string;
  children: ReactNode;
  variant: 'dark' | 'light' | 'outline-light';
  className?: string;
};

/** Pill link with the diagonal arrow. Internal paths get the current language prefix. */
export function Button({ href, children, variant, className }: Props) {
  return (
    <Link
      href={href}
      className={[styles.btn, styles[variant], className].filter(Boolean).join(' ')}
    >
      {children}
      <Icon name="arrowUpRight" />
    </Link>
  );
}
