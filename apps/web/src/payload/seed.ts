import fs from 'node:fs';
import path from 'node:path';
import type { Payload } from 'payload';
import { aboutFallback } from '@/content/fallback/about';
import { contactFallback } from '@/content/fallback/contact';
import { homeFallback } from '@/content/fallback/home';
import { servicesFallback } from '@/content/fallback/services';
import { siteFallback } from '@/content/site';
import type { ImageAsset, Link, Localized, RichLine } from '@/content/types';
import en from '../../messages/en.json';
import fr from '../../messages/fr.json';
import de from '../../messages/de.json';
import lu from '../../messages/lu.json';
import { paragraphs } from './lexical';

/*
 * First-start content: copies the site's built-in texts (4 languages), photos, logos,
 * testimonials and hero videos into the admin, so editors start from the current website.
 * Runs once, when the Home page is still empty (see bootstrap.ts).
 */

const LOCALES = ['en', 'fr', 'de', 'lu'] as const;
type Loc = (typeof LOCALES)[number];

/** A value that differs per language. */
class PerLocale {
  constructor(readonly values: Partial<Record<Loc, unknown>>) {}
}
const L = (v: Localized | undefined) => (v ? new PerLocale(v) : undefined);
const lines = (v: Localized<string[]>) =>
  new PerLocale(Object.fromEntries(Object.entries(v).map(([k, l]) => [k, l.join('\n')])));
const bold = (v: RichLine) =>
  new PerLocale(Object.fromEntries(Object.entries(v).map(([k, runs]) => [k, paragraphs(runs)])));
const link = (v: Link) => ({ label: L(v.label), href: v.href });

/** The tree as written for one language: per-language values resolved, the rest unchanged. */
function forLocale(tree: unknown, loc: Loc): unknown {
  if (tree instanceof PerLocale) return tree.values[loc];
  if (Array.isArray(tree)) return tree.map((t) => forLocale(t, loc));
  if (tree && typeof tree === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(tree)) {
      const r = forLocale(v, loc);
      if (r !== undefined) out[k] = r;
    }
    return out;
  }
  return tree;
}

/** Array rows carry fixed ids so every language writes into the same rows. */
let rowCounter = 0;
const row = <T extends object>(data: T) => ({
  id: `seed${(rowCounter++).toString(36).padStart(5, '0')}`,
  ...data,
});

function publicDir() {
  const candidates = [
    path.resolve(process.cwd(), 'public'),
    path.resolve(process.cwd(), 'apps/web/public'),
  ];
  const found = candidates.find((d) => fs.existsSync(path.join(d, 'images')));
  if (!found) throw new Error('seed: public/ folder not found');
  return found;
}

