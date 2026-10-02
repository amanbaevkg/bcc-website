import type { CollectionConfig } from 'payload';
import { signedIn } from '../access';
import { image, text } from '../fields';
import { refreshAfterChange } from '../revalidate';

/** "Our new meeting room!" → "our-new-meeting-room". */
export const slugify = (t: string) =>
  t
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');

/** News articles. One article holds all four languages; a missing one shows the English text. */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News article', plural: 'News' },
  admin: { group: 'Website', useAsTitle: 'title', defaultColumns: ['title', 'date', '_status'] },
  defaultSort: '-date',
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: { afterChange: refreshAfterChange, afterDelete: refreshAfterChange },
  fields: [
    text('title', 'Title', { max: 100 }),
    {
      name: 'slug',
      label: 'URL slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description:
          'Filled in from the English title when you save. Part of the article’s address, so better not changed once published.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data, req }) =>
            typeof value === 'string' && value.trim()
              ? slugify(value)
              : req.locale === 'en' || !req.locale
                ? slugify(String(data?.title ?? ''))
                : value,
        ],
      },
      validate: (v: unknown) =>
        typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)
          ? true
          : 'Fill in the English title first.',
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date',
      required: true,
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' } },
    },
    image('cover', 'Cover', { minWidth: 1600, minHeight: 900, description: 'Horizontal 16:9.' }),
    text('excerpt', 'Teaser', { max: 400, multiline: true }),
    { name: 'body', label: 'Text', type: 'richText', localized: true, required: true },
    { name: 'author', label: 'Author', type: 'text', admin: { position: 'sidebar' } },
  ],
};
