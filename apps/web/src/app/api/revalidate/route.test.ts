import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/cache', () => ({ revalidateTag: vi.fn() }));

const secret = 'a-long-shared-secret-for-tests-0123';

async function call(headers: Record<string, string>) {
  vi.resetModules();
  const { POST } = await import('./route');
  const { revalidateTag } = await import('next/cache');
  const res = await POST(
    new Request('http://bcc.test/api/revalidate', { method: 'POST', headers }),
  );
  return { status: res.status, revalidateTag };
}

afterEach(() => vi.unstubAllEnvs());

describe('CMS refresh endpoint', () => {
  it('does not exist until a secret is configured', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', '');
    expect((await call({})).status).toBe(404);
  });

  it('refuses a wrong secret and accepts the right one', async () => {
    vi.stubEnv('SANITY_REVALIDATE_SECRET', secret);
    expect((await call({ authorization: 'Bearer wrong' })).status).toBe(401);
    const ok = await call({ authorization: `Bearer ${secret}` });
    expect(ok.status).toBe(200);
    expect(ok.revalidateTag).toHaveBeenCalledWith('sanity', 'max');
  });
});