export async function seedContent(payload: Payload) {
  rowCounter = 0;
  const pub = publicDir();
  const uploaded = new Map<string, number | string>();

  // One upload per file and description: the same photo can carry different alt texts.
  async function upload(src: string, alt?: Localized) {
    const key = `${src}|${JSON.stringify(alt ?? {})}`;
    const cached = uploaded.get(key);
    if (cached) return cached;
    const filePath = path.join(pub, src.replace(/^\//, ''));
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt?.en ?? '' },
      filePath,
      locale: 'en',
    });
    for (const loc of LOCALES.slice(1)) {
      if (alt?.[loc])
        await payload.update({
          collection: 'media',
          id: doc.id,
          data: { alt: alt[loc] },
          locale: loc,
          fallbackLocale: false as never,
        });
    }
    uploaded.set(key, doc.id);
    return doc.id;
  }
  const img = (i: ImageAsset) => upload(i.src, i.alt);

  async function writeGlobal(slug: string, tree: object, drafts = true) {
    for (const loc of LOCALES) {
      const data = forLocale(tree, loc) as Record<string, unknown>;
      await payload.updateGlobal({
        slug: slug as never,
        data: (drafts ? { ...data, _status: 'published' } : data) as never,
        locale: loc,
        // Untranslated texts stay empty (they show English on the site) instead of copying it.
        fallbackLocale: false as never,
      });
    }
  }

  async function createDoc(collection: string, tree: object) {
    const first = forLocale(tree, 'en') as Record<string, unknown>;
    const doc = (await payload.create({
      collection: collection as never,
      data: first as never,
      locale: 'en',
    })) as { id: number | string };
    for (const loc of LOCALES.slice(1)) {
      await payload.update({
        collection: collection as never,
        id: doc.id,
        data: forLocale(tree, loc) as never,
        locale: loc,
        fallbackLocale: false as never,
      });
    }
  }

  const h = homeFallback;

  // Lists
  for (const [i, c] of h.trust.clients.entries()) {
    await createDoc('client-logos', {
      name: c.name,
      logo: await upload(c.logo.src, { en: c.name }),
      url: c.url,
      active: true,
      order: (i + 1) * 10,
    });
  }
  for (const [i, s] of h.spaces.items.entries()) {
    await createDoc('spaces', {
      title: s.caption.en,
      image: await img(s.image),
      caption: L(s.caption),
      order: (i + 1) * 10,
    });
  }
  for (const [i, q] of h.testimonials.items.entries()) {
    await createDoc('testimonials', {
      quote: q.quote.en,
      quoteLanguage: q.lang ?? 'en',
      name: q.name,
      role: L(q.role),
      company: q.company,
      rating: q.rating,
      consent: true,
      order: (i + 1) * 10,
    });
  }

  // Home page
  const video: Record<string, unknown> = { poster: await img(h.hero.video.poster) };
  for (const s of h.hero.video.sources) video[`mp4_${s.height}`] = await upload(s.src);
  const offer = async (o: typeof h.coworking) => ({
    title: L(o.title),
    href: o.href,
    body: bold(o.body),
    images: await Promise.all(o.images.map(img)),
  });
  await writeGlobal('home', {
    hero: {
      eyebrow: L(h.hero.eyebrow),
      title: L(h.hero.title),
      titleAccent: L(h.hero.titleAccent),
      subtitle: L(h.hero.subtitle),
      video,
      workspaceTypes: h.hero.workspaceTypes.map((w) =>
        row({ code: w.id, name: L(w.name), hasTeamSize: w.hasTeamSize }),
      ),
      teamSizes: h.hero.teamSizes,
      cta: link(h.hero.cta),
      ring: link(h.hero.ring),
    },
    coworking: await offer(h.coworking),
    privateOffices: await offer(h.privateOffices),
    servicesLink: link(h.servicesLink),
    trust: { title: L(h.trust.title) },
    spaces: { title: L(h.spaces.title), moreLink: link(h.spaces.moreLink) },
    tomorrow: {
      lines: lines(h.tomorrow.lines),
      card: L(h.tomorrow.card),
      image: await img(h.tomorrow.image),
    },
    findMore: { title: L(h.findMore.title), cta: link(h.findMore.cta) },
    testimonials: { title: L(h.testimonials.title) },
    final: { lines: lines(h.final.lines), cta: link(h.final.cta), image: await img(h.final.image) },
  });

  // About Us
  const a = aboutFallback;
  await writeGlobal('about', {
    hero: {
      eyebrow: L(a.hero.eyebrow),
      title: L(a.hero.title),
      titleAccent: L(a.hero.titleAccent),
      body: L(a.hero.body),
      image: await img(a.hero.image),
    },
    highlights: a.highlights.map((t) => row({ text: L(t) })),
    location: L(a.location),
    audience: L(a.audience),
    figures: a.figures.map((f) => row({ value: f.value, label: L(f.label) })),
    features: await Promise.all(
      a.features.map(async (f) =>
        row({
          title: L(f.title),
          body: L(f.body),
          note: L(f.note),
          image: await img(f.image),
          cta: f.cta ? link(f.cta) : undefined,
        }),
      ),
    ),
    visit: {
      eyebrow: L(a.visit.eyebrow),
      title: L(a.visit.title),
      cta: link(a.visit.cta),
      image: await img(a.visit.image),
    },
  });

  // Our Services
  const s = servicesFallback;
  await writeGlobal('services', {
    hero: {
      eyebrow: L(s.hero.eyebrow),
      title: L(s.hero.title),
      body: s.hero.body.map((t) => row({ text: L(t) })),
    },
    choose: {
      title: L(s.choose.title),
      coworking: {
        title: L(s.choose.coworking.title),
        kicker: L(s.choose.coworking.kicker),
        body: bold(s.choose.coworking.body),
        packages: L(s.choose.coworking.packages),
        highlight: L(s.choose.coworking.highlight),
        audience: L(s.choose.coworking.audience),
        cta: link(s.choose.coworking.cta),
        image: await img(s.choose.coworking.image),
      },
      privateOffices: {
        title: L(s.choose.privateOffices.title),
        sizes: s.choose.privateOffices.sizes,
        sizeNote: L(s.choose.privateOffices.sizeNote),
        image: await img(s.choose.privateOffices.image),
      },
    },
    offers: {
      title: L(s.offers.title),
      items: s.offers.items.map((o) => row({ icon: o.icon, title: L(o.title), body: L(o.body) })),
    },
    cta: { title: L(s.cta.title), link: link(s.cta.link) },
  });

  // Contact page gallery
  await writeGlobal('contact', {
    gallery: {
      title: L(contactFallback.gallery.title),
      photos: await Promise.all(contactFallback.gallery.photos.map(img)),
    },
  });

  // Site settings
  const messages = { en, fr, de, lu };
  await writeGlobal(
    'site-settings',
    {
      email: siteFallback.email,
      phone: siteFallback.phone.display,
      address: {
        street: siteFallback.address.street,
        postalCode: siteFallback.address.postalCode,
        city: siteFallback.address.city,
      },
      mapUrl: siteFallback.mapUrl,
      tagline: new PerLocale(Object.fromEntries(LOCALES.map((l) => [l, messages[l].Meta.tagline]))),
      social: siteFallback.social.map((x) => row({ network: x.network, url: x.url })),
    },
    false,
  );
}
