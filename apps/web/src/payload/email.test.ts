import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// env() is read once per server start: load fresh modules for each test's settings.
let adminEmail: typeof import('./email').adminEmail;
let resetPasswordEmail: typeof import('./email').resetPasswordEmail;
let welcomeEmail: typeof import('./email').welcomeEmail;
beforeEach(async () => {
  vi.resetModules();
  ({ adminEmail, resetPasswordEmail, welcomeEmail } = await import('./email'));
});
afterEach(() => vi.unstubAllEnvs());

describe('admin e-mail', () => {
  it('builds the reset link from SITE_URL', () => {
    vi.stubEnv('SITE_URL', 'https://www.businesscentercapellen.lu/');
    expect(resetPasswordEmail({ token: 'abc123' })).toContain(
      'href="https://www.businesscentercapellen.lu/admin/reset/abc123"',
    );
  });

  it('sends a plain-text copy through the site mail setup', async () => {
    vi.stubEnv('EMAIL_PROVIDER', 'log');
    vi.stubEnv('SITE_ENV', 'development');
    const info = vi.fn();
    const adapter = adminEmail({ payload: { logger: { info, warn: vi.fn() } } as never });
    await adapter.sendEmail({
      to: 'a@example.com',
      subject: 'Reset',
      html: resetPasswordEmail({ token: 't1' }),
    });
    const logged = String(info.mock.calls[0]?.[0]);
    expect(logged).toContain('To a@example.com');
    expect(logged).toContain('http://localhost:3000/admin/reset/t1');
    expect(logged).not.toContain('<');
  });

  it('never logs the link in production', async () => {
    vi.stubEnv('EMAIL_PROVIDER', 'log');
    vi.stubEnv('SITE_ENV', 'production');
    const info = vi.fn();
    const warn = vi.fn();
    const adapter = adminEmail({ payload: { logger: { info, warn } } as never });
    await adapter.sendEmail({
      to: 'a@example.com',
      subject: 'Reset',
      html: resetPasswordEmail({ token: 't2' }),
    });
    expect(info).not.toHaveBeenCalled();
    expect(String(warn.mock.calls[0]?.[0])).not.toContain('t2');
  });

  it('welcomes a new user with a link to choose a password, from SITE_URL', () => {
    vi.stubEnv('SITE_URL', 'https://www.businesscentercapellen.lu');
    const html = welcomeEmail({ token: 'w1', role: 'editor', by: 'Anna <b>' });
    expect(html).toContain('href="https://www.businesscentercapellen.lu/admin/reset/w1"');
    expect(html).toContain('Anna &lt;b&gt; has given you access');
    expect(html).toContain('three days');
  });
});
