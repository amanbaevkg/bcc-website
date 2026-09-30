import 'server-only';
import { z } from 'zod';

/**
 * Server environment. Secrets are read here only and never reach client bundles
 * ("server-only" makes any client import fail the build).
 */
const schema = z.object({
  SITE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  SITE_URL: z.url().default('http://localhost:3000'),
  SITE_BASIC_AUTH: z.string().optional(),

  // Contact form e-mail (phase 3). "log" only writes to the server log.
  EMAIL_PROVIDER: z.enum(['log', 'smtp', 'resend', 'postmark']).default('log'),
  CONTACT_TO: z.email().optional(),
  CONTACT_FROM: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().optional(),
  SMTP_SECURE: z.stringbool().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  POSTMARK_SERVER_TOKEN: z.string().optional(),

  // Bot protection and rate limiting. CONTACT_RATE_LIMIT = messages per visitor per 10 minutes.
  CONTACT_RATE_LIMIT: z.coerce.number().int().positive().default(5),
  TURNSTILE_SECRET_KEY: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Sanity (phase 2). The read token is only needed for drafts/preview.
  SANITY_API_READ_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function env(): Env {
  if (!cached) {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
      throw new Error(`Invalid environment variables:\n${z.prettifyError(parsed.error)}`);
    }
    cached = parsed.data;
  }
  return cached;
}
