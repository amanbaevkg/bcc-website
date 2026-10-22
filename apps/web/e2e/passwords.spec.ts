import { expect, test } from '@playwright/test';

test('a password set from an e-mail link needs at least 12 characters', async ({ request }) => {
  const short = await request.post('/api/users/reset-password', {
    data: { token: 'not-a-real-token', password: 'abc' },
  });
  expect(short.status()).toBe(400);
  expect(JSON.stringify(await short.json())).toContain('at least 12 characters');

  // A long enough password goes on to Payload, which checks the token.
  const long = await request.post('/api/users/reset-password', {
    data: { token: 'not-a-real-token', password: 'a-long-enough-password' },
  });
  expect(long.status()).not.toBe(400);
  expect(long.ok()).toBe(false);
});
