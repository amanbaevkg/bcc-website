import type { Payload } from 'payload';
import { refreshSite } from './revalidate';
import { seedContent } from './seed';

/** Shared through globalThis: the server's start-up code and its pages load separate module copies. */
export const importing: { active: boolean } = ((
  globalThis as Record<string, unknown>
).__bccImport ??= { active: false }) as { active: boolean };

/**
 * Runs when Payload starts.
 * 1. No account yet: create the first admin from PAYLOAD_ADMIN_EMAIL / PAYLOAD_ADMIN_PASSWORD,
 *    so the public "create first user" page never appears on a live server.
 * 2. Empty Home page: copy the site's current content into the admin (seed.ts).
 *    PAYLOAD_SEED=false turns this off.
 */
export async function bootstrap(payload: Payload) {
  const users = await payload.count({ collection: 'users', overrideAccess: true });
  if (users.totalDocs === 0) {
    const email = process.env.PAYLOAD_ADMIN_EMAIL;
    const password = process.env.PAYLOAD_ADMIN_PASSWORD;
    if (email && password) {
      await payload.create({
        collection: 'users',
        data: { email, password, role: 'admin', name: 'Administrator' },
        overrideAccess: true,
      });
      payload.logger.info(`[admin] first administrator created: ${email}`);
    } else if (process.env.NODE_ENV === 'production') {
      payload.logger.error(
        '[admin] No user exists and PAYLOAD_ADMIN_EMAIL / PAYLOAD_ADMIN_PASSWORD are not set: ' +
          'set them and restart, otherwise anyone could create the first account at /admin.',
      );
      // The running server refuses to start; `next build` (pages read content) only warns.
      if (process.env.NEXT_PHASE !== 'phase-production-build') process.exit(1);
    }
  }

  if (process.env.PAYLOAD_SEED === 'false') return;
  const home = (await payload.findGlobal({ slug: 'home', locale: 'en', overrideAccess: true })) as {
    hero?: { title?: string };
  };
  if (home?.hero?.title) return;
  payload.logger.info('[admin] empty content: importing the current website texts and photos…');
  // While the import runs, pages show the built-in content and cache nothing (lib/cms/payload.ts).
  importing.active = true;
  try {
    await seedContent(payload);
    payload.logger.info('[admin] content import done');
  } catch (error) {
    payload.logger.error({ err: error }, '[admin] content import failed');
  } finally {
    importing.active = false;
    refreshSite();
  }
}
