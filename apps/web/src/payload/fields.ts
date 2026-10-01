import type { Field, GroupField, UploadField } from 'payload';
import { lexicalEditor, BoldFeature, ParagraphFeature } from '@payloadcms/richtext-lexical';

/*
 * Field helpers shared by every page and list in the admin. Texts are stored per language
 * (EN/FR/DE/LU, switched with the language menu at the top of the admin); a missing
 * translation shows the English text on the site. Lengths are layout guidance, shown under
 * each field, not hard limits.
 */

type TextOpts = {
  max?: number;
  required?: boolean;
  multiline?: boolean;
  description?: string;
  label?: string;
};

export function text(name: string, label: string, opts: TextOpts = {}): Field {
  const { max, required = true, multiline, description } = opts;
  const hint = [description, max && `About ${max} characters at most per language.`]
    .filter(Boolean)
    .join(' ');
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
              : 'English is required.'
      : undefined,
    admin: hint ? { description: hint } : undefined,
  } as Field;
}

/** Headline written as one line per row. */
export const lines = (name: string, label: string, description: string): Field =>
  text(name, label, { multiline: true, max: 60, description });

/** A short paragraph with bold runs only (the offer texts). */
export const boldText = (name: string, label: string, description?: string): Field => ({
  name,
  label,
  type: 'richText',
  localized: true,
  editor: lexicalEditor({ features: () => [ParagraphFeature(), BoldFeature()] }),
  admin: description ? { description } : undefined,
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
    admin: {
      description: [
        opts.description,
        `${size} or more keeps it sharp on large screens. Set the focal point on the subject.`,
      ]
        .filter(Boolean)
        .join(' '),
    },
  };
}

export const link = (name: string, label: string, optional = false): GroupField => ({
  name,
  label,
  type: 'group',
  admin: optional ? { description: 'Optional: leave both empty for no button.' } : undefined,
  fields: [
    text('label', 'Label', { max: 40, required: !optional }),
    {
      name: 'href',
      label: 'Target',
      type: 'text',
      required: !optional,
      admin: {
        description:
          'A page on this site without the language ("/contact", "/services") or a full https:// address.',
      },
      validate: (v: unknown) =>
        (optional && !v) ||
        (typeof v === 'string' && (/^\/[\w\-/#?=&]*$/.test(v) || /^https:\/\/\S+$/.test(v)))
          ? true
          : 'Use a path like /contact or a full https:// address.',
    },
  ],
});

export const order: Field = {
  name: 'order',
  label: 'Order',
  type: 'number',
  defaultValue: 100,
  admin: { position: 'sidebar', description: 'Lower numbers come first.' },
};
