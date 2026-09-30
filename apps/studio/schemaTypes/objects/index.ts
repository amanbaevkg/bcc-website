import { defineField, defineType } from 'sanity';
import { localized } from '../lib';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    localized('alt', 'Alternative text', {
      max: 160,
      description: 'Describe what the photo shows, for screen readers and search engines.',
    }),
  ],
});

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    localized('label', 'Label', { max: 30 }),
    defineField({
      name: 'href',
      title: 'Target',
      type: 'string',
      description:
        'A page on this site without the language ("/contact", "/services") or a full https:// address.',
      validation: (rule) =>
        rule
          .required()
          .custom((v) =>
            !v || v.startsWith('/') || v.startsWith('https://')
              ? true
              : 'Start with "/" for a page on this site or "https://" for another site.',
          ),
    }),
  ],
});

export const seo = defineType({
  name: 'seo',
  title: 'Search engines and sharing',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    localized('title', 'Title', { max: 60, required: false }),
    localized('description', 'Description', { max: 160, multiline: true, required: false }),
    defineField({
      name: 'ogImage',
      title: 'Sharing image',
      type: 'image',
      description: 'Shown when the page is shared. 1200×630 px.',
    }),
    defineField({
      name: 'noindex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});

/** Rich text for long content. Only structure the site's design supports; no colours or fonts. */
export const richText = defineType({
  name: 'richText',
  title: 'Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Paragraph', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Subheading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [{ type: 'link', name: 'link', title: 'Link' }],
      },
    },
    { type: 'imageWithAlt' },
  ],
});

/** Short paragraph with bold runs, per language (the home page offer texts). */
export const localizedBlock = defineType({
  name: 'localizedBlock',
  title: 'Short text',
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: { decorators: [{ title: 'Bold', value: 'strong' }], annotations: [] },
        },
      ],
      validation: (rule) => rule.required(),
    },
    ...['fr', 'de', 'lu'].map((id) => ({
      name: id,
      title: { fr: 'Français', de: 'Deutsch', lu: 'Lëtzebuergesch' }[id],
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: { decorators: [{ title: 'Bold', value: 'strong' }], annotations: [] },
        },
      ],
    })),
  ],
});
