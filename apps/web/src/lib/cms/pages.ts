import 'server-only';
import { aboutFallback } from '@/content/fallback/about';
import { servicesFallback } from '@/content/fallback/services';
import type { AboutPage, ServiceIcon, ServicesPage } from '@/content/types';
import {
  compact,
  image,
  link,
  localized,
  localizedList,
  richLine,
  type CmsLink,
  type CmsLocalized,
  type CmsMedia,
  type CmsRichLine,
} from './map';
import { readGlobal } from './payload';

/*
 * About Us and Our Services from the admin. As on the home page, each part uses the
 * admin's content when it is complete and the built-in content otherwise.
 */

type AboutDoc = {
  hero?: {
    eyebrow?: CmsLocalized;
    title?: CmsLocalized;
    titleAccent?: CmsLocalized;
    body?: CmsLocalized;
    image?: CmsMedia;
  };
  highlights?: { text?: CmsLocalized }[];
  location?: CmsLocalized;
  audience?: CmsLocalized;
  figures?: { value?: string | null; label?: CmsLocalized }[];
  features?: {
    title?: CmsLocalized;
    body?: CmsLocalized;
    note?: CmsLocalized;
    image?: CmsMedia;
    cta?: CmsLink;
  }[];
  visit?: {
    eyebrow?: CmsLocalized;
    title?: CmsLocalized;
    cta?: CmsLink;
    image?: CmsMedia;
  };
};

export function mapAbout(doc: AboutDoc | null): AboutPage {
  const fb = aboutFallback;
  if (!doc) return fb;
  const h = doc.hero;
  const title = localized(h?.title);
  const heroImage = image(h?.image);
  const figures = compact(
    (doc.figures ?? []).map((f) => {
      const label = localized(f.label);
      return f.value && label ? { value: f.value, label } : undefined;
    }),
  );
  const features = compact(
    (doc.features ?? []).map((f) => {
      const t = localized(f.title);
      const body = localized(f.body);
      const img = image(f.image);
      return t && body && img
        ? { title: t, body, image: img, note: localized(f.note), cta: link(f.cta) }
        : undefined;
    }),
  );
  const highlights = localizedList(doc.highlights);
  const v = doc.visit;
  const visitTitle = localized(v?.title);
  const visitImage = image(v?.image);
  const visitCta = link(v?.cta);

  return {
    hero:
      title && localized(h?.body) && heroImage
        ? {
            eyebrow: localized(h?.eyebrow) ?? fb.hero.eyebrow,
            title,
            titleAccent: localized(h?.titleAccent),
            body: localized(h?.body)!,
            image: heroImage,
          }
        : fb.hero,
    highlights: highlights.length ? highlights : fb.highlights,
    location: localized(doc.location) ?? fb.location,
    audience: localized(doc.audience) ?? fb.audience,
    figures: figures.length ? figures : fb.figures,
    features: features.length ? features : fb.features,
    visit:
      visitTitle && visitImage && visitCta
        ? {
            eyebrow: localized(v?.eyebrow) ?? fb.visit.eyebrow,
            title: visitTitle,
            cta: visitCta,
            image: visitImage,
          }
        : fb.visit,
  };
}

type ServicesDoc = {
  hero?: { eyebrow?: CmsLocalized; title?: CmsLocalized; body?: { text?: CmsLocalized }[] };
  choose?: {
    title?: CmsLocalized;
    coworking?: {
      title?: CmsLocalized;
      kicker?: CmsLocalized;
      body?: CmsRichLine;
      packages?: CmsLocalized;
      highlight?: CmsLocalized;
      audience?: CmsLocalized;
      cta?: CmsLink;
      image?: CmsMedia;
    };
    privateOffices?: {
      title?: CmsLocalized;
      sizes?: number[] | null;
      sizeNote?: CmsLocalized;
      image?: CmsMedia;
    };
  };
  offers?: {
    title?: CmsLocalized;
    items?: { icon?: string | null; title?: CmsLocalized; body?: CmsLocalized }[];
  };
  cta?: { title?: CmsLocalized; link?: CmsLink };
};

const icons: ServiceIcon[] = [
  'wifi',
  'reception',
  'meeting',
  'kitchen',
  'supplies',
  'parking',
  'cloud',
  'mail',
  'handshake',
  'more',
];

export function mapServices(doc: ServicesDoc | null): ServicesPage {
  const fb = servicesFallback;
  if (!doc) return fb;
  const hero = doc.hero;
  const heroTitle = localized(hero?.title);
  const cw = doc.choose?.coworking;
  const cwTitle = localized(cw?.title);
  const cwBody = richLine(cw?.body);
  const cwImage = image(cw?.image);
  const cwCta = link(cw?.cta);
  const po = doc.choose?.privateOffices;
  const poTitle = localized(po?.title);
  const sizes = (po?.sizes ?? []).filter((n) => Number.isInteger(n) && n > 0);
  const items = compact(
    (doc.offers?.items ?? []).map((o) => {
      const t = localized(o.title);
      const body = localized(o.body);
      const icon = icons.find((i) => i === o.icon);
      return t && body && icon ? { icon, title: t, body } : undefined;
    }),
  );
  const ctaTitle = localized(doc.cta?.title);
  const ctaLink = link(doc.cta?.link);

  return {
    hero: heroTitle
      ? {
          eyebrow: localized(hero?.eyebrow) ?? fb.hero.eyebrow,
          title: heroTitle,
          body: localizedList(hero?.body).length ? localizedList(hero?.body) : fb.hero.body,
        }
      : fb.hero,
    choose: {
      title: localized(doc.choose?.title) ?? fb.choose.title,
      coworking:
        cwTitle && cwBody && cwImage && cwCta
          ? {
              title: cwTitle,
              kicker: localized(cw?.kicker) ?? fb.choose.coworking.kicker,
              body: cwBody,
              packages: localized(cw?.packages) ?? fb.choose.coworking.packages,
              highlight: localized(cw?.highlight) ?? fb.choose.coworking.highlight,
              audience: localized(cw?.audience) ?? fb.choose.coworking.audience,
              cta: cwCta,
              image: cwImage,
            }
          : fb.choose.coworking,
      privateOffices:
        poTitle && sizes.length
          ? {
              title: poTitle,
              sizes,
              sizeNote: localized(po?.sizeNote) ?? fb.choose.privateOffices.sizeNote,
              image: image(po?.image) ?? fb.choose.privateOffices.image,
            }
          : fb.choose.privateOffices,
    },
    offers: {
      title: localized(doc.offers?.title) ?? fb.offers.title,
      items: items.length ? items : fb.offers.items,
    },
    cta: ctaTitle && ctaLink ? { title: ctaTitle, link: ctaLink } : fb.cta,
  };
}

export async function getAboutPage(): Promise<AboutPage> {
  try {
    return mapAbout(await readGlobal<AboutDoc>('about'));
  } catch (error) {
    console.error('[cms] about page query failed, using fallback content', error);
    return aboutFallback;
  }
}

export async function getServicesPage(): Promise<ServicesPage> {
  try {
    return mapServices(await readGlobal<ServicesDoc>('services'));
  } catch (error) {
    console.error('[cms] services page query failed, using fallback content', error);
    return servicesFallback;
  }
}
