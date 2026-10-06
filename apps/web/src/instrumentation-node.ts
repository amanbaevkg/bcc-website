/**
 * Called once when the Node.js server starts (from instrumentation.ts) (not during `next build`).
 * 1. Starts Payload, which creates the first admin and imports the current content on the
 *    very first start (src/payload/bootstrap.ts), instead of on a visitor's first request.
 * 2. SITE_URL check: on a server it must be the public https address (see lib/site-url-check).
 * 3. Launch gate: with SITE_ENV=production the server refuses to start until the Privacy
 *    Policy and Legal Notice are entered and approved in all four languages in the admin.
 *    Enter them while running as staging (same database), then switch to production.
 */
export async function start() {
  if (process.env.NEXT_PHASE === 'phase-production-build') return;
  if (!process.env.PAYLOAD_SECRET || process.env.PAYLOAD_SECRET.length < 32) {
    console.error('[admin] PAYLOAD_SECRET must be set to 32 or more random characters.');
    if (process.env.NODE_ENV === 'production') process.exit(1);
    return;
  }
  // On a server (NODE_ENV=production) SITE_URL must be the public address: the admin rejects
  // every save otherwise. Production refuses to start; staging and tests only warn.
  if (process.env.NODE_ENV === 'production') {
    const { siteUrlProblem } = await import('@/lib/site-url-check');
    const problem = siteUrlProblem(process.env.SITE_URL);
    if (problem) {
      console.error(
        `[config] ${problem}. Set SITE_URL to the address visitors use (https://…, no trailing slash) ` +
          'and restart: the admin only accepts changes from that address.',
      );
      if (process.env.SITE_ENV === 'production') process.exit(1);
    }
  }
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ]);
  const payload = await getPayload({ config });

  if (process.env.SITE_ENV !== 'production') return;
  const { missingApprovals } = await import('@/lib/cms/legal-check');
  const docs = (
    await payload.find({ collection: 'legal-pages', locale: 'all', limit: 10, pagination: false })
  ).docs;
  const missing = missingApprovals(docs as never, ['en', 'fr', 'de', 'lu']);
  if (missing.length) {
    console.error(
      `[launch gate] Not starting as production: legal pages missing or not approved: ${missing.join(', ')}. ` +
        'Enter and approve them in /admin while running with SITE_ENV=staging.',
    );
    process.exit(1);
  }
}
