import { defineArrayMember, defineField, defineType } from 'sanity';
import { image, localized } from '../lib';

const icons = [
  'wifi',
  'reception',
  'meeting',
  'kitchen',
  'supplies',
  'parking',
  'cloud',
  'mail',
  'handshake',
  'more',
];

/** Our Services. Layout is fixed in the website code; editors change the words and photos. */
export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Our Services page',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Intro', default: true },
    { name: 'offices', title: 'Co-working & offices' },
    { name: 'offers', title: 'What we offer' },
    { name: 'seo', title: 'Search engines' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Intro',
      type: 'object',
      group: 'intro',
      fields: [
        localized('eyebrow', 'Small label', { max: 30 }),
        localized('title', 'Title', { max: 80 }),
        defineField({
          name: 'body',
          title: 'Short sentences',
          type: 'array',
          of: [defineArrayMember({ type: 'localizedLine' })],
          validation: (r) => r.max(3),
        }),
      ],
    }),
    defineField({
      name: 'choose',
      title: 'Co-working & private offices',
      type: 'object',
      group: 'offices',
      fields: [
        localized('title', 'Section title', { max: 40 }),
        defineField({
          name: 'coworking',
          title: 'Co-working',
          type: 'object',
          fields: [
            localized('title', 'Title', { max: 40 }),
            localized('kicker', 'Small label', { max: 40 }),
            defineField({ name: 'body', title: 'Text', type: 'localizedBlock' }),
            localized('packages', 'Packages sentence', { max: 200 }),
            localized('highlight', 'Highlighted sentence (italic)', { max: 300, multiline: true }),
            localized('audience', 'Who it is for', { max: 120 }),
            defineField({ name: 'cta', title: 'Button', type: 'link' }),
            image('image', 'Photo', { minWidth: 1600, description: 'Horizontal ≈ 4:3.' }),
          ],
        }),
        defineField({
          name: 'privateOffices',
          title: 'Private offices',
          type: 'object',
          fields: [
            localized('title', 'Title', { max: 40 }),
            defineField({
              name: 'sizes',
              title: 'Office sizes (people)',
              type: 'array',
              of: [{ type: 'number' }],
              description: 'One tile per size; each opens the enquiry form pre-filled.',
              validation: (r) => r.min(1).max(9),
            }),
            localized('sizeNote', 'Note on each tile', { max: 40 }),
            image('image', 'Small photo', { minWidth: 600, description: 'Horizontal.' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'offers',
      title: 'What we offer',
      type: 'object',
      group: 'offers',
      fields: [
        localized('title', 'Title', { max: 40 }),
        defineField({
          name: 'items',
          title: 'Services',
          type: 'array',
          description: 'An even number fills the two columns neatly.',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'offer',
              fields: [
                defineField({
                  name: 'icon',
                  title: 'Icon',
                  type: 'string',
                  options: { list: icons },
                  validation: (r) => r.required(),
                }),
                localized('title', 'Title', { max: 50 }),
                localized('body', 'Text', { max: 500, multiline: true }),
              ],
              preview: { select: { title: 'title.0.value', subtitle: 'icon' } },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Closing call to action',
      type: 'object',
      group: 'offers',
      fields: [
        localized('title', 'Title', { max: 80 }),
        defineField({ name: 'link', title: 'Button', type: 'link' }),
      ],
    }),
    defineField({ name: 'seo', title: 'Search engines', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Our Services page' }) },
});
