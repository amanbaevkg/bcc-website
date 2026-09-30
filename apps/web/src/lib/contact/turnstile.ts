import 'server-only';

/** Verifies a Cloudflare Turnstile token. Only used when TURNSTILE_SECRET_KEY is set. */
export async function verifyTurnstile(secret: string, token: string | undefined, ip?: string) {
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      signal: AbortSignal.timeout(5_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
