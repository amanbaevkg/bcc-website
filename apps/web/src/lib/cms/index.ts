import 'server-only';
import { aboutFallback } from '@/content/fallback/about';
import { homeFallback } from '@/content/fallback/home';
import { servicesFallback } from '@/content/fallback/services';
import type { AboutPage, HomePage, ServicesPage } from '@/content/types';
import { routing, type Locale } from '@/i18n/routing';
import {
  compact,
  image,
  lines,
  link,
  localized,
  richLine,
  type SanityImage,
  type SanityLink,
  type SanityLocalized,
  type SanityLocalizedBlock,
} from './map';
import { sanityFetch } from './sanity';

/**
 * Content access for pages. Without a Sanity project (NEXT_PUBLIC_SANITY_PROJECT_ID),
 * everything comes from src/content/fallback. With one, each section uses the CMS data
 * when it is complete and the built-in content otherwise, so a half-filled CMS never
 * breaks the page.
 */

const IMG = '{ alt, hotspot, asset->{ url, metadata { dimensions } } }';

const homeQuery = `*[_id == "homePage"][0]{
  hero {
    eyebrow, title, titleAccent, subtitle, cta, ring, teamSizes,
    workspaceTypes[] { id, name, hasTeamSize },
    video {
      "mp4_1080": mp4_1080.asset->url,
      "mp4_720": mp4_720.asset->url,
      "mp4_480": mp4_480.asset->url,
      poster ${IMG}
    }
  },
  coworking { title, href, body, images[] ${IMG} },
  privateOffices { title, href, body, images[] ${IMG} },
  servicesLink,
  trust {
    title,
    "clients": select(
      count(clients) > 0 => clients[]->,
      *[_type == "clientLogo" && active != false] | order(order asc)
    ) { name, url, "logo": logo { asset->{ url, metadata { dimensions } } } }
  },
  tomorrow { lines, card, image ${IMG} },
  spaces {
    title, moreLink,
    "items": select(
      count(items) > 0 => items[]->,
      *[_type == "space"] | order(order asc)
    ) { caption, image ${IMG} }
  },
  findMore { title, cta },
  testimonials {
    title,
    "items": select(
      count(items) > 0 => items[]->,
      *[_type == "testimonial"] | order(order asc)
    ) { quote, quoteLanguage, name, role, company, rating }
  },
  final { lines, cta, image ${IMG} }
}`;

type Offer = {
  title?: SanityLocalized;
  href?: string;
  body?: SanityLocalizedBlock;
  images?: SanityImage[];
};

type HomeDoc = {
  hero?: {
    eyebrow?: SanityLocalized;
    title?: SanityLocalized;
    titleAccent?: SanityLocalized;
    subtitle?: SanityLocalized;
    cta?: SanityLink;
    ring?: SanityLink;
    teamSizes?: number[];
    workspaceTypes?: { id?: string; name?: SanityLocalized; hasTeamSize?: boolean }[];
    video?: { mp4_1080?: string; mp4_720?: string; mp4_480?: string; poster?: SanityImage };
  };
  coworking?: Offer;
  privateOffices?: Offer;
  servicesLink?: SanityLink;
  trust?: {
    title?: SanityLocalized;
    clients?: { name?: string; url?: string; logo?: SanityImage }[];
  };
  tomorrow?: { lines?: SanityLocalized[]; card?: SanityLocalized; image?: SanityImage };
  spaces?: {
    title?: SanityLocalized;
    moreLink?: SanityLink;
    items?: { caption?: SanityLocalized; image?: SanityImage }[];
  };
  findMore?: { title?: SanityLocalized; cta?: SanityLink };
  testimonials?: {
    title?: SanityLocalized;
    items?: {
      quote?: string;
      quoteLanguage?: string;
      name?: string;
      role?: SanityLocalized;
      company?: string;
      rating?: number;
    }[];
  };
  final?: { lines?: SanityLocalized[]; cta?: SanityLink; image?: SanityImage };
};

const isLocale = (v?: string): v is Locale => routing.locales.includes(v as Locale);

function offer(doc: Offer | undefined, fb: HomePage['coworking']): HomePage['coworking'] {
  const title = localized(doc?.title);
  const body = richLine(doc?.body);
  if (!title || !body) return fb;
  return {
    title,
    body,
    href: doc?.href ?? fb.href,
    images: compact((doc?.images ?? []).map(image)),
  };
}

