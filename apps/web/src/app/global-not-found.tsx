import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import de from '../../messages/de.json';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import lu from '../../messages/lu.json';
import { htmlLang, localeNames, routing, type Locale } from '@/i18n/routing';
import '@/styles/globals.css';
import styles from './global-not-found.module.css';

/*
 * Every URL that matches no route lands here, fully rendered on the server with a 404 status.
 * It sits outside the language layout, so it speaks all four languages at once.
 *
 * Next.js 16 renders pages that call notFound() as an empty shell filled in by JavaScript,
 * so the site avoids notFound() for unknown URLs: dynamic routes use generateStaticParams
 * with dynamicParams = false, which sends unknown slugs here instead.
 */
const messages: Record<Locale, typeof en> = { en, fr, de, lu };

export const metadata: Metadata = {
  title: `404 | ${en.Meta.siteName}`,
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main className={styles.page}>
          <div className="wrap">
            <Link href="/en" className={styles.logo} aria-label={en.Common.homeLink}>
              <Image src="/images/bcc-logo.png" alt="" width={569} height={257} priority />
            </Link>
            <p className="label">404</p>
            <ul className={styles.list}>
              {routing.locales.map((l, i) => {
                const t = messages[l].NotFound;
                const Heading = i === 0 ? 'h1' : 'h2';
                return (
                  <li key={l} lang={htmlLang[l]}>
                    <Heading className={styles.title}>{t.title}</Heading>
                    <p className={styles.body}>{t.body}</p>
                    <Link href={`/${l}`} hrefLang={htmlLang[l]} className={styles.link}>
                      <span aria-hidden="true">{l.toUpperCase()}</span>
                      {t.back}
                      <span className="visually-hidden"> ({localeNames[l]})</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </main>
      </body>
    </html>
  );
}
