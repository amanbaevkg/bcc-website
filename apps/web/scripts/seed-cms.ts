/**
 * Copies the site's current content (texts in 4 languages, photos, logos, testimonials,
 * hero videos) into the Sanity project, so editors start from the live website.
 *
 *   SANITY_API_WRITE_TOKEN=… pnpm --filter web seed:cms            # only creates what is missing
 *   SANITY_API_WRITE_TOKEN=… pnpm --filter web seed:cms --replace  # overwrites these documents
 *   pnpm --filter web seed:cms --dry-run                           # shows what would be written
 *
 * The token needs Editor rights. Create it at sanity.io/manage → API → Tokens, keep it in your
 * terminal session only, and delete it when the import is done. It is never stored in the repo.
 */
import { createReadStream } from 'node:fs';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { aboutFallback } from '../src/content/fallback/about';
import { homeFallback } from '../src/content/fallback/home';
import { servicesFallback } from '../src/content/fallback/services';
import { siteFallback } from '../src/content/site';
import type { ImageAsset, Link, Localized, RichLine } from '../src/content/types';
import en from '../messages/en.json';
import fr from '../messages/fr.json';
import de from '../messages/de.json';
import lu from '../messages/lu.json';

const PUBLIC = fileURLToPath(new URL('../public', import.meta.url));
const LANGS = ['en', 'fr', 'de', 'lu'] as const;

export type Uploader = {
  image(path: string): Promise<string>;
  file(path: string): Promise<string>;
};

type Doc = { _id: string; _type: string; [k: string]: unknown };

let keyCounter = 0;
const key = () => `k${(keyCounter++).toString(36).padStart(4, '0')}`;

/** Field-level translations in the shape of sanity-plugin-internationalized-array. */
function L(value: Localized | undefined, kind: 'string' | 'text' = 'string') {
  if (!value) return undefined;
  const type =
    kind === 'string' ? 'internationalizedArrayStringValue' : 'internationalizedArrayTextValue';
  return LANGS.filter((l) => value[l]).map((l) => ({ _key: l, _type: type, value: value[l] }));
}

function linesText(value: Localized<string[]>) {
  const out: Localized = { en: value.en.join('\n') };
  for (const l of ['fr', 'de', 'lu'] as const) if (value[l]) out[l] = value[l]!.join('\n');
  return L(out, 'text');
}

function blocks(runs: RichLine[keyof RichLine]) {
  if (!runs) return undefined;
  return [
    {
      _type: 'block',
      _key: key(),
      style: 'normal',
      markDefs: [],
      children: runs.map((r) =>
        typeof r === 'string'
          ? { _type: 'span', _key: key(), text: r, marks: [] }
          : { _type: 'span', _key: key(), text: r.strong, marks: ['strong'] },
      ),
    },
  ];
}

function richLine(value: RichLine) {
  const out: Record<string, unknown> = { _type: 'localizedBlock' };
  for (const l of LANGS) if (value[l]) out[l] = blocks(value[l]);
  return out;
}

const link = (value: Link) => ({ _type: 'link', label: L(value.label), href: value.href });
const line = (value: Localized) => ({ _type: 'localizedLine', _key: key(), text: L(value) });

async function img(up: Uploader, value: ImageAsset, withKey = false) {
  const assetId = await up.image(value.src);
  return {
    _type: 'imageWithAlt',
    ...(withKey && { _key: key() }),
    asset: { _type: 'reference', _ref: assetId },
    alt: L(value.alt),
    ...(value.hotspot && {
      hotspot: {
        _type: 'sanity.imageHotspot',
        x: value.hotspot.x,
        y: value.hotspot.y,
        width: 1,
        height: 1,
      },
    }),
  };
}

const ref = (id: string) => ({ _type: 'reference', _ref: id, _key: key() });

