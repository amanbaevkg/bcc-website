import { NextResponse } from 'next/server';
import { getContactPage } from '@/lib/cms/contact';
import { getEmailProvider } from '@/lib/contact/email';
import { handleContact } from '@/lib/contact/handler';
import { memoryLimiter, upstashLimiter, type RateLimiter } from '@/lib/contact/rateLimit';
import { verifyTurnstile } from '@/lib/contact/turnstile';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

const WINDOW_SEC = 600;
let limiter: RateLimiter | undefined;

function getLimiter(): RateLimiter {
  const e = env();
  limiter ??=
    e.UPSTASH_REDIS_REST_URL && e.UPSTASH_REDIS_REST_TOKEN
      ? upstashLimiter(
          e.UPSTASH_REDIS_REST_URL,
          e.UPSTASH_REDIS_REST_TOKEN,
          e.CONTACT_RATE_LIMIT,
          WINDOW_SEC,
        )
      : memoryLimiter(e.CONTACT_RATE_LIMIT, WINDOW_SEC);
  return limiter;
}

export async function POST(req: Request) {
  const e = env();
  const result = await handleContact(req, {
    env: e,
    email: () => getEmailProvider(e),
    limiter: getLimiter(),
    verifyTurnstile: (token, ip) => verifyTurnstile(e.TURNSTILE_SECRET_KEY ?? '', token, ip),
    choices: async () => (await getContactPage()).form,
  });
  const headers: Record<string, string> = { 'Cache-Control': 'no-store' };
  if (result.status === 429) headers['Retry-After'] = String(result.body.retryAfterSec);
  return NextResponse.json(result.body, { status: result.status, headers });
}
