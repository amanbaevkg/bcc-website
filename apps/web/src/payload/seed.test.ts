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
        .filter(([k]) => !['src', 'width', 'height', 'hotspot', 'icon'].includes(k))
        .map(([k, v]) => [k, withoutSources(v)]),
    );
  }
  return value;
}

const read = (slug: string) =>
  payload.findGlobal({ slug: slug as never, locale: 'all', depth: 2, draft: false }) as never;

describe('admin first-start import', () => {
  it('creates the first administrator from the environment', async () => {
    const users = await payload.find({ collection: 'users', overrideAccess: true });
    expect(users.docs.map((u) => [u.email, (u as { role?: string }).role])).toEqual([
      ['admin@example.com', 'admin'],
    ]);
  });

  it('home page comes back unchanged', async () => {
    const mapped = mapHome(await read('home'));
    expect(withoutSources(mapped)).toEqual(withoutSources(homeFallback));
    expect(mapped.hero.video.sources.map((s) => s.height)).toEqual([1080, 720, 480]);
    expect(mapped.hero.video.poster.src).toMatch(/^\/api\/media\/file\//);
  });

  it('About Us, Our Services and Contact come back unchanged', async () => {
    expect(withoutSources(mapAbout(await read('about')))).toEqual(withoutSources(aboutFallback));
    const services = mapServices(await read('services'));
    expect(withoutSources(services)).toEqual(withoutSources(servicesFallback));
    const iconName = (src: string) => src.replace(/^.*\//, '').replace(/-\d+(?=\.svg$)/, '');
    expect(services.offers.items.map((o) => iconName(o.icon))).toEqual(
      servicesFallback.offers.items.map((o) => iconName(o.icon)),
    );
    expect(services.offers.items[0]?.icon).toMatch(/^\/api\/media\/file\//);
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
