import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => vi.unstubAllEnvs());

describe('environment', () => {
  it('treats empty variables from an env file as not set', async () => {
    for (const k of [
      'PAYLOAD_ADMIN_PASSWORD',
      'SITE_URL',
      'CONTACT_TO',
      'SMTP_PORT',
      'EMAIL_PROVIDER',
    ]) {
      vi.stubEnv(k, '');
    }
    vi.resetModules();
    const { env } = await import('./env');
    expect(env()).toMatchObject({ EMAIL_PROVIDER: 'log', SITE_URL: 'http://localhost:3000' });
    expect(env().PAYLOAD_ADMIN_PASSWORD).toBeUndefined();
  });
});