export function mapHome(doc: HomeDoc | null): HomePage {
  const fb = homeFallback;
  if (!doc) return fb;
  const h = doc.hero;

  const heroVideo = (() => {
    const v = h?.video;
    const poster = image(v?.poster);
    const sources = compact([
      v?.mp4_1080
        ? { src: v.mp4_1080, height: 1080 as const, type: 'video/mp4' as const }
        : undefined,
      v?.mp4_720 ? { src: v.mp4_720, height: 720 as const, type: 'video/mp4' as const } : undefined,
      v?.mp4_480 ? { src: v.mp4_480, height: 480 as const, type: 'video/mp4' as const } : undefined,
    ]);
    return poster && sources.length ? { poster, sources } : fb.hero.video;
  })();

  const workspaceTypes = compact(
    (h?.workspaceTypes ?? []).map((w) => {
      const name = localized(w.name);
      return w.id && name ? { id: w.id, name, hasTeamSize: !!w.hasTeamSize } : undefined;
    }),
  );

  const clients = compact(
    (doc.trust?.clients ?? []).map((c) => {
      const logo = image(c.logo);
      return c.name && logo
        ? { name: c.name, url: c.url, logo: { ...logo, alt: { en: c.name } } }
        : undefined;
    }),
  );

  const spaces = compact(
    (doc.spaces?.items ?? []).map((s) => {
      const img = image(s.image);
      const caption = localized(s.caption);
      return img && caption ? { image: img, caption } : undefined;
    }),
  );

  const testimonials = compact(
    (doc.testimonials?.items ?? []).map((q) =>
      q.quote && q.name && q.company
        ? {
            quote: { en: q.quote },
            lang: isLocale(q.quoteLanguage) ? q.quoteLanguage : 'en',
            name: q.name,
            role: localized(q.role) ?? { en: '' },
            company: q.company,
            rating: Math.min(5, Math.max(1, Math.round(q.rating ?? 5))) as 1 | 2 | 3 | 4 | 5,
          }
        : undefined,
    ),
  );

  const title = localized(h?.title);
  const tomorrowLines = lines(doc.tomorrow?.lines);
  const tomorrowCard = localized(doc.tomorrow?.card);
  const tomorrowImage = image(doc.tomorrow?.image);
  const finalLines = lines(doc.final?.lines);
  const finalImage = image(doc.final?.image);
  const finalCta = link(doc.final?.cta);

  return {
    hero: {
      eyebrow: localized(h?.eyebrow) ?? fb.hero.eyebrow,
      title: title ?? fb.hero.title,
      // The accent belongs to the title it came with.
      titleAccent: title ? localized(h?.titleAccent) : fb.hero.titleAccent,
      subtitle: localized(h?.subtitle) ?? fb.hero.subtitle,
      video: heroVideo,
      workspaceTypes: workspaceTypes.length ? workspaceTypes : fb.hero.workspaceTypes,
      teamSizes: h?.teamSizes?.length ? h.teamSizes : fb.hero.teamSizes,
      cta: link(h?.cta) ?? fb.hero.cta,
      ring: link(h?.ring) ?? fb.hero.ring,
    },
    coworking: offer(doc.coworking, fb.coworking),
    privateOffices: offer(doc.privateOffices, fb.privateOffices),
    servicesLink: link(doc.servicesLink) ?? fb.servicesLink,
    trust: {
      title: localized(doc.trust?.title) ?? fb.trust.title,
      clients: clients.length ? clients : fb.trust.clients,
    },
    tomorrow:
      tomorrowLines && tomorrowCard && tomorrowImage
        ? { lines: tomorrowLines, card: tomorrowCard, image: tomorrowImage }
        : fb.tomorrow,
    spaces: {
      title: localized(doc.spaces?.title) ?? fb.spaces.title,
      moreLink: link(doc.spaces?.moreLink) ?? fb.spaces.moreLink,
      items: spaces.length ? spaces : fb.spaces.items,
    },
    findMore: {
      title: localized(doc.findMore?.title) ?? fb.findMore.title,
      cta: link(doc.findMore?.cta) ?? fb.findMore.cta,
    },
    testimonials: {
      title: localized(doc.testimonials?.title) ?? fb.testimonials.title,
      items: testimonials.length ? testimonials : fb.testimonials.items,
    },
    final:
      finalLines && finalImage && finalCta
        ? { lines: finalLines, image: finalImage, cta: finalCta }
        : fb.final,
  };
}

export async function getHomePage(): Promise<HomePage> {
  try {
    return mapHome(await sanityFetch<HomeDoc>(homeQuery));
  } catch (error) {
    // A CMS outage must not take the site down: log it and serve the built-in content.
    console.error('[cms] home page query failed, using fallback content', error);
    return homeFallback;
  }
}

/*
 * About and Services use the built-in content for now. Their CMS documents (the flexible "page"
 * builder from the plan) arrive with the About/Services editing stage; the pages already read
 * through these functions, so nothing else changes then.
 */
export async function getAboutPage(): Promise<AboutPage> {
  return aboutFallback;
}

export async function getServicesPage(): Promise<ServicesPage> {
  return servicesFallback;
}
