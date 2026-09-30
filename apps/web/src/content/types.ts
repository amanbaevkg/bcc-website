/**
 * Content types shared by the fallback content and the Sanity queries.
 * They mirror the CMS schemas in apps/studio, so a section never knows where its data came from.
 *
 * Short texts are localized per field (EN/FR/DE/LU side by side, as in the CMS);
 * a missing translation falls back to English.
 */
import type { Locale } from '@/i18n/routing';

export type Localized<T = string> = { en: T } & Partial<Record<Exclude<Locale, 'en'>, T>>;

export function pick<T>(value: Localized<T>, locale: Locale): T {
  return value[locale] ?? value.en;
}

export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: Localized;
  /** Focal point, 0–1 from the top-left. Keeps the subject in frame when a slot crops the photo. */
  hotspot?: { x: number; y: number };
};

export type VideoAsset = {
  /** Largest first. The player picks by screen width: ≥1200 → 1080p, ≥600 → 720p, else 480p. */
  sources: { src: string; height: 1080 | 720 | 480; type: 'video/mp4' | 'video/webm' }[];
  poster: ImageAsset;
};

/** Internal paths are written without the language prefix ("/contact"); the site adds it. */
export type Link = { label: Localized; href: string };

/** Rich-ish text for short paragraphs: plain strings and bold runs only. */
export type TextRun = string | { strong: string };
export type RichLine = Localized<TextRun[]>;

export type WorkspaceType = {
  id: string;
  name: Localized;
  /** Whether the "team size" field applies (only private offices are sized by team). */
  hasTeamSize: boolean;
};

export type Offer = {
  title: Localized;
  href: string;
  body: RichLine;
  images: ImageAsset[];
};

export type ClientLogo = { name: string; logo: ImageAsset; url?: string };

export type Space = { image: ImageAsset; caption: Localized };

export type Testimonial = {
  /** Shown word for word; `lang` is the language it was written in. */
  quote: Localized;
  lang?: Locale;
  name: string;
  role: Localized;
  company: string;
  rating: 1 | 2 | 3 | 4 | 5;
};

export type HomePage = {
  hero: {
    eyebrow: Localized;
    title: Localized;
    /** The part of the title set in italic serif, e.g. "Capellen". Must appear in the title. */
    titleAccent?: Localized;
    subtitle: Localized;
    video: VideoAsset;
    workspaceTypes: WorkspaceType[];
    teamSizes: number[];
    cta: Link;
    ring: Link;
  };
  coworking: Offer;
  privateOffices: Offer;
  servicesLink: Link;
  trust: { title: Localized; clients: ClientLogo[] };
  tomorrow: { lines: Localized<string[]>; card: Localized; image: ImageAsset };
  spaces: { title: Localized; items: Space[]; moreLink: Link };
  findMore: { title: Localized; cta: Link };
  testimonials: { title: Localized; items: Testimonial[] };
  final: { lines: Localized<string[]>; cta: Link; image: ImageAsset };
};

export type AboutPage = {
  hero: {
    eyebrow: Localized;
    title: Localized;
    titleAccent?: Localized;
    body: Localized;
    image: ImageAsset;
  };
  highlights: Localized[];
  location: Localized;
  audience: Localized;
  figures: { value: string; label: Localized }[];
  features: {
    title: Localized;
    body: Localized;
    note?: Localized;
    image: ImageAsset;
    cta?: Link;
  }[];
  visit: { eyebrow: Localized; title: Localized; cta: Link; image: ImageAsset };
};

export type ServiceIcon =
  | 'wifi'
  | 'reception'
  | 'meeting'
  | 'kitchen'
  | 'supplies'
  | 'parking'
  | 'cloud'
  | 'mail'
  | 'handshake'
  | 'more';

export type ServicesPage = {
  hero: { eyebrow: Localized; title: Localized; body: Localized[] };
  choose: {
    title: Localized;
    coworking: {
      title: Localized;
      kicker: Localized;
      body: RichLine;
      packages: Localized;
      highlight: Localized;
      audience: Localized;
      cta: Link;
      image: ImageAsset;
    };
    privateOffices: {
      title: Localized;
      sizes: number[];
      sizeNote: Localized;
      image: ImageAsset;
    };
  };
  offers: { title: Localized; items: { icon: ServiceIcon; title: Localized; body: Localized }[] };
  cta: { title: Localized; link: Link };
};

/** A Portable Text block from the CMS (rendered as React elements, never as raw HTML). */
export type RichBlock = { _type: string; _key?: string; [key: string]: unknown };

export type NewsSummary = {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  excerpt: string;
  cover?: ImageAsset;
  /** Language of this version; differs from the page language when no translation exists yet. */
  lang: Locale;
  /** Test data, shown only outside production. */
  fixture?: boolean;
};

export type NewsPost = NewsSummary & { body: RichBlock[]; author?: string };
