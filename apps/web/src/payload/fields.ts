import type { Field, GroupField, UploadField } from 'payload';
import { lexicalEditor, BoldFeature, ParagraphFeature } from '@payloadcms/richtext-lexical';

/*
 * Field helpers shared by every page in the admin. Texts are stored per language
 * (EN/FR/DE/LU, switched with the language menu at the top of the admin); an empty
 * FR/DE/LU text shows the English one on the site. Lengths are layout guidance, not hard limits.
 */

/** Help text that also says "leave empty for English" while a non-English language is open. */
const hint = (text?: string) => ({
  components: { Description: { path: '@/payload/admin/Hint#Hint', clientProps: { text } } },
});

type TextOpts = {
  max?: number;
  required?: boolean;
  multiline?: boolean;
  description?: string;
};

export function text(name: string, label: string, opts: TextOpts = {}): Field {
  const { max, required = true, multiline, description } = opts;
  return {
    name,
    label,
    type: multiline ? 'textarea' : 'text',
    localized: true,
    // English is required; other languages fall back to it.
    validate: required
      ? (value: unknown, { req }: { req: { locale?: string } }) =>
          req.locale && req.locale !== 'en'
            ? true
            : typeof value === 'string' && value.trim()
              ? true
              : 'Please fill this in (English).'
      : undefined,
    admin: hint([description, max && `Up to about ${max} characters.`].filter(Boolean).join(' ')),
  } as Field;
}

/** Headline written as one line per row. */
export const lines = (name: string, label: string, description: string): Field =>
  text(name, label, { multiline: true, max: 60, description });

/** A short paragraph where words can be made bold. */
export const boldText = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'richText',
  localized: true,
  editor: lexicalEditor({ features: () => [ParagraphFeature(), BoldFeature()] }),
  admin: hint(description ?? 'Select words and press Ctrl+B (Cmd+B on a Mac) to make them bold.'),
});

export function image(
  name: string,
  label: string,
  opts: { minWidth: number; minHeight?: number; description?: string; required?: boolean },
): UploadField {
  const size = `${opts.minWidth}${opts.minHeight ? `×${opts.minHeight}` : ''} px`;
  return {
    name,
    label,
    type: 'upload',
    relationTo: 'media',
    required: opts.required ?? false,
    filterOptions: { mimeType: { contains: 'image' } },
    admin: {
      description: [opts.description, `Best at ${size} or larger.`].filter(Boolean).join(' '),
    },
  };
}

/** The pages a button can open. */
export const pages = [
  { label: 'Contact page', value: '/contact' },
  { label: 'Contact page, co-working pre-selected', value: '/contact?workspace=coworking' },
  {
    label: 'Contact page, private office pre-selected',
    value: '/contact?workspace=private-office',
  },
  { label: 'Our Services page', value: '/services' },
  { label: 'About Us page', value: '/about' },
  { label: 'News page', value: '/news' },
  { label: 'Home page', value: '/' },
];

export const pageSelect = (name: string, label: string, required = true): Field => ({
  name,
  label,
  type: 'select',
  required,
  options: pages,
  admin: { isClearable: !required },
});

/** A button: its words, and the page it opens. */
export const link = (name: string, label: string, optional = false): GroupField => ({
  name,
  label,
  type: 'group',
  admin: optional ? { description: 'Optional: leave both empty for no button.' } : undefined,
  fields: [
    {
      type: 'row',
      fields: [
        text('label', 'Button text', { max: 40, required: !optional }),
        pageSelect('href', 'Opens', !optional),
      ],
    },
  ],
});

/** List rows are named after one of their fields; long lists start folded. */
export const rowLabel = (field: string, fallback: string, collapsed = false) => ({
  initCollapsed: collapsed,
  components: {
    RowLabel: { path: '@/payload/admin/RowLabel#RowLabel', clientProps: { field, fallback } },
  },
});
