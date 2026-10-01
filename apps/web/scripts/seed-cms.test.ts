import { describe, expect, it } from 'vitest';
import { aboutFallback } from '@/content/fallback/about';
import { contactFallback } from '@/content/fallback/contact';
import { homeFallback } from '@/content/fallback/home';
import { servicesFallback } from '@/content/fallback/services';
import { mapHome } from '@/lib/cms/index';
import { mapContact } from '@/lib/cms/contact';
import { mapAbout, mapServices } from '@/lib/cms/pages';
import { mapSite } from '@/lib/cms/site';
import { siteFallback } from '@/content/site';
import { buildDocuments } from './seed-cms';

/**
 * Round trip: the import script's documents, read back the way the site's GROQ queries shape
 * them, must give exactly the content the site shows today. Catches any field or language
 * lost between the site, the CMS schemas and the queries.
 */
async function roundTrip() {
  const assets = new Map<string, string>();
  const up = {
    image: async (src: string) => (assets.set(`img:${src}`, src), `img:${src}`),
    file: async (src: string) => (assets.set(`file:${src}`, src), `file:${src}`),
  };
  const docs = await buildDocuments(up);
  const byId = new Map(docs.map((d) => [d._id, d]));
  const dims = new Map<string, { width: number; height: number }>();
  const collect = (list: { src: string; width: number; height: number }[]) =>
    list.forEach((i) => dims.set(i.src, { width: i.width, height: i.height }));
  const h = homeFallback;
  collect([
    ...h.coworking.images,
    ...h.privateOffices.images,
    h.tomorrow.image,
    h.final.image,
    h.hero.video.poster,
    ...h.spaces.items.map((s) => s.image),
    ...h.trust.clients.map((c) => c.logo),
    aboutFallback.hero.image,
    aboutFallback.visit.image,
    ...aboutFallback.features.map((f) => f.image),
    servicesFallback.choose.coworking.image,
    servicesFallback.choose.privateOffices.image,
    ...contactFallback.gallery.photos,
  ]);

  // Mimics the GROQ projections: follow references, expand assets, flatten line objects.
  const shape = (v: unknown, keyName = ''): unknown => {
    if (Array.isArray(v)) {
      const arr = v.map((x) => shape(x));
      return arr.length &&
        arr.every(
          (x) => x && typeof x === 'object' && (x as { _type?: string })._type === 'localizedLine',
        )
        ? arr.map((x) => (x as { text: unknown }).text)
        : arr;
    }
    if (!v || typeof v !== 'object') return v;
    const o = v as Record<string, unknown>;
    if (o._type === 'reference') {
      const ref = String(o._ref);
      if (ref.startsWith('img:') || ref.startsWith('file:')) {
        const src = assets.get(ref)!;
        return { url: src, metadata: { dimensions: dims.get(src) } };
      }
      return shape(byId.get(ref));
    }
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(o)) out[k] = shape(val, k);
    if (keyName.startsWith('mp4_')) return (out.asset as { url: string }).url;
    return out;
  };
  return (id: string) => shape(byId.get(id)) as never;
}

describe('CMS import round trip', () => {
  it('home page comes back unchanged', async () => {
    const get = await roundTrip();
    const home = get('homePage') as { hero: { video: Record<string, unknown> } };
    const mapped = mapHome(home);
    expect(mapped).toEqual({
      ...homeFallback,
      hero: {
        ...homeFallback.hero,
        video: {
          ...homeFallback.hero.video,
          poster: { ...homeFallback.hero.video.poster, alt: { en: 'Business Center Capellen' } },
        },
      },
    });
  });

  it('About Us and Our Services come back unchanged', async () => {
    const get = await roundTrip();
    expect(mapAbout(get('aboutPage'))).toEqual(aboutFallback);
    expect(mapServices(get('servicesPage'))).toEqual(servicesFallback);
  });

  it('the contact gallery comes back unchanged, in order', async () => {
    const get = await roundTrip();
    const contact = mapContact(get('contactPage'));
    // Not the built-in object: the gallery really came through the CMS shape.
    expect(contact.gallery).not.toBe(contactFallback.gallery);
    expect(contact).toEqual(contactFallback);
  });

  it('site settings come back unchanged', async () => {
    const get = await roundTrip();
    const site = mapSite(get('siteSettings'));
    expect({ ...site, tagline: undefined }).toEqual({
      ...siteFallback,
      social: [...siteFallback.social],
      tagline: undefined,
    });
    expect(site.tagline?.lu).toBeTruthy();
  });
});
