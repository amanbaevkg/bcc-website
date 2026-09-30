import type { ImageAsset, Link, Localized, RichLine, TextRun } from '@/content/types';

/*
 * Converters from Sanity's stored shapes to the site's content types.
 * Every converter returns undefined when data is missing, so callers can fall back
 * to the built-in content section by section.
 */

export type SanityLocalized = { _key: string; value?: string }[] | null | undefined;

export function localized(value: SanityLocalized): Localized | undefined {
  const out: Record<string, string> = {};
  for (const v of value ?? []) if (v.value?.trim()) out[v._key] = v.value;
  return out.en ? (out as Localized) : undefined;
}

export type SanityImage = {
  alt?: SanityLocalized;
  hotspot?: { x: number; y: number };
  asset?: { url: string; metadata?: { dimensions?: { width: number; height: number } } };
} | null;

export function image(value: SanityImage | undefined): ImageAsset | undefined {
  const dims = value?.asset?.metadata?.dimensions;
  if (!value?.asset?.url || !dims) return undefined;
  return {
    src: value.asset.url,
    width: dims.width,
    height: dims.height,
    alt: localized(value.alt) ?? { en: '' },
    hotspot: value.hotspot ? { x: value.hotspot.x, y: value.hotspot.y } : undefined,
  };
}

export type SanityLink = { label?: SanityLocalized; href?: string } | null | undefined;

export function link(value: SanityLink): Link | undefined {
  const label = localized(value?.label);
  return label && value?.href ? { label, href: value.href } : undefined;
}

type Block = { children?: { text?: string; marks?: string[] }[] };
export type SanityLocalizedBlock =
  Partial<Record<'en' | 'fr' | 'de' | 'lu', Block[]>> | null | undefined;

function runs(blocks: Block[] | undefined): TextRun[] | undefined {
  const out: TextRun[] = [];
  (blocks ?? []).forEach((b, i) => {
    if (i > 0) out.push(' ');
    for (const c of b.children ?? []) {
      if (!c.text) continue;
      out.push(c.marks?.includes('strong') ? { strong: c.text } : c.text);
    }
  });
  return out.length ? out : undefined;
}

export function richLine(value: SanityLocalizedBlock): RichLine | undefined {
  const en = runs(value?.en);
  if (!en) return undefined;
  const line: RichLine = { en };
  for (const l of ['fr', 'de', 'lu'] as const) {
    const r = runs(value?.[l]);
    if (r) line[l] = r;
  }
  return line;
}

/** Headline lines stored as a list of localized strings → one list of lines per language. */
export function lines(
  value: SanityLocalized[] | null | undefined,
): Localized<string[]> | undefined {
  const items = (value ?? []).map(localized);
  if (!items.length || items.some((i) => !i)) return undefined;
  const out: Localized<string[]> = { en: items.map((i) => i!.en) };
  for (const l of ['fr', 'de', 'lu'] as const) {
    if (items.every((i) => i![l])) out[l] = items.map((i) => i![l]!);
  }
  return out;
}

export const compact = <T>(list: (T | undefined)[]): T[] => list.filter((x): x is T => !!x);
