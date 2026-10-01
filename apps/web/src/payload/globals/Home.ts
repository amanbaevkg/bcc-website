import type { Field, GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { boldText, image, lines, link, text } from '../fields';
import { refreshAfterChange } from '../revalidate';

const offer = (name: string, label: string, photos: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    text('title', 'Title', { max: 40 }),
    {
      name: 'href',
      label: 'Title links to',
      type: 'text',
      defaultValue: '/services',
      required: true,
    },
    boldText('body', 'Text', 'Up to about 400 characters. Use bold for the key phrases.'),
    {
      name: 'images',
      label: 'Photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 2,
      admin: { description: photos },
    },
  ],
});

/** The home page. The order and look of its sections are fixed in the code. */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
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
          label: 'Hero',
          fields: [
            text('eyebrow', 'Small line above the title', { max: 60 }),
            text('title', 'Title', { max: 60 }),
            text('titleAccent', 'Words of the title in italic', {
              max: 30,
              required: false,
              description: 'Must appear at the end of the title, e.g. "Capellen".',
            }),
            text('subtitle', 'Subtitle', { max: 120 }),
            {
              name: 'video',
              label: 'Background video',
              type: 'group',
              admin: {
                description:
                  'Horizontal 16:9, 30–60 s, seamless loop, no sound, H.264 MP4. Keep the centre calm: the title sits there.',
              },
              fields: [
                {
                  name: 'mp4_1080',
                  label: 'Video 1080p (desktop)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: '1920×1080 MP4, under 15 MB.' },
                },
                {
                  name: 'mp4_720',
                  label: 'Video 720p (tablets)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: '1280×720 MP4, under 8 MB.' },
                },
                {
                  name: 'mp4_480',
                  label: 'Video 480p (phones)',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { description: '854×480 MP4, under 4 MB.' },
                },
                image('poster', 'Poster (first frame)', {
                  minWidth: 1920,
                  minHeight: 1080,
                  description:
                    'Shown while the video loads, on slow connections and for visitors who turn off motion.',
                }),
              ],
            },
            {
              name: 'workspaceTypes',
              label: 'Workspace choices',
              type: 'array',
              minRows: 1,
              maxRows: 8,
              fields: [
                {
                  name: 'code',
                  label: 'Code',
                  type: 'text',
                  required: true,
                  admin: {
                    description:
                      'Sent with the enquiry, e.g. "private-office". Do not change once in use.',
                  },
                  validate: (v: unknown) =>
                    typeof v === 'string' && /^[a-z0-9-]+$/.test(v)
                      ? true
                      : 'Lowercase letters, digits and hyphens only.',
                },
                text('name', 'Name', { max: 30 }),
                { name: 'hasTeamSize', label: 'Ask for team size', type: 'checkbox' },
              ],
            },
            {
              name: 'teamSizes',
              label: 'Team sizes offered',
              type: 'number',
              hasMany: true,
              maxRows: 12,
              admin: { description: 'The list scrolls when it is long; up to 12 sizes.' },
            },
            link('cta', 'Button'),
            link('ring', 'Round "Work with us" link'),
          ],
        },
        {
          label: 'Offices',
          fields: [
            offer(
              'coworking',
              'Co-Working',
              'First photo: large, horizontal ≈ 4:3, min 1840×1440. Second: ≈ square, min 830×840.',
            ),
            offer(
              'privateOffices',
              'Private Offices',
              'First photo: tall ≈ 2:3, min 1170×1720. Second: square, min 680×680.',
            ),
            link('servicesLink', 'Services link'),
          ],
        },
        {
          name: 'trust',
          label: 'Clients',
          fields: [
            text('title', 'Title', { max: 30 }),
            {
              name: 'clients',
              label: 'Client logos to show',
              type: 'relationship',
              relationTo: 'client-logos',
              hasMany: true,
              admin: {
                description: 'Leave empty to show all active client logos in their set order.',
              },
            },
          ],
        },
        {
          name: 'spaces',
          label: 'Spaces',
          fields: [
            text('title', 'Title', { max: 20 }),
            {
              name: 'items',
              label: 'Photos to show',
              type: 'relationship',
              relationTo: 'spaces',
              hasMany: true,
              admin: {
                description:
                  'Any number; the layout repeats every six photos. Leave empty to show all spaces.',
              },
            },
            link('moreLink', 'Link after the arrows'),
          ],
        },
        {
          label: 'Closing sections',
          fields: [
            {
              name: 'tomorrow',
              label: 'Building tomorrow’s now',
              type: 'group',
              fields: [
                lines(
                  'lines',
                  'Headline',
                  'Two or three short lines, one per row. The last line is set in italic.',
                ),
                text('card', 'Card text', { max: 140, multiline: true }),
                image('image', 'Background photo', {
                  minWidth: 2880,
                  minHeight: 2000,
                  description: 'Horizontal ≈ 3:2. Keep the top left calm: the headline sits there.',
                }),
              ],
            },
            {
              name: 'findMore',
              label: 'Find more',
              type: 'group',
              fields: [text('title', 'Title', { max: 60 }), link('cta', 'Button')],
            },
            {
              name: 'testimonials',
              label: 'Testimonials',
              type: 'group',
              fields: [
                text('title', 'Title', { max: 40 }),
                {
                  name: 'items',
                  label: 'Testimonials to show',
                  type: 'relationship',
                  relationTo: 'testimonials',
                  hasMany: true,
                  admin: {
                    description: 'Leave empty to show all testimonials in their set order.',
                  },
                },
              ],
            },
            {
              name: 'final',
              label: 'Final call to action',
              type: 'group',
              fields: [
                lines(
                  'lines',
                  'Headline',
                  'Two short lines, one per row. The second is set in italic.',
                ),
                link('cta', 'Button'),
                image('image', 'Background photo', {
                  minWidth: 2880,
                  minHeight: 1720,
                  description:
                    'Horizontal ≈ 5:3. Keep the left side calm: the headline sits there.',
                }),
              ],
            },
          ],
        },
      ],
    },
  ],
};
