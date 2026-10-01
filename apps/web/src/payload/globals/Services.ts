import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { boldText, image, link, text } from '../fields';
import { refreshAfterChange } from '../revalidate';

export const serviceIcons = [
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
] as const;

/** Our Services. Layout is fixed in the code; editors change the words and photos. */
export const Services: GlobalConfig = {
  slug: 'services',
  label: 'Our Services page',
  admin: { group: 'Pages' },
  access: { read: signedIn, update: signedIn },
  versions: { drafts: true, max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Intro',
          fields: [
            text('eyebrow', 'Small label', { max: 30 }),
            text('title', 'Title', { max: 80 }),
            {
              name: 'body',
              label: 'Short sentences',
              type: 'array',
              maxRows: 3,
              fields: [text('text', 'Text', { max: 120 })],
            },
          ],
        },
        {
          name: 'choose',
          label: 'Co-working & offices',
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
                    description: 'One tile per size; each opens the enquiry form pre-filled.',
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
          label: 'What we offer',
          fields: [
            text('title', 'Title', { max: 40 }),
            {
              name: 'items',
              label: 'Services',
              type: 'array',
              admin: { description: 'An even number fills the two columns neatly.' },
              fields: [
                {
                  name: 'icon',
                  label: 'Icon',
                  type: 'select',
                  required: true,
                  options: [...serviceIcons],
                },
                text('title', 'Title', { max: 50 }),
                text('body', 'Text', { max: 500, multiline: true }),
              ],
            },
          ],
        },
        {
          name: 'cta',
          label: 'Closing call to action',
          fields: [text('title', 'Title', { max: 80 }), link('link', 'Button')],
        },
      ],
    },
  ],
};
