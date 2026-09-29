/**
 * Fails when a message key exists in one language but not in another, or when
 * a translation is empty. Run with `pnpm i18n:check`; CI runs it too.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type Tree = { [key: string]: string | Tree };

export function flatten(tree: Tree, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out.set(key, v);
    else for (const [ck, cv] of flatten(v, key)) out.set(ck, cv);
  }
  return out;
}

const placeholders = (s: string) =>
  [...s.matchAll(/\{(\w+)/g)]
    .map((m) => m[1])
    .sort()
    .join(',');

export function compare(base: Map<string, string>, other: Map<string, string>, name: string) {
  const errors: string[] = [];
  for (const [k, v] of base) {
    const o = other.get(k);
    if (o === undefined) errors.push(`${name}: missing "${k}"`);
    else if (!o.trim()) errors.push(`${name}: empty "${k}"`);
    else if (placeholders(o) !== placeholders(v))
      errors.push(`${name}: placeholders differ in "${k}"`);
  }
  for (const k of other.keys()) if (!base.has(k)) errors.push(`${name}: extra key "${k}"`);
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const load = (l: string) =>
    flatten(JSON.parse(readFileSync(new URL(`../messages/${l}.json`, import.meta.url), 'utf8')));
  const base = load('en');
  const errors = ['fr', 'de', 'lu'].flatMap((l) => compare(base, load(l), l));
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  console.log(`i18n: ${base.size} keys, all languages complete.`);
}
