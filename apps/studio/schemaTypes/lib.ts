import { defineField, type Rule, type SlugRule } from 'sanity';

type LocalizedValue = { _key: string; language?: string; value?: string }[] | undefined;

/** Items store the language in `language` (plugin v5); older items kept it in `_key`. */
const langOf = (v: { _key: string; language?: string }) => v.language ?? v._key;

/**
 * A short text with a value per language (EN/FR/DE/LU side by side).
 * English is required; a missing translation shows the English text on the site,
 * and the editor sees a warning.
 */
export function localized(
  name: string,
  title: string,
  opts: {
    max?: number;
    multiline?: boolean;
    required?: boolean;
    description?: string;
    group?: string;
  } = {},
) {
  const { max, multiline, required = true, description, group } = opts;
  return defineField({
    name,
    title,
    group,
    type: multiline ? 'internationalizedArrayText' : 'internationalizedArrayString',
    description: [description, max && `Max ${max} characters per language.`]
      .filter(Boolean)
      .join(' '),
    validation: (rule: Rule) => [
      rule.custom((value: LocalizedValue) => {
        const en = value?.find((v) => langOf(v) === 'en')?.value?.trim();
        if (required && !en) return 'English is required.';
        const tooLong = value?.find((v) => max && (v.value?.length ?? 0) > max);
        return tooLong ? `${langOf(tooLong).toUpperCase()}: longer than ${max} characters.` : true;
      }),
      rule
        .custom((value: LocalizedValue) => {
          const filled = new Set(value?.filter((v) => v.value?.trim()).map(langOf));
          const missing = ['fr', 'de', 'lu'].filter((l) => filled.has('en') && !filled.has(l));
          return missing.length
            ? `Translation missing: ${missing.join(', ').toUpperCase()}. The English text is shown instead.`
            : true;
        })
        .warning(),
    ],
  });
}

/** Parses width and height from a Sanity image asset id ("image-<hash>-<w>x<h>-<ext>"). */
export function assetSize(ref?: string): { width: number; height: number } | null {
  const m = ref?.match(/-(\d+)x(\d+)-\w+$/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

/** An image field with required alt text, hotspot and a minimum size. */
export function image(
  name: string,
  title: string,
  opts: { minWidth: number; minHeight?: number; description: string; required?: boolean },
) {
  const { minWidth, minHeight = 0, description, required = true } = opts;
  return defineField({
    name,
    title,
    type: 'imageWithAlt',
    description: `${description} Minimum ${minWidth}${minHeight ? `×${minHeight}` : ''} px. JPG or WebP. Set the hotspot on the subject.`,
    validation: (rule: Rule) => {
      const base = rule.custom((value: { asset?: { _ref?: string } } | undefined) => {
        if (!value?.asset) return true;
        const size = assetSize(value.asset._ref);
        if (size && (size.width < minWidth || size.height < minHeight)) {
          return `Image is ${size.width}×${size.height} px; at least ${minWidth}${minHeight ? `×${minHeight}` : ''} px is needed so it stays sharp.`;
        }
        return true;
      });
      return required ? [rule.required(), base] : [base];
    },
  });
}

export const slugField = defineField({
  name: 'slug',
  title: 'URL slug',
  type: 'slug',
  description: 'Part of the address, e.g. "meeting-rooms". Lowercase letters, digits and hyphens.',
  options: { source: 'title', maxLength: 80 },
  validation: (rule: SlugRule) =>
    rule
      .required()
      .custom((slug) =>
        slug?.current && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug.current)
          ? 'Use lowercase letters, digits and single hyphens only.'
          : true,
      ),
});

/** Hidden field used by the document translation plugin. */
export const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
});
