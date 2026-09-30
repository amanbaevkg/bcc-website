import { defineField, defineType } from 'sanity';
import { image, languageField, localized, slugField } from '../lib';

const order = defineField({
  name: 'order',
  title: 'Order',
  type: 'number',
  description: 'Lower numbers come first.',
  initialValue: 100,
});

export const clientLogo = defineType({
  name: 'clientLogo',
  title: 'Client logo',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company',
      type: 'string',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'SVG, or PNG with a transparent background, at least 400 px wide. Dark logo for a light background.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: 'Website',
      type: 'url',
      validation: (r) => r.uri({ scheme: ['https'] }),
    }),
    defineField({ name: 'active', title: 'Show on the site', type: 'boolean', initialValue: true }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', media: 'logo' } },
});

export const space = defineType({
  name: 'space',
  title: 'Space photo',
  type: 'document',
  fields: [
    image('image', 'Photo', {
      minWidth: 1600,
      description: 'Horizontal or vertical; the gallery crops by its hotspot.',
    }),
    localized('caption', 'Caption', { max: 60 }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          'office',
          'coworking',
          'meeting-room',
          'common-area',
          'reception',
          'parking',
          'other',
        ],
      },
    }),
    order,
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'caption.0.value', media: 'image' } },
});

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  description: 'Shown word for word, in the language it was written in.',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 5,
      validation: (r) => r.required().max(500),
    }),
    defineField({
      name: 'quoteLanguage',
      title: 'Language of the quote',
      type: 'string',
      options: { list: ['en', 'fr', 'de', 'lu'] },
      initialValue: 'en',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required().max(60),
    }),
    localized('role', 'Role', { max: 60 }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
      validation: (r) => r.required().max(60),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 5,
      validation: (r) => r.required().integer().min(1).max(5),
    }),
    defineField({
      name: 'consent',
      title: 'The client agreed to publication',
      type: 'boolean',
      initialValue: false,
      validation: (r) =>
        r.custom((v) => (v ? true : 'Only publish testimonials the client agreed to.')).warning(),
    }),
    order,
  ],
  preview: { select: { title: 'company', subtitle: 'name' } },
});

/* Documents below have one document per language, linked by the translation plugin. */

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News',
  type: 'document',
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required().max(100),
    }),
    slugField,
    defineField({ name: 'date', title: 'Date', type: 'date', validation: (r) => r.required() }),
    image('cover', 'Cover', { minWidth: 1600, minHeight: 900, description: 'Horizontal 16:9.' }),
    defineField({
      name: 'excerpt',
      title: 'Teaser',
      type: 'text',
      rows: 3,
      validation: (r) => r.required().max(250),
    }),
    defineField({ name: 'body', title: 'Text', type: 'richText', validation: (r) => r.required() }),
    defineField({ name: 'author', title: 'Author', type: 'string' }),
    defineField({ name: 'seo', title: 'Search engines', type: 'seo' }),
  ],
  orderings: [{ title: 'Newest first', name: 'date', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'date', media: 'cover' } },
});

export const legalPage = defineType({
  name: 'legalPage',
  title: 'Legal page',
  type: 'document',
  description:
    'Privacy Policy and Legal Notice. Text must come from BCC’s legal advisers. The site cannot go live until each page is marked approved.',
  fields: [
    languageField,
    defineField({
      name: 'kind',
      title: 'Page',
      type: 'string',
      options: {
        list: [
          { title: 'Privacy Policy', value: 'privacy' },
          { title: 'Legal Notice', value: 'legal-notice' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required().max(80),
    }),
    defineField({ name: 'body', title: 'Text', type: 'richText', validation: (r) => r.required() }),
    defineField({
      name: 'updatedAt',
      title: 'Last updated',
      type: 'date',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'approved',
      title: 'Approved by BCC’s legal adviser',
      type: 'boolean',
      initialValue: false,
      description:
        'Only tick after written approval. Production builds stop while any legal page is not approved.',
    }),
    defineField({
      name: 'approvedBy',
      title: 'Approved by (name)',
      type: 'string',
      hidden: ({ parent }) => !parent?.approved,
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'language' } },
});
