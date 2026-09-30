import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import { pick, type HomePage, type Offer } from '@/content/types';
import { Icon } from '@/components/ui/Icon';
import { Photo } from '@/components/ui/Photo';
import { RichText } from './RichText';
import styles from './Offers.module.css';

function OfferText({ offer, locale }: { offer: Offer; locale: Locale }) {
  return (
    <>
      <h2 className={`xl ${styles.title}`}>
        <Link href={offer.href}>
          {pick(offer.title, locale)}
          <Icon name="arrowUpRight" className={styles.titleArrow} />
        </Link>
      </h2>
      <p className={styles.body}>
        <RichText runs={pick(offer.body, locale)} />
      </p>
    </>
  );
}

/** Co-Working: large photo bleeding off the left edge, text card overlapping it, second photo below. */
export function Coworking({ offer, locale }: { offer: Offer; locale: Locale }) {
  const [main, second] = offer.images;
  return (
    <section className={styles.cowork}>
      <div className={`wrap ${styles.cwGrid}`} data-images={offer.images.length}>
        {main && (
          <Photo
            image={main}
            locale={locale}
            className={styles.cwImg}
            sizes="(width < 900px) 100vw, 60vw"
          />
        )}
        <div className={styles.cwText}>
          <OfferText offer={offer} locale={locale} />
        </div>
        {second && (
          <Photo
            image={second}
            locale={locale}
            className={styles.cwSecond}
            sizes="(width < 900px) 100vw, 35vw"
          />
        )}
      </div>
    </section>
  );
}

/** Private Offices: navy chapter with a tall photo bleeding off the right and a detail photo overlapping. */
export function PrivateOffices({
  offer,
  servicesLink,
  locale,
}: {
  offer: Offer;
  servicesLink: HomePage['servicesLink'];
  locale: Locale;
}) {
  const [main, detail] = offer.images;
  return (
    <section className={styles.private}>
      <div className="wrap">
        <div className={styles.pvGrid} data-images={offer.images.length}>
          <div className={styles.pvText}>
            <OfferText offer={offer} locale={locale} />
          </div>
          {main && (
            <Photo
              image={main}
              locale={locale}
              className={styles.pvImg}
              sizes="(width < 900px) 100vw, 45vw"
            />
          )}
          {detail && (
            <Photo image={detail} locale={locale} className={styles.pvDetail} sizes="340px" />
          )}
        </div>

        <div className={styles.servicesRow}>
          <Link href={servicesLink.href}>
            <span className={`xl ${styles.big}`}>{pick(servicesLink.label, locale)}</span>
            <span className={styles.circle} aria-hidden="true">
              <Icon name="arrowUpRight" width={24} height={24} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
