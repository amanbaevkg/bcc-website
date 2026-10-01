import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { image, link, text } from '../fields';
import { refreshAfterChange } from '../revalidate';

/** About Us. Layout is fixed in the code; editors change the words and photos. */
export const About: GlobalConfig = {
  slug: 'about',
  label: 'About Us page',
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
            text('titleAccent', 'End of the title in italic', {
              max: 40,
              required: false,
              description: 'Must be the last words of the title.',
            }),
            text('body', 'Text', { max: 600, multiline: true }),
            image('image', 'Wide photo', {
              minWidth: 2400,
              minHeight: 1200,
              description: 'Horizontal, about 2:1.',
            }),
          ],
        },
        {
          label: 'Highlights & figures',
          fields: [
            {
              name: 'highlights',
              label: 'Highlights',
              type: 'array',
              maxRows: 7,
              admin: { description: 'Three to seven short points.' },
              fields: [text('text', 'Text', { max: 120 })],
            },
            text('location', 'Location sentence', { max: 240 }),
            text('audience', 'Who it is for', { max: 400, multiline: true }),
            {
              name: 'figures',
              label: 'Figures',
              type: 'array',
              maxRows: 3,
              fields: [
                {
                  name: 'value',
                  label: 'Number',
                  type: 'text',
                  required: true,
                  maxLength: 8,
                  admin: { description: 'For example "20+".' },
                },
                text('label', 'Label', { max: 40 }),
              ],
            },
          ],
        },
        {
          label: 'Turnkey & Vision',
          fields: [
            {
              name: 'features',
              label: 'Features',
              type: 'array',
              maxRows: 4,
              fields: [
                text('title', 'Title', { max: 40 }),
                text('body', 'Text', { max: 500, multiline: true }),
                text('note', 'Highlighted note', { max: 500, multiline: true, required: false }),
                image('image', 'Photo', { minWidth: 1200, description: 'Tall or horizontal.' }),
                link('cta', 'Button', true),
              ],
            },
          ],
        },
        {
          name: 'visit',
          label: 'Visit',
          fields: [
            text('eyebrow', 'Small label', { max: 40 }),
            text('title', 'Title', { max: 60 }),
            link('cta', 'Button'),
            image('image', 'Background photo', { minWidth: 2400, description: 'Horizontal.' }),
          ],
        },
      ],
    },
  ],
};
