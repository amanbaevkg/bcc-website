import 'server-only';
import { createHash } from 'node:crypto';
import type { Env } from '@/lib/env';
import type { EmailProvider } from './email';
import { buildMessage } from './message';
import type { RateLimiter } from './rateLimit';
import { requestSchema } from './schema';

export type ContactResult =
  | { status: 200; body: { ok: true } }
  | { status: 400; body: { ok: false; error: 'validation'; fields: Record<string, string> } }
  | { status: 400 | 403 | 413 | 415; body: { ok: false; error: 'bad_request' } }
  | { status: 429; body: { ok: false; error: 'rate_limited'; retryAfterSec: number } }
  | { status: 500; body: { ok: false; error: 'server' } };

type Deps = {
  env: Env;
  email: () => EmailProvider;
  limiter: RateLimiter;
  verifyTurnstile: (token: string | undefined, ip?: string) => Promise<boolean>;
};

const MAX_BYTES = 16 * 1024;
/** Faster than this and it was not a person typing. */
const MIN_ELAPSED_MS = 3_000;

/**
 * The visitor's address as seen by our reverse proxy. The proxy appends it to the end of
 * X-Forwarded-For; earlier entries come from the visitor and can be anything, so only the
 * last one is used (otherwise a changing fake entry would get around the rate limit).
 */
export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',').pop()?.trim() ||
    headers.get('x-real-ip')?.trim() ||
    'unknown'
  );
}

/** Escapes a display name for a quoted e-mail header, so a " in the name cannot add addresses. */
function quoted(name: string): string {
  return name.replace(/[\\"]/g, '\\$&');
}

/** The browser must be on our own site: blocks other sites posting to the API. */
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function handleContact(req: Request, deps: Deps): Promise<ContactResult> {
  const bad = (status: 400 | 403 | 413 | 415) => ({
    status,
    body: { ok: false as const, error: 'bad_request' as const },
  });

  if (!sameOrigin(req)) return bad(403);
  if (!req.headers.get('content-type')?.startsWith('application/json')) return bad(415);
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BYTES) return bad(413);

  const raw = await req.text();
  if (raw.length > MAX_BYTES) return bad(413);

  const ip = clientIp(req.headers);
  // Counted before validation so that floods of invalid requests are limited too.
  const key = createHash('sha256').update(ip).digest('hex').slice(0, 32);
  const rate = await deps.limiter.hit(key);
  if (!rate.ok)
    return {
      status: 429,
      body: { ok: false, error: 'rate_limited', retryAfterSec: rate.retryAfterSec },
    };

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return bad(400);
  }

  const parsed = requestSchema.safeParse(json);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0] === 'form' && typeof issue.path[1] === 'string') {
        fields[issue.path[1]] ??= issue.message;
      }
    }
    return Object.keys(fields).length
      ? { status: 400, body: { ok: false, error: 'validation', fields } }
      : bad(400);
  }
  const { form, meta } = parsed.data;

  // Bots get the same "thank you" as people, so they learn nothing; nothing is sent.
  if (meta.website || meta.elapsedMs < MIN_ELAPSED_MS) {
    console.info('[contact] dropped as spam', {
      honeypot: !!meta.website,
      elapsedMs: meta.elapsedMs,
    });
    return { status: 200, body: { ok: true } };
  }

  if (deps.env.TURNSTILE_SECRET_KEY && !(await deps.verifyTurnstile(meta.turnstileToken, ip))) {
    return bad(403);
  }

  let provider: EmailProvider;
  try {
    provider = deps.email();
  } catch (error) {
    console.error('[contact] e-mail is not configured', String(error));
    return { status: 500, body: { ok: false, error: 'server' } };
  }
  const to = deps.env.CONTACT_TO;
  const from = deps.env.CONTACT_FROM;
  if (provider.name !== 'log' && (!to || !from)) {
    console.error('[contact] CONTACT_TO and CONTACT_FROM must be set to send e-mail');
    return { status: 500, body: { ok: false, error: 'server' } };
  }

  const message = buildMessage(form, meta.locale);
  try {
    await provider.send({
      to: to ?? 'not-configured@example.invalid',
      from: from ?? 'not-configured@example.invalid',
      replyTo: `"${quoted(`${form.firstName} ${form.lastName}`)}" <${form.email}>`,
      ...message,
    });
  } catch (error) {
    console.error('[contact] sending failed', { provider: provider.name, error: String(error) });
    return { status: 500, body: { ok: false, error: 'server' } };
  }
  return { status: 200, body: { ok: true } };
}
