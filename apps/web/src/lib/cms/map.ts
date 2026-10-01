import type { ImageAsset, Link, Localized, RichLine } from '@/content/types';
import { runsFromLexical, type LexicalDoc } from '@/payload/lexical';

/*
 * Converters from the admin's stored shapes (Payload, read with locale "all") to the site's
 * content types. Every converter returns undefined when data is missing, so callers can fall
 * back to the built-in content section by section.
 */

const LOCALES = ['en', 'fr', 'de', 'lu'] as const;

/** A per-language text as Payload returns it with locale "all": { en, fr, de, lu }. */
export type CmsLocalized =
  Partial<Record<(typeof LOCALES)[number], string | null>> | null | undefined;

export function localized(value: CmsLocalized | string): Localized | undefined {
  if (typeof value === 'string') return value.trim() ? { en: value } : undefined;
  const out: Record<string, string> = {};
  for (const l of LOCALES) {
    const v = value?.[l];
    if (typeof v === 'string' && v.trim()) out[l] = v;
  }
  return out.en ? (out as Localized) : undefined;
}

/** An uploaded file (photo or video) as Payload returns it when populated. */
export type CmsMedia =
  | {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      alt?: CmsLocalized;
      focalX?: number | null;
      focalY?: number | null;
      mimeType?: string | null;
    }
  | number
  | string
  | null
  | undefined;

export function image(value: CmsMedia): ImageAsset | undefined {
  if (!value || typeof value !== 'object' || !value.url || !value.width || !value.height) {
    return undefined;
  }
  const hasFocus = typeof value.focalX === 'number' && typeof value.focalY === 'number';
  return {
    src: localPath(value.url),
    width: value.width,
    height: value.height,
    alt: localized(value.alt) ?? { en: '' },
    hotspot: hasFocus ? { x: value.focalX! / 100, y: value.focalY! / 100 } : undefined,
  };
}

export function fileUrl(value: CmsMedia): string | undefined {
  return value && typeof value === 'object' && value.url ? localPath(value.url) : undefined;
}

/** Uploads live on this site; Payload may prefix them with the site address. */
function localPath(url: string) {
  return url.replace(/^https?:\/\/[^/]+(?=\/api\/media\/)/, '');
}

export type CmsLink = { label?: CmsLocalized; href?: string | null } | null | undefined;

export function link(value: CmsLink): Link | undefined {
  const label = localized(value?.label);
  return label && value?.href ? { label, href: value.href } : undefined;
}

export type CmsRichLine = Partial<Record<(typeof LOCALES)[number], LexicalDoc>> | null | undefined;

export function richLine(value: CmsRichLine): RichLine | undefined {
  const en = runsFromLexical(value?.en);
  if (!en) return undefined;
  const line: RichLine = { en };
  for (const l of ['fr', 'de', 'lu'] as const) {
    const r = runsFromLexical(value?.[l]);
    if (r) line[l] = r;
  }
  return line;
}

/** Headline stored as one text per language, a line per row → one list of lines per language. */
export function lines(value: CmsLocalized): Localized<string[]> | undefined {
  const text = localized(value);
  if (!text) return undefined;
  const split = (t: string) =>
    t
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  const out: Localized<string[]> = { en: split(text.en) };
  for (const l of ['fr', 'de', 'lu'] as const) if (text[l]) out[l] = split(text[l]!);
  return out.en.length ? out : undefined;
}

/** Rows of { text } (e.g. highlights) → Localized[]; incomplete rows are dropped. */
export function localizedList(value: { text?: CmsLocalized }[] | null | undefined): Localized[] {
  return (value ?? []).map((r) => localized(r?.text)).filter((v): v is Localized => !!v);
}

export const compact = <T>(list: (T | undefined)[]): T[] => list.filter((x): x is T => !!x);
