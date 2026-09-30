import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pick, type HomePage } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { Finder } from './Finder';
import { HeroVideo } from './HeroVideo';
import styles from './Hero.module.css';

/** Splits the title so the accent word can be set in italic serif. */
function Title({ title, accent }: { title: string; accent?: string }) {
  const i = accent ? title.lastIndexOf(accent) : -1;
  if (!accent || i < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, i)}
      <em className="serif-accent">{accent}</em>
      {title.slice(i + accent.length)}
    </>
  );
}

export function Hero({ hero, locale }: { hero: HomePage['hero']; locale: Locale }) {
  const t = useTranslations('Home');
  const ring = t('ringText');
  return (
    <section className={styles.hero} data-header-overlay>
      <Image
        className={styles.poster}
        src={hero.video.poster.src}
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <HeroVideo video={hero.video} />
      <div className={styles.shade} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.center}>
          <span className={`label ${styles.eyebrow}`}>{pick(hero.eyebrow, locale)}</span>
          <h1 className={`xl ${styles.title}`}>
            <Title
              title={pick(hero.title, locale)}
              accent={hero.titleAccent && pick(hero.titleAccent, locale)}
            />
          </h1>
          <p className={styles.subtitle}>{pick(hero.subtitle, locale)}</p>
          <Finder hero={hero} />
        </div>
        <span className={styles.cue} aria-hidden="true" />
        <Link
          href={hero.ring.href}
          className={styles.ring}
          aria-label={pick(hero.ring.label, locale)}
        >
          <svg className={styles.ringText} viewBox="0 0 132 132" aria-hidden="true">
            <defs>
              <path id="hero-ring-path" d="M66 66m-50 0a50 50 0 1 1 100 0a50 50 0 1 1-100 0" />
            </defs>
            <text>
              <textPath href="#hero-ring-path" textLength="312" lengthAdjust="spacing">
                {`${ring} · ${ring} · `}
              </textPath>
            </text>
          </svg>
          <Icon name="arrowUpRight" width={26} height={26} />
        </Link>
      </div>
    </section>
  );
}
