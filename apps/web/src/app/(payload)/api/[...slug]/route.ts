/* Payload's REST API, used by the admin (sign-in, saving, uploads, media files). */
import config from '@payload-config';
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes';
import { MIN_PASSWORD_LENGTH } from '@/payload/collections/Users';

const post = REST_POST(config);

/** The new password sent to reset-password, whether the admin sent JSON or a form. */
async function newPassword(req: Request): Promise<unknown> {
  const type = req.headers.get('content-type') ?? '';
  try {
    if (type.includes('application/json'))
      return ((await req.clone().json()) as { password?: unknown }).password;
    if (type.includes('form')) {
      const form = await req.clone().formData();
      const payload = form.get('_payload');
      if (typeof payload === 'string')
        return (JSON.parse(payload) as { password?: unknown }).password;
      return form.get('password');
    }
  } catch {
    // Unreadable bodies go on to Payload, which rejects them.
  }
  return undefined;
}

/*
 * Setting a password from the welcome or "Forgot password?" link skips the collection's own
 * checks (Payload's reset operation), so the minimum length is enforced here as well.
 */
export async function POST(req: Request, ctx: { params: Promise<{ slug: string[] }> }) {
  if (new URL(req.url).pathname.endsWith('/users/reset-password')) {
    const password = await newPassword(req);
    if (typeof password === 'string' && password.length < MIN_PASSWORD_LENGTH) {
      const message = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
      return Response.json(
        { errors: [{ message, data: { errors: [{ path: 'password', message }] } }] },
        { status: 400 },
      );
    }
  }
  return post(req, ctx);
}

export const GET = REST_GET(config);
export const DELETE = REST_DELETE(config);
export const PATCH = REST_PATCH(config);
export const PUT = REST_PUT(config);
export const OPTIONS = REST_OPTIONS(config);
