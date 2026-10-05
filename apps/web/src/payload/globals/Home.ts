import type { Field, GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { boldText, image, lines, link, pageSelect, rowLabel, text } from '../fields';
import { refreshAfterChange } from '../revalidate';
import { pagePreview } from '../preview';

const offer = (name: string, label: string, photos: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [text('title', 'Title', { max: 40 }), pageSelect('href', 'The title opens')],
    },
    boldText('body', 'Text'),
    {
      name: 'images',
      label: 'Photos (2)',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 2,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: photos },
    },
  ],
});

/** What a choice in the "I'm looking for" menu pre-selects in the contact form. */
export const workspaceChoices = [
  { label: 'Private office (also asks for the team size)', value: 'private-office' },
  { label: 'Co-working', value: 'coworking' },
  { label: 'Meeting rooms', value: 'meeting-room' },
  { label: 'Domiciliation', value: 'domiciliation' },
  { label: 'Nothing, the visitor chooses in the form', value: 'other' },
];

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Lëtzebuergesch', value: 'lu' },
];

/** The home page, tab by tab in the order the blocks appear on the site. */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: {
    group: 'Website',
    description: 'One tab per block, from the top of the page to the bottom.',
    preview: pagePreview(''),
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
            text('eyebrow', 'Small line above the title', { max: 60 }),
            {
              type: 'row',
              fields: [
                text('title', 'Title', { max: 60 }),
                text('titleAccent', 'Last words of the title in italic', {
                  max: 30,
                  required: false,
                  description: 'Copy them from the end of the title, e.g. "Capellen".',
                }),
              ],
            },
            text('subtitle', 'Subtitle', { max: 120 }),
            {
              name: 'workspaceTypes',
              label: '"I\'m looking for" menu',
              type: 'array',
              minRows: 1,
              maxRows: 8,
              labels: { singular: 'Choice', plural: 'Choices' },
              admin: rowLabel('name', 'Choice'),
              fields: [
                {
                  type: 'row',
                  fields: [
                    text('name', 'Shown as', { max: 30 }),
                    {
                      name: 'opens',
                      label: 'In the contact form, pre-select',
                      type: 'select',
                      required: true,
                      defaultValue: 'other',
                      options: workspaceChoices,
                    },
                  ],
                },
              ],
            },
            {
              name: 'teamSizes',
              label: 'Team sizes (for private offices)',
              type: 'number',
              hasMany: true,
              min: 1,
              maxRows: 12,
              admin: { description: 'Type a number and press Enter. Up to 12 sizes.' },
            },
            {
              type: 'row',
              fields: [link('cta', 'Main button'), link('ring', 'Round "Work with us" link')],
            },
            {
              name: 'video',
              label: 'Background video',
              type: 'group',
              admin: {
                description:
                  'MP4, horizontal 16:9, 30–60 s, no sound. Keep the centre calm: the title sits there.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'mp4_1080',
                      label: 'Video',
                      type: 'upload',
                      relationTo: 'media',
                      filterOptions: { mimeType: { equals: 'video/mp4' } },
                      admin: { description: '1920×1080, under 15 MB.' },
                    },
                    image('poster', 'Still picture', {
                      minWidth: 1920,
                      minHeight: 1080,
                      description: 'Shown while the video loads. Usually its first frame.',
                    }),
                  ],
                },
                {
                  type: 'collapsible',
                  label: 'Lighter versions for phones and tablets (optional)',
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'mp4_720',
                          label: 'Video 1280×720',
                          type: 'upload',
                          relationTo: 'media',
                          filterOptions: { mimeType: { equals: 'video/mp4' } },
                          admin: { description: 'Under 8 MB.' },
                        },
                        {
                          name: 'mp4_480',
                          label: 'Video 854×480',
                          type: 'upload',
                          relationTo: 'media',
                          filterOptions: { mimeType: { equals: 'video/mp4' } },
                          admin: { description: 'Under 4 MB.' },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '2. Co-working & offices',
          fields: [
            offer(
              'coworking',
              'Co-working',
              'First: horizontal ≈ 4:3 (1840×1440 or larger). Second: square (830×830 or larger).',
            ),
            offer(
              'privateOffices',
              'Private offices',
              'First: tall ≈ 2:3 (1170×1720 or larger). Second: square (680×680 or larger).',
            ),
            link('servicesLink', 'Link below both blocks'),
          ],
        },
        {
          name: 'trust',
          label: '3. Client logos',
          fields: [
            text('title', 'Title', { max: 30 }),
            {
              name: 'clients',
              label: 'Logos',
              type: 'array',
              labels: { singular: 'Logo', plural: 'Logos' },
              admin: {
                ...rowLabel('name', 'Logo', true),
                description: 'Drag to change the order. Remove a row to hide that logo.',
              },
              fields: [
                {
                  ...image('logo', 'Logo', {
                    minWidth: 400,
                    description: 'SVG, or PNG with a transparent background.',
                  }),
                  required: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      label: 'Company',
                      type: 'text',
                      required: true,
                      maxLength: 60,
                    },
                    {
                      name: 'url',
                      label: 'Website (optional)',
                      type: 'text',
                      validate: (v: unknown) =>
                        !v || (typeof v === 'string' && /^https:\/\/\S+$/.test(v))
                          ? true
                          : 'Start with https://',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'tomorrow',
          label: '4. Building tomorrow',
          fields: [
            lines('lines', 'Headline', 'One short line per row. The last line is in italic.'),
            text('card', 'Text in the white card', { max: 140, multiline: true }),
            image('image', 'Background photo', {
              minWidth: 2880,
              minHeight: 2000,
              description: 'Horizontal ≈ 3:2. Keep the top left calm: the headline sits there.',
            }),
          ],
        },
        {
          name: 'spaces',
          label: '5. Our spaces',
          fields: [
            text('title', 'Title', { max: 20 }),
            {
              name: 'items',
              label: 'Photos',
              type: 'array',
              labels: { singular: 'Photo', plural: 'Photos' },
              admin: {
                ...rowLabel('caption', 'Photo', true),
                description:
                  'Drag to change the order. Every photo is shown at the same size (4:3): click the photo to set its focal point.',
              },
              fields: [
                {
                  ...image('image', 'Photo', { minWidth: 1600 }),
                  required: true,
                },
                text('caption', 'Caption', { max: 100 }),
              ],
            },
            link('moreLink', 'Link after the arrows'),
          ],
        },
        {
          name: 'findMore',
          label: '6. Find more',
          fields: [text('title', 'Title', { max: 60 }), link('cta', 'Button')],
        },
        {
          name: 'testimonials',
          label: '7. Testimonials',
          fields: [
            text('title', 'Title', { max: 40 }),
            {
              name: 'items',
              label: 'Testimonials',
              type: 'array',
              labels: { singular: 'Testimonial', plural: 'Testimonials' },
              admin: {
                ...rowLabel('company', 'Testimonial', true),
                description: 'Only publish quotes the client agreed to. Drag to change the order.',
              },
              fields: [
                {
                  name: 'quote',
                  label: 'Quote',
                  type: 'textarea',
                  required: true,
                  maxLength: 700,
                  admin: { description: 'Word for word, in the language the client wrote it.' },
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 60 },
                    text('role', 'Job title', { max: 60, required: false }),
                    {
                      name: 'company',
                      label: 'Company',
                      type: 'text',
                      required: true,
                      maxLength: 60,
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'rating',
                      label: 'Stars',
                      type: 'select',
                      required: true,
                      defaultValue: '5',
                      options: ['5', '4', '3', '2', '1'],
                    },
                    {
                      name: 'quoteLanguage',
                      label: 'Language of the quote',
                      type: 'select',
                      required: true,
                      defaultValue: 'en',
                      options: languages,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'final',
          label: '8. Last block',
          fields: [
            lines('lines', 'Headline', 'Two short lines. The second is in italic.'),
            link('cta', 'Button'),
            image('image', 'Background photo', {
              minWidth: 2880,
              minHeight: 1720,
              description: 'Horizontal ≈ 5:3. Keep the left side calm: the headline sits there.',
            }),
          ],
        },
      ],
    },
  ],
};
