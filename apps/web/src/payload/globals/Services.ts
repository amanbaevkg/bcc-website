import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { boldText, image, link, rowLabel, text } from '../fields';
import { pagePreview } from '../preview';
import { refreshAfterChange } from '../revalidate';

/** Our Services. Layout is fixed in the code; editors change the words and photos. */
export const Services: GlobalConfig = {
  slug: 'services',
  label: 'Our Services page',
  admin: {
    group: 'Website',
    description: 'One tab per block, from the top of the page to the bottom.',
    preview: pagePreview('/services'),
  },
  access: { read: signedIn, update: signedIn },
  versions: { max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: '1. Top',
          fields: [
            text('eyebrow', 'Small label', { max: 30 }),
            text('title', 'Title', { max: 80 }),
            {
              name: 'body',
              label: 'Short sentences',
              type: 'array',
              maxRows: 3,
              labels: { singular: 'Sentence', plural: 'Sentences' },
              admin: rowLabel('text', 'Sentence'),
              fields: [text('text', 'Text', { max: 120 })],
            },
          ],
        },
        {
          name: 'choose',
          label: '2. Co-working & offices',
          fields: [
            text('title', 'Section title', { max: 40 }),
            {
              name: 'coworking',
              label: 'Co-working',
              type: 'group',
              fields: [
                text('title', 'Title', { max: 40 }),
                text('kicker', 'Small label', { max: 40 }),
                boldText('body', 'Text'),
                text('packages', 'Packages sentence', { max: 200 }),
                text('highlight', 'Highlighted sentence (italic)', { max: 300, multiline: true }),
                text('audience', 'Who it is for', { max: 120 }),
                link('cta', 'Button'),
                image('image', 'Photo', { minWidth: 1600, description: 'Horizontal ≈ 4:3.' }),
              ],
            },
            {
              name: 'privateOffices',
              label: 'Private offices',
              type: 'group',
              fields: [
                text('title', 'Title', { max: 40 }),
                {
                  name: 'sizes',
                  label: 'Office sizes (people)',
                  type: 'number',
                  hasMany: true,
                  minRows: 1,
                  maxRows: 9,
                  admin: {
                    description:
                      'Type a number and press Enter. One tile per size; each opens the contact form pre-filled.',
                  },
                },
                text('sizeNote', 'Note on each tile', { max: 40 }),
                image('image', 'Small photo', { minWidth: 600, description: 'Horizontal.' }),
              ],
            },
          ],
        },
        {
          name: 'offers',
          label: '3. What we offer',
          fields: [
            text('title', 'Title', { max: 40 }),
            {
              name: 'items',
              label: 'Services',
              type: 'array',
              labels: { singular: 'Service', plural: 'Services' },
              admin: {
                ...rowLabel('title', 'Service', true),
                description:
                  'Drag to change the order. An even number fills the two columns neatly.',
              },
              fields: [
                {
                  name: 'icon',
                  label: 'Icon',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  filterOptions: { mimeType: { in: ['image/svg+xml', 'image/png'] } },
                  admin: {
                    description:
                      'Any icon: SVG, or PNG with a transparent background. It is shown in the site’s colour, so its own colours do not matter. Free icons: lucide.dev, tabler.io/icons.',
                  },
                },
                text('title', 'Title', { max: 50 }),
                text('body', 'Text', { max: 500, multiline: true }),
              ],
            },
          ],
        },
        {
          name: 'cta',
          label: '4. Last block',
          fields: [text('title', 'Title', { max: 80 }), link('link', 'Button')],
        },
      ],
    },
  ],
};
