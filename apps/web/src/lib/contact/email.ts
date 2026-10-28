import 'server-only';
import { env, type Env } from '@/lib/env';

/**
 * One interface, four ways to deliver: the provider is chosen with EMAIL_PROVIDER.
 * "log" (default) only writes to the server log, so nothing is sent until real
 * delivery is configured and approved. Credentials come from environment variables only.
 */
export type OutgoingEmail = {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

export interface EmailProvider {
  readonly name: string;
  send(message: OutgoingEmail): Promise<void>;
}

const logProvider: EmailProvider = {
  name: 'log',
  async send(m) {
    // Only metadata: the log must not become a copy of people's personal data.
    console.info('[contact] EMAIL_PROVIDER=log, message not sent', {
      to: m.to.split(',').map((a) => a.trim()),
      subject: m.subject,
      bytes: m.text.length,
    });
  },
};

function smtpProvider(e: Env): EmailProvider {
  return {
    name: 'smtp',
    async send(m) {
      const { createTransport } = await import('nodemailer');
      const plain = e.SMTP_TLS === 'off';
      const transport = createTransport({
        host: e.SMTP_HOST,
        port: e.SMTP_PORT ?? (plain ? 25 : 587),
        secure: plain ? false : (e.SMTP_SECURE ?? false),
        requireTLS: !plain && !(e.SMTP_SECURE ?? false),
        ignoreTLS: plain,
        auth: e.SMTP_USER ? { user: e.SMTP_USER, pass: e.SMTP_PASSWORD } : undefined,
      });
      await transport.sendMail(m);
    },
  };
}

async function postJson(url: string, headers: Record<string, string>, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`${new URL(url).host} responded ${res.status}`);
}

function resendProvider(e: Env): EmailProvider {
  return {
    name: 'resend',
    send: (m) =>
      postJson(
        'https://api.resend.com/emails',
        { Authorization: `Bearer ${e.RESEND_API_KEY}` },
        {
          from: m.from,
          to: [m.to],
          reply_to: m.replyTo,
          subject: m.subject,
          text: m.text,
          html: m.html,
        },
      ),
  };
}

function postmarkProvider(e: Env): EmailProvider {
  return {
    name: 'postmark',
    send: (m) =>
      postJson(
        'https://api.postmarkapp.com/email',
        { 'X-Postmark-Server-Token': e.POSTMARK_SERVER_TOKEN ?? '' },
        {
          From: m.from,
          To: m.to,
          ReplyTo: m.replyTo,
          Subject: m.subject,
          TextBody: m.text,
          HtmlBody: m.html,
          MessageStream: 'outbound',
        },
      ),
  };
}

/** Returns the configured provider, or explains which setting is missing. */
export function getEmailProvider(e: Env = env()): EmailProvider {
  const need = (ok: unknown, what: string) => {
    if (!ok) throw new Error(`EMAIL_PROVIDER=${e.EMAIL_PROVIDER} needs ${what}`);
  };
  switch (e.EMAIL_PROVIDER) {
    case 'smtp':
      need(e.SMTP_HOST, 'SMTP_HOST');
      return smtpProvider(e);
    case 'resend':
      need(e.RESEND_API_KEY, 'RESEND_API_KEY');
      return resendProvider(e);
    case 'postmark':
      need(e.POSTMARK_SERVER_TOKEN, 'POSTMARK_SERVER_TOKEN');
      return postmarkProvider(e);
    default:
      return logProvider;
  }
}
