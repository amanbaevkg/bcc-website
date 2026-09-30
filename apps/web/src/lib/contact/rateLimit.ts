import 'server-only';

/**
 * Fixed-window rate limiter. With Upstash configured the count is shared by every
 * server instance (needed on Vercel/Netlify); without it, each process counts on its
 * own, which is enough for a single self-hosted server.
 */
export type RateLimitResult = { ok: boolean; retryAfterSec: number };

export interface RateLimiter {
  hit(key: string): Promise<RateLimitResult>;
}

export function memoryLimiter(
  limit: number,
  windowSec: number,
  now = () => Date.now(),
): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();
  return {
    async hit(key) {
      const t = now();
      if (hits.size > 10_000) for (const [k, v] of hits) if (v.resetAt <= t) hits.delete(k);
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= t) {
        hits.set(key, { count: 1, resetAt: t + windowSec * 1000 });
        return { ok: true, retryAfterSec: 0 };
      }
      entry.count += 1;
      return {
        ok: entry.count <= limit,
        retryAfterSec: Math.ceil((entry.resetAt - t) / 1000),
      };
    },
  };
}

export function upstashLimiter(
  url: string,
  token: string,
  limit: number,
  windowSec: number,
): RateLimiter {
  return {
    async hit(key) {
      const k = `bcc:contact:${key}`;
      const res = await fetch(`${url}/pipeline`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify([
          ['INCR', k],
          ['EXPIRE', k, String(windowSec), 'NX'],
          ['TTL', k],
        ]),
        signal: AbortSignal.timeout(3_000),
      });
      if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
      const [count, , ttl] = (await res.json()) as { result: number }[];
      return { ok: count.result <= limit, retryAfterSec: Math.max(1, ttl.result) };
    },
  };
}
