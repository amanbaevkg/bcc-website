import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { htmlLang, localeNames, routing } from '@/i18n/routing';
import { pick, type Localized } from '@/content/types';
import type { Locale } from '@/i18n/routing';
import type { SiteInfo } from '@/lib/cms/site';
import { Icon, SocialIcon } from '@/components/ui/Icon';
import { navItems } from './navItems';
import styles from './Footer.module.css';

const socialLabels = { linkedin: 'LinkedIn', facebook: 'Facebook' } as const;

export function Footer({ showNews, site }: { showNews: boolean; site: SiteInfo }) {
  const t = useTranslations('Footer');
  const tn = useTranslations('Nav');
  const tc = useTranslations('Common');
  const locale = useLocale();
  const f = (text: Localized) => pick(text, locale as Locale);

  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.top}>
          <p className={styles.tagline}>{f(site.footer.tagline)}</p>
          <Link href="/" className={styles.logo} aria-label={tc('homeLink')}>
            <Image src="/images/bcc-logo.png" alt="" width={569} height={257} />
          </Link>
        </div>

        <div className={styles.cols}>
          <div>
            <h2 className={styles.h}>{f(site.footer.getInTouch)}</h2>
            <div className={styles.big}>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={site.phone.href}>{site.phone.display}</a>
            </div>
          </div>

          <div>
            <h2 className={styles.h}>{f(site.footer.quickLinks)}</h2>
            <ul className={styles.list}>
              {navItems(showNews).map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>{tn(item.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.h}>{f(site.footer.follow)}</h2>
            <div className={styles.social}>
              {site.social.map((s) => (
                <a key={s.network} href={s.url} rel="noopener noreferrer" target="_blank">
                  <SocialIcon network={s.network} />
                  <span className="visually-hidden">{socialLabels[s.network]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className={styles.h}>{f(site.footer.address)}</h2>
            <address>
              {site.name}
              <br />
              {site.address.street}
              <br />
              {site.address.postalCode} {site.address.city}
              <br />
              {t('country')}
            </address>
            <a className={styles.map} href={site.mapUrl} rel="noopener noreferrer" target="_blank">
              {f(site.footer.openMap)}
              <Icon name="arrow" />
            </a>
          </div>

          <div>
            <h2 className={styles.h}>{f(site.footer.language)}</h2>
            <ul className={`${styles.list} ${styles.langs}`}>
              {routing.locales.map((l) => (
                <li key={l}>
                  <Link
                    href="/"
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
        </div>

        <div className={styles.bottom}>
          <p>
            ©{new Date().getFullYear()}. {f(site.footer.rights)}
          </p>
          <ul>
            <li>
              <Link href="/privacy">{t('privacy')}</Link>
            </li>
            <li>
              <Link href="/legal-notice">{t('legalNotice')}</Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
