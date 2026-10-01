import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { aboutFallback } from '@/content/fallback/about';
import { contactFallback } from '@/content/fallback/contact';
import { homeFallback } from '@/content/fallback/home';
import { servicesFallback } from '@/content/fallback/services';
import { siteFallback } from '@/content/site';
import { mapContact } from '@/lib/cms/contact';
import { mapHome } from '@/lib/cms/index';
import { mapAbout, mapServices } from '@/lib/cms/pages';
import { mapSite } from '@/lib/cms/site';

/**
 * Round trip: start the admin on an empty database, let the first-start import run, read the
 * content back the way the site does and map it. It must give exactly the content the site shows
 * today, in all four languages; only photo addresses change (they now point to the uploads).
 */
let payload: Payload;
let dir: string;

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bcc-admin-'));
  process.env.DATABASE_URL = `file:${path.join(dir, 'test.db')}`;
  process.env.PAYLOAD_MEDIA_DIR = path.join(dir, 'media');
  process.env.PAYLOAD_SECRET = 'test-secret-test-secret-test-secret-00';
  process.env.PAYLOAD_ADMIN_EMAIL = 'admin@example.com';
  process.env.PAYLOAD_ADMIN_PASSWORD = 'Test-password-123';
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ]);
  payload = await getPayload({ config });
});

afterAll(async () => {
  await payload?.destroy();
  fs.rmSync(dir, { recursive: true, force: true });
});

/** Photo addresses differ (uploads instead of /images/…); everything else must match. */
function withoutSources(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(withoutSources);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !['src', 'width', 'height', 'hotspot'].includes(k))
        .map(([k, v]) => [k, withoutSources(v)]),
    );
  }
  return value;
}

const read = (slug: string) =>
  payload.findGlobal({ slug: slug as never, locale: 'all', depth: 2, draft: false }) as never;
const list = async (collection: string) =>
  (
    await payload.find({
      collection: collection as never,
      locale: 'all',
      depth: 1,
      sort: 'order',
      pagination: false,
    })
  ).docs;

describe('admin first-start import', () => {
  it('creates the first administrator from the environment', async () => {
    const users = await payload.find({ collection: 'users', overrideAccess: true });
    expect(users.docs.map((u) => [u.email, (u as { role?: string }).role])).toEqual([
      ['admin@example.com', 'admin'],
    ]);
  });

  it('home page comes back unchanged', async () => {
    const home = (await read('home')) as Record<string, Record<string, unknown>>;
    const mapped = mapHome({
      ...home,
      trust: { ...home.trust, clients: await list('client-logos') },
      spaces: { ...home.spaces, items: await list('spaces') },
      testimonials: { ...home.testimonials, items: await list('testimonials') },
    } as never);
    expect(withoutSources(mapped)).toEqual(withoutSources(homeFallback));
    expect(mapped.hero.video.sources.map((s) => s.height)).toEqual([1080, 720, 480]);
    expect(mapped.hero.video.poster.src).toMatch(/^\/api\/media\/file\//);
  });

  it('About Us, Our Services and Contact come back unchanged', async () => {
    expect(withoutSources(mapAbout(await read('about')))).toEqual(withoutSources(aboutFallback));
    expect(withoutSources(mapServices(await read('services')))).toEqual(
      withoutSources(servicesFallback),
    );
    const contact = mapContact(await read('contact'));
    expect(contact.gallery).not.toBe(contactFallback.gallery);
    expect(withoutSources(contact)).toEqual(withoutSources(contactFallback));
  });

  it('site settings come back unchanged', async () => {
    const site = mapSite(await read('site-settings'));
    expect({ ...site, tagline: undefined }).toEqual({
      ...siteFallback,
      social: [...siteFallback.social],
      tagline: undefined,
    });
    expect(site.tagline?.lu).toBeTruthy();
  });
});
