import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import type { Payload } from 'payload';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/** Accounts: what an admin types for a new user never works, and editors cannot unlock others. */
let payload: Payload;
let dir: string;
type User = { id: number | string; email: string; role: string; collection: 'users' };
let admin: User;

const login = (email: string, password: string) =>
  payload.login({ collection: 'users', data: { email, password } }).then(
    () => true,
    () => false,
  );

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bcc-users-'));
  process.env.DATABASE_URL = `file:${path.join(dir, 'test.db')}`;
  process.env.PAYLOAD_MEDIA_DIR = path.join(dir, 'media');
  process.env.PAYLOAD_SECRET = 'test-secret-test-secret-test-secret-00';
  process.env.PAYLOAD_ADMIN_EMAIL = 'admin@example.com';
  process.env.PAYLOAD_ADMIN_PASSWORD = 'Test-password-123';
  process.env.PAYLOAD_SEED = 'false';
  const [{ getPayload }, { default: config }] = await Promise.all([
    import('payload'),
    import('@payload-config'),
  ]);
  payload = await getPayload({ config });
  const found = await payload.find({ collection: 'users', overrideAccess: true });
  admin = { ...(found.docs[0] as unknown as User), collection: 'users' };
});

afterAll(async () => {
  await payload?.destroy();
  fs.rmSync(dir, { recursive: true, force: true });
});

describe('admin accounts', () => {
  it('the start-up admin signs in with PAYLOAD_ADMIN_PASSWORD', async () => {
    expect(admin.role).toBe('admin');
    expect(await login('admin@example.com', 'Test-password-123')).toBe(true);
  });

  it('the password an admin types for a new account does not work', async () => {
    await payload.create({
      collection: 'users',
      data: { email: 'editor@example.com', password: 'test', role: 'editor' },
      user: admin,
      overrideAccess: false,
    });
    expect(await login('editor@example.com', 'test')).toBe(false);
  });

  it('a password chosen later needs at least 12 characters', async () => {
    const editor = (
      await payload.find({
        collection: 'users',
        where: { email: { equals: 'editor@example.com' } },
        overrideAccess: true,
      })
    ).docs[0] as unknown as User;
    const as = { ...editor, collection: 'users' as const };
    await expect(
      payload.update({
        collection: 'users',
        id: editor.id,
        data: { password: 'short-pass' },
        user: as,
        overrideAccess: false,
      }),
    ).rejects.toThrow();
    await payload.update({
      collection: 'users',
      id: editor.id,
      data: { password: 'a-long-enough-password' },
      user: as,
      overrideAccess: false,
    });
    expect(await login('editor@example.com', 'a-long-enough-password')).toBe(true);
  });

  it('only admins can unlock an account', async () => {
    const editor = (
      await payload.find({
        collection: 'users',
        where: { email: { equals: 'editor@example.com' } },
        overrideAccess: true,
      })
    ).docs[0] as unknown as User;
    const unlock = (user: User) =>
      payload.unlock({
        collection: 'users',
        data: { email: 'admin@example.com' } as never,
        req: { user } as never,
        overrideAccess: false,
      });
    await expect(unlock({ ...editor, collection: 'users' })).rejects.toThrow();
    await expect(unlock(admin)).resolves.toBe(true);
  });
});
