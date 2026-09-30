import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

function sameSecret(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Called by a Sanity webhook after an editor publishes. Marks all CMS data as stale so pages
 * show the new content on their next visit. The webhook sends
 * "Authorization: Bearer <SANITY_REVALIDATE_SECRET>"; anything else is refused.
 */
export async function POST(req: Request) {
  const secret = env().SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false }, { status: 404 });
  const given = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  if (!sameSecret(given, secret)) return NextResponse.json({ ok: false }, { status: 401 });
  revalidateTag('sanity', 'max');
  return NextResponse.json(
    { ok: true, revalidated: 'sanity' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