export async function buildDocuments(up: Uploader): Promise<Doc[]> {
  keyCounter = 0;
  const h = homeFallback;
  const docs: Doc[] = [];

  const messages = { en, fr, de, lu };
  docs.push({
    _id: 'siteSettings',
    _type: 'siteSettings',
    email: siteFallback.email,
    phone: siteFallback.phone.display,
    address: {
      street: siteFallback.address.street,
      postalCode: siteFallback.address.postalCode,
      city: siteFallback.address.city,
    },
    mapUrl: siteFallback.mapUrl,
    tagline: L({
      en: messages.en.Meta.tagline,
      fr: messages.fr.Meta.tagline,
      de: messages.de.Meta.tagline,
      lu: messages.lu.Meta.tagline,
    }),
    social: siteFallback.social.map((s) => ({
      _type: 'socialLink',
      _key: key(),
      network: s.network,
      url: s.url,
    })),
  });

  const clientIds: string[] = [];
  for (const [i, c] of h.trust.clients.entries()) {
    const id = `clientLogo-${basename(c.logo.src, '.png')}`;
    clientIds.push(id);
    docs.push({
      _id: id,
      _type: 'clientLogo',
      name: c.name,
      logo: { _type: 'image', asset: { _type: 'reference', _ref: await up.image(c.logo.src) } },
      active: true,
      order: (i + 1) * 10,
    });
  }

  const spaceIds: string[] = [];
  for (const [i, s] of h.spaces.items.entries()) {
    const id = `space-${basename(s.image.src)
      .replace(/\.\w+$/, '')
      .replace(/^space-/, '')}`;
    spaceIds.push(id);
    docs.push({
      _id: id,
      _type: 'space',
      image: await img(up, s.image),
      caption: L(s.caption),
      order: (i + 1) * 10,
    });
  }

  const testimonialIds: string[] = [];
  for (const [i, q] of h.testimonials.items.entries()) {
    const id = `testimonial-${q.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    testimonialIds.push(id);
    docs.push({
      _id: id,
      _type: 'testimonial',
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

  const video = Object.fromEntries(
    await Promise.all(
      h.hero.video.sources.map(async (s) => [
        `mp4_${s.height}`,
        { _type: 'file', asset: { _type: 'reference', _ref: await up.file(s.src) } },
      ]),
    ),
  );

  docs.push({
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: L(h.hero.eyebrow),
      title: L(h.hero.title),
      titleAccent: L(h.hero.titleAccent),
      subtitle: L(h.hero.subtitle),
      video: {
        ...video,
        poster: await img(up, { ...h.hero.video.poster, alt: { en: 'Business Center Capellen' } }),
      },
      workspaceTypes: h.hero.workspaceTypes.map((w) => ({
        _type: 'workspaceType',
        _key: key(),
        id: w.id,
        name: L(w.name),
        hasTeamSize: w.hasTeamSize,
      })),
      teamSizes: h.hero.teamSizes,
      cta: link(h.hero.cta),
      ring: link(h.hero.ring),
    },
    coworking: {
      title: L(h.coworking.title),
      href: h.coworking.href,
      body: richLine(h.coworking.body),
      images: await Promise.all(h.coworking.images.map((i) => img(up, i, true))),
    },
    privateOffices: {
      title: L(h.privateOffices.title),
      href: h.privateOffices.href,
      body: richLine(h.privateOffices.body),
      images: await Promise.all(h.privateOffices.images.map((i) => img(up, i, true))),
    },
    servicesLink: link(h.servicesLink),
    trust: { title: L(h.trust.title), clients: clientIds.map(ref) },
    tomorrow: {
      lines: linesText(h.tomorrow.lines),
      card: L(h.tomorrow.card, 'text'),
      image: await img(up, h.tomorrow.image),
    },
    spaces: {
      title: L(h.spaces.title),
      items: spaceIds.map(ref),
      moreLink: link(h.spaces.moreLink),
    },
    findMore: { title: L(h.findMore.title), cta: link(h.findMore.cta) },
    testimonials: { title: L(h.testimonials.title), items: testimonialIds.map(ref) },
    final: {
      lines: linesText(h.final.lines),
      cta: link(h.final.cta),
      image: await img(up, h.final.image),
    },
  });

  const a = aboutFallback;
  docs.push({
    _id: 'aboutPage',
    _type: 'aboutPage',
    hero: {
      eyebrow: L(a.hero.eyebrow),
      title: L(a.hero.title),
      titleAccent: L(a.hero.titleAccent),
      body: L(a.hero.body, 'text'),
      image: await img(up, a.hero.image),
    },
    highlights: a.highlights.map(line),
    location: L(a.location),
    audience: L(a.audience, 'text'),
    figures: a.figures.map((f) => ({
      _type: 'figure',
      _key: key(),
      value: f.value,
      label: L(f.label),
    })),
    features: await Promise.all(
      a.features.map(async (f) => ({
        _type: 'feature',
        _key: key(),
        title: L(f.title),
        body: L(f.body, 'text'),
        note: L(f.note, 'text'),
        image: await img(up, f.image),
        ...(f.cta && { cta: link(f.cta) }),
      })),
    ),
    visit: {
      eyebrow: L(a.visit.eyebrow),
      title: L(a.visit.title),
      cta: link(a.visit.cta),
      image: await img(up, a.visit.image),
    },
  });

  const s = servicesFallback;
  const cw = s.choose.coworking;
  const po = s.choose.privateOffices;
  docs.push({
    _id: 'servicesPage',
    _type: 'servicesPage',
    hero: { eyebrow: L(s.hero.eyebrow), title: L(s.hero.title), body: s.hero.body.map(line) },
    choose: {
      title: L(s.choose.title),
      coworking: {
        title: L(cw.title),
        kicker: L(cw.kicker),
        body: richLine(cw.body),
        packages: L(cw.packages),
        highlight: L(cw.highlight, 'text'),
        audience: L(cw.audience),
        cta: link(cw.cta),
        image: await img(up, cw.image),
      },
      privateOffices: {
        title: L(po.title),
        sizes: po.sizes,
        sizeNote: L(po.sizeNote),
        image: await img(up, po.image),
      },
    },
    offers: {
      title: L(s.offers.title),
      items: s.offers.items.map((o) => ({
        _type: 'offer',
        _key: key(),
        icon: o.icon,
        title: L(o.title),
        body: L(o.body, 'text'),
      })),
    },
    cta: { title: L(s.cta.title), link: link(s.cta.link) },
  });

  return docs;
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has('--dry-run');
  const replace = args.has('--replace');
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!dryRun && !token) {
    console.error(
      'Set SANITY_API_WRITE_TOKEN (Editor token from sanity.io/manage → API → Tokens).',
    );
    process.exit(1);
  }
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8bx4pgzw',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2026-09-01',
    token,
    useCdn: false,
  });

  const cache = new Map<string, Promise<string>>();
  const upload = (kind: 'image' | 'file') => (path: string) => {
    if (dryRun) return Promise.resolve(`${kind}-dry-run-${basename(path)}`);
    if (!cache.has(path)) {
      console.log(`  uploading ${path}`);
      cache.set(
        path,
        client.assets
          .upload(kind, createReadStream(join(PUBLIC, path)), { filename: basename(path) })
          .then((asset) => asset._id),
      );
    }
    return cache.get(path)!;
  };

  console.log(dryRun ? 'Dry run: nothing is uploaded or written.' : 'Uploading files…');
  const docs = await buildDocuments({ image: upload('image'), file: upload('file') });

  if (dryRun) {
    for (const d of docs) console.log(`  ${d._type.padEnd(14)} ${d._id}`);
    console.log(`${docs.length} documents would be ${replace ? 'written' : 'created if missing'}.`);
    return;
  }
  const tx = client.transaction();
  for (const d of docs) {
    if (replace) tx.createOrReplace(d);
    else tx.createIfNotExists(d);
  }
  await tx.commit();
  console.log(
    `Done: ${docs.length} documents ${replace ? 'written' : 'created where missing'} and published.`,
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
