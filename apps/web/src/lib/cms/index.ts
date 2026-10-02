import 'server-only';
import { homeFallback } from '@/content/fallback/home';
import type { HomePage } from '@/content/types';
import { routing, type Locale } from '@/i18n/routing';
import {
  compact,
  fileUrl,
  image,
  lines,
  link,
  localized,
  richLine,
  type CmsLink,
  type CmsLocalized,
  type CmsMedia,
  type CmsRichLine,
} from './map';
import { readGlobal } from './payload';

/**
 * Content access for pages. Everything comes from the admin (/admin, Payload); each section
 * uses the admin's content when it is complete and the built-in content otherwise, so a
 * half-filled page never breaks the site (and the site works before the first import).
 */

type Offer = {
  title?: CmsLocalized;
  href?: string | null;
  body?: CmsRichLine;
  images?: CmsMedia[] | null;
};

type HomeDoc = {
  hero?: {
    eyebrow?: CmsLocalized;
    title?: CmsLocalized;
    titleAccent?: CmsLocalized;
    subtitle?: CmsLocalized;
    cta?: CmsLink;
    ring?: CmsLink;
    teamSizes?: number[] | null;
    workspaceTypes?: { opens?: string | null; name?: CmsLocalized }[];
    video?: { mp4_1080?: CmsMedia; mp4_720?: CmsMedia; mp4_480?: CmsMedia; poster?: CmsMedia };
  };
  coworking?: Offer;
  privateOffices?: Offer;
  servicesLink?: CmsLink;
  trust?: {
    title?: CmsLocalized;
    clients?: { name?: string | null; url?: string | null; logo?: CmsMedia }[];
  };
  tomorrow?: { lines?: CmsLocalized; card?: CmsLocalized; image?: CmsMedia };
  spaces?: {
    title?: CmsLocalized;
    moreLink?: CmsLink;
    items?: { caption?: CmsLocalized; image?: CmsMedia }[];
  };
  findMore?: { title?: CmsLocalized; cta?: CmsLink };
  testimonials?: {
    title?: CmsLocalized;
    items?: {
      quote?: string | null;
      quoteLanguage?: string | null;
      name?: string | null;
      role?: CmsLocalized;
      company?: string | null;
      rating?: number | string | null;
    }[];
  };
  final?: { lines?: CmsLocalized; cta?: CmsLink; image?: CmsMedia };
};

const isLocale = (v?: string | null): v is Locale => routing.locales.includes(v as Locale);

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
    const src = (m: CmsMedia, height: 1080 | 720 | 480) => {
      const url = fileUrl(m);
      return url ? { src: url, height, type: 'video/mp4' as const } : undefined;
    };
    const sources = compact([src(v?.mp4_1080, 1080), src(v?.mp4_720, 720), src(v?.mp4_480, 480)]);
    return poster && sources.length ? { poster, sources } : fb.hero.video;
  })();

  // Each choice needs its own id in the menu; two choices may pre-select the same thing.
  const used = new Set<string>();
  const workspaceTypes = compact(
    (h?.workspaceTypes ?? []).map((w, i) => {
      const name = localized(w.name);
      if (!name) return undefined;
      const opens = w.opens || 'other';
      const id = used.has(opens) ? `${opens}-${i}` : opens;
      used.add(id);
      return { id, name, hasTeamSize: opens === 'private-office' };
    }),
  );

  const clients = compact(
    (doc.trust?.clients ?? []).map((c) => {
      const logo = image(c.logo);
      return c.name && logo
        ? { name: c.name, url: c.url ?? undefined, logo: { ...logo, alt: { en: c.name } } }
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
            rating: Math.min(5, Math.max(1, Math.round(Number(q.rating) || 5))) as
              1 | 2 | 3 | 4 | 5,
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
    return mapHome(await readGlobal<HomeDoc>('home'));
  } catch (error) {
    // A database problem must not take the site down: log it and serve the built-in content.
    console.error('[cms] home page query failed, using fallback content', error);
    return homeFallback;
  }
}

export { getAboutPage, getServicesPage } from './pages';
