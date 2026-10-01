import type { EmailAdapter, SendEmailOptions } from 'payload';

/**
 * Admin e-mails (password reset) go out through the same delivery as the contact form
 * (EMAIL_PROVIDER, CONTACT_FROM, SMTP_*), so there is one mail setup for the whole site.
 * With EMAIL_PROVIDER=log nothing is sent; outside production the reset link is then
 * printed in the server terminal, so the flow can be tried locally.
 */
const addresses = (value: SendEmailOptions['to']): string =>
  ([value].flat(2).filter(Boolean) as (string | { address: string })[])
    .map((a) => (typeof a === 'string' ? a : a.address))
    .join(', ');

const toText = (html: string) =>
  html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>[^<]*<\/a>/g, '$1')
    .replace(/<\/p>|<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const adminEmail: EmailAdapter = ({ payload }) => {
  const from = process.env.CONTACT_FROM || 'website@bcc-lux.eu';
  return {
    name: 'site',
    defaultFromAddress: from.replace(/^.*<([^>]+)>.*$/, '$1'),
    defaultFromName: 'BCC website',
    async sendEmail(message) {
      const html = typeof message.html === 'string' ? message.html : '';
      const text = typeof message.text === 'string' ? message.text : toText(html);
      const to = addresses(message.to);
      // Loaded at send time: the Payload command line reads this config outside Next.js.
      const { env } = await import('@/lib/env');
      const e = env();
      if (e.EMAIL_PROVIDER === 'log') {
        if (e.SITE_ENV === 'production') {
          payload.logger.warn(`[admin] EMAIL_PROVIDER=log: e-mail to ${to} not sent`);
        } else {
          payload.logger.info(`[admin] EMAIL_PROVIDER=log, e-mail not sent. To ${to}:\n${text}`);
        }
        return;
      }
      const { getEmailProvider } = await import('@/lib/contact/email');
      await getEmailProvider(e).send({
        to,
        from,
        replyTo: from,
        subject: String(message.subject ?? ''),
        text,
        html,
      });
    },
  };
};

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** The reset link always uses SITE_URL, never the request's Host header. */
export function resetPasswordEmail({ token }: { token?: string } = {}) {
  const site = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
  const link = escape(`${site}/admin/reset/${encodeURIComponent(token ?? '')}`);
  return [
    '<p>Hello,</p>',
    '<p>Someone asked to reset the password of your account for the BCC website admin.</p>',
    `<p>To choose a new password, open this link within one hour:<br><a href="${link}">${link}</a></p>`,
    '<p>If you did not ask for this, ignore this e-mail: your password stays the same.</p>',
    '<p>Business Center Capellen</p>',
  ].join('\n');
}
