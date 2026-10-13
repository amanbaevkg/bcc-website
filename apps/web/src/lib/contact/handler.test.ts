import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Env } from '@/lib/env';
import type { EmailProvider, OutgoingEmail } from './email';
import { clientIp, handleContact } from './handler';
import { memoryLimiter } from './rateLimit';
import { prefillFromQuery } from './schema';

const form = {
  firstName: 'Anna',
  lastName: 'Muller',
  company: 'ACME',
  email: 'anna@example.com',
  phone: '+352 20 600 820',
  officeType: 'private-office',
  teamSize: '3-4',
  services: ['meeting-rooms'],
  message: 'Hello <b>team</b>',
};
const meta = { locale: 'fr', website: '', elapsedMs: 8000 };

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request('http://bcc.test/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'http://bcc.test',
      host: 'bcc.test',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function setup(envOverrides: Partial<Env> = {}) {
  const sent: OutgoingEmail[] = [];
  const provider: EmailProvider = { name: 'test', send: async (m) => void sent.push(m) };
  const deps = {
    env: {
      EMAIL_PROVIDER: 'smtp',
      CONTACT_TO: 'info@bcc.test',
      CONTACT_FROM: 'web@bcc.test',
      ...envOverrides,
    } as Env,
    email: () => provider,
    limiter: memoryLimiter(3, 600),
    verifyTurnstile: vi.fn(async () => true),
  };
  return { sent, deps };
}

afterEach(() => vi.restoreAllMocks());

describe('contact API', () => {
  it('sends a valid enquiry with the visitor as reply-to and escaped HTML', async () => {
    const { sent, deps } = setup();
    const res = await handleContact(request({ form, meta }), deps);
    expect(res).toEqual({ status: 200, body: { ok: true } });
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('info@bcc.test');
    expect(sent[0].replyTo).toBe('"Anna Muller" <anna@example.com>');
    expect(sent[0].subject).toContain('Private Office');
    expect(sent[0].html).toContain('Hello &lt;b&gt;team&lt;/b&gt;');
    expect(sent[0].text).toContain('Site language: FR');
  });

  it('returns field errors for invalid input', async () => {
    const { deps } = setup();
    const res = await handleContact(
      request({
        form: { ...form, email: 'nope', services: [], firstName: 'A\r\nBcc: x@y.z' },
        meta,
      }),
      deps,
    );
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      error: 'validation',
      fields: { email: 'email', services: 'services', firstName: 'invalid' },
    });
  });

  it('silently drops honeypot and too-fast submissions', async () => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    const { sent, deps } = setup();
    expect(
      (await handleContact(request({ form, meta: { ...meta, website: 'spam.biz' } }), deps)).status,
    ).toBe(200);
    expect(
      (await handleContact(request({ form, meta: { ...meta, elapsedMs: 500 } }), deps)).status,
    ).toBe(200);
    expect(sent).toHaveLength(0);
  });

  it('rejects other origins, wrong content types and oversized bodies', async () => {
    const { deps } = setup();
    expect(
      (await handleContact(request({ form, meta }, { origin: 'https://evil.test' }), deps)).status,
    ).toBe(403);
    expect(
      (await handleContact(request({ form, meta }, { 'content-type': 'text/plain' }), deps)).status,
    ).toBe(415);
    const big = { form: { ...form, message: 'x'.repeat(20_000) }, meta };
    expect((await handleContact(request(big), deps)).status).toBe(413);
  });

  it('limits the number of requests per visitor', async () => {
    const { deps } = setup();
    const statuses = [];
    for (let i = 0; i < 4; i++)
      statuses.push((await handleContact(request({ form, meta }), deps)).status);
    expect(statuses).toEqual([200, 200, 200, 429]);
  });

  it('checks Turnstile only when a secret key is configured', async () => {
    const { deps } = setup({ TURNSTILE_SECRET_KEY: 'secret' });
    deps.verifyTurnstile.mockResolvedValueOnce(false);
    expect((await handleContact(request({ form, meta }), deps)).status).toBe(403);
  });

  it('refuses to send when the recipient is not configured', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { sent, deps } = setup({ CONTACT_TO: undefined });
    expect((await handleContact(request({ form, meta }), deps)).status).toBe(500);
    expect(sent).toHaveLength(0);
  });
});

describe('prefill from the hero finder', () => {
  it('maps workspace and team size', () => {
    expect(prefillFromQuery({ workspace: 'private-office', team: '6' })).toEqual({
      officeType: 'private-office',
      teamSize: '4-6',
    });
    expect(prefillFromQuery({ workspace: 'meeting-room' })).toEqual({
      services: ['meeting-rooms'],
    });
    expect(prefillFromQuery({ workspace: 'unknown', team: '4' })).toEqual({});
  });
});

describe('contact API: header safety', () => {
  it('keeps a quote in the name inside the reply-to display name', async () => {
    const { sent, deps } = setup();
    const name = { firstName: 'Eve" <evil@example.com>,', lastName: '"x' };
    await handleContact(request({ form: { ...form, ...name }, meta }), deps);
    expect(sent[0].replyTo).toBe('"Eve\\" <evil@example.com>, \\"x" <anna@example.com>');
  });

  it('uses the address added by the proxy, not one sent by the visitor', () => {
    const h = new Headers({ 'x-forwarded-for': '1.2.3.4, 203.0.113.9' });
    expect(clientIp(h)).toBe('203.0.113.9');
    expect(clientIp(new Headers({ 'x-forwarded-for': '203.0.113.9' }))).toBe('203.0.113.9');
  });
});
