import { describe, expect, it } from 'vitest';
import { aboutFallback } from './about';
import { homeFallback } from './home';
import { servicesFallback } from './services';

/**
 * Every text with an English value must also exist in FR, DE and LU, except the few that are
 * deliberately the same in every language (names, the address, testimonial quotes).
 */
const sameInEveryLanguage = [
  /^home\.hero\.(eyebrow|title|titleAccent)$/,
  /^home\.hero\.video\.poster\.alt$/,
  /^home\.trust\.clients\.\d+\.logo\.alt$/,
  /^home\.testimonials\.items\.\d+\.quote$/,
  /^home\.testimonials\.items\.\d+\.role$/,
];

function missing(value: unknown, path: string, out: string[]) {
  if (!value || typeof value !== 'object') return;
  const v = value as Record<string, unknown>;
  if ('en' in v && (typeof v.en === 'string' || Array.isArray(v.en))) {
    const allowed = sameInEveryLanguage.some((re) => re.test(path));
    const gaps = ['fr', 'de', 'lu'].filter((l) => !(l in v));
    if (gaps.length && !allowed) out.push(`${path}: ${gaps.join(', ')}`);
    return;
  }
  for (const [k, child] of Object.entries(v)) missing(child, `${path}.${k}`, out);
}

describe('page content translations', () => {
  it.each([
    ['home', homeFallback],
    ['about', aboutFallback],
    ['services', servicesFallback],
  ])('%s is complete in FR, DE and LU', (name, content) => {
    const out: string[] = [];
    missing(content, name, out);
    expect(out).toEqual([]);
  });
});
