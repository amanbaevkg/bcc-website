import 'server-only';
import { z } from 'zod';

/**
 * Server environment. Secrets are read here only and never reach client bundles
 * ("server-only" makes any client import fail the build).
 */
const emailList = z
  .string()
  .transform((v) =>
    v
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean),
  )
  .refine((list) => list.length > 0 && list.every((a) => z.email().safeParse(a).success), {
    message: 'Invalid email address (separate several addresses with commas)',
  })
  .transform((list) => list.join(', '));

const schema = z.object({
  SITE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  SITE_URL: z.url().default('http://localhost:3000'),
  SITE_BASIC_AUTH: z.string().optional(),

  // Contact form e-mail (phase 3). "log" only writes to the server log.
  EMAIL_PROVIDER: z.enum(['log', 'smtp', 'resend', 'postmark']).default('log'),
  CONTACT_TO: emailList.optional(),
  CONTACT_FROM: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z.stringbool().optional(),
  SMTP_TLS: z.enum(['on', 'off']).default('on'),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_SERVER_TOKEN: z.string().optional(),

  // Bot protection and rate limiting. CONTACT_RATE_LIMIT = messages per visitor per 10 minutes.
  CONTACT_RATE_LIMIT: z.coerce.number().int().positive().default(5),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Admin (Payload CMS at /admin). PAYLOAD_SECRET signs sign-in sessions: 32+ random characters.
  PAYLOAD_SECRET: z.string().min(32).optional(),
  DATABASE_URL: z.string().optional(),
  PAYLOAD_MEDIA_DIR: z.string().optional(),
  // Only read on the very first start, to create the first administrator.
  PAYLOAD_ADMIN_EMAIL: z.email().optional(),
  PAYLOAD_ADMIN_PASSWORD: z.string().min(12).optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function env(): Env {
  if (!cached) {
    // "NAME=" in an env file means "not set", not "set to empty": drop empty values before checking.
    const defined = Object.fromEntries(Object.entries(process.env).filter(([, v]) => v !== ''));
    const parsed = schema.safeParse(defined);
    if (!parsed.success) {
      throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
    }
    cached = parsed.data;
  }
  return cached;
}
