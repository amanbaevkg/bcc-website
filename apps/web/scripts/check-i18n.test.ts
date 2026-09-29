import { describe, expect, it } from 'vitest';
import { compare, flatten } from './check-i18n.mjs';

describe('i18n check', () => {
  const base = flatten({ a: { b: 'Hello {name}', c: 'x' } });

  it('accepts a complete translation', () => {
    expect(compare(base, flatten({ a: { b: 'Salut {name}', c: 'y' } }), 'fr')).toEqual([]);
  });

  it('reports missing, empty, extra keys and changed placeholders', () => {
    const errors = compare(base, flatten({ a: { b: 'Salut', c: ' ' }, z: 'extra' }), 'fr');
    expect(errors).toEqual([
      'fr: placeholders differ in "a.b"',
      'fr: empty "a.c"',
      'fr: extra key "z"',
    ]);
  });
});
