import type { CollectionConfig } from 'payload';
import { signedIn } from '../access';
import { image, text } from '../fields';
import { refreshAfterChange } from '../revalidate';

/** News articles. One article holds all four languages; a missing one shows the English text. */
export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News article', plural: 'News' },
  admin: { group: 'Lists', useAsTitle: 'title', defaultColumns: ['title', 'date', '_status'] },
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
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Part of the address, e.g. "new-meeting-room". Lowercase, digits, hyphens.',
      },
      validate: (v: unknown) =>
        typeof v === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(v)
          ? true
          : 'Use lowercase letters, digits and single hyphens only.',
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
