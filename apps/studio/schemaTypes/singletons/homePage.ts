import { defineArrayMember, defineField, defineType } from 'sanity';
import { image, localized } from '../lib';

/**
 * The home page. The order and look of the sections are fixed in the website code;
 * here editors change only what the sections say and show.
 */
const offer = (name: string, title: string, photos: string) =>
  defineField({
    name,
    title,
    type: 'object',
    group: 'offers',
    fields: [
      localized('title', 'Title', { max: 40 }),
      defineField({
        name: 'href',
        title: 'Title links to',
        type: 'string',
        initialValue: '/services',
        validation: (r) => r.required(),
      }),
      defineField({
        name: 'body',
        title: 'Text',
        type: 'localizedBlock',
        description: 'Up to about 400 characters. Use bold for the key phrases.',
      }),
      defineField({
        name: 'images',
        title: 'Photos',
        type: 'array',
        description: photos,
        of: [defineArrayMember({ type: 'imageWithAlt' })],
        validation: (r) => r.max(2),
      }),
    ],
  });

export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'offers', title: 'Offices' },
    { name: 'trust', title: 'Clients' },
    { name: 'spaces', title: 'Spaces' },
    { name: 'closing', title: 'Closing sections' },
    { name: 'seo', title: 'Search engines' },
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        localized('eyebrow', 'Small line above the title', { max: 60 }),
        localized('title', 'Title', { max: 60 }),
        localized('titleAccent', 'Words of the title in italic', {
          max: 30,
          required: false,
          description: 'Must appear at the end of the title, e.g. "Capellen".',
        }),
        localized('subtitle', 'Subtitle', { max: 120 }),
        defineField({
          name: 'video',
          title: 'Background video',
          type: 'object',
          description:
            'Horizontal 16:9, 30–60 s, seamless loop, no sound, H.264 MP4. Keep the centre calm: the title sits there.',
          fields: [
            defineField({
              name: 'mp4_1080',
              title: 'Video 1080p (desktop)',
              type: 'file',
              options: { accept: 'video/mp4' },
              description: '1920×1080, under 15 MB.',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'mp4_720',
              title: 'Video 720p (tablets)',
              type: 'file',
              options: { accept: 'video/mp4' },
              description: '1280×720, under 8 MB.',
            }),
            defineField({
              name: 'mp4_480',
              title: 'Video 480p (phones)',
              type: 'file',
              options: { accept: 'video/mp4' },
              description: '854×480, under 4 MB.',
            }),
            image('poster', 'Poster (first frame)', {
              minWidth: 1920,
              minHeight: 1080,
              description:
                'Shown while the video loads, on slow connections and for visitors who turn off motion.',
            }),
          ],
        }),
        defineField({
          name: 'workspaceTypes',
          title: 'Workspace choices',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'workspaceType',
              fields: [
                defineField({
                  name: 'id',
                  title: 'Code',
                  type: 'string',
                  description:
                    'Sent with the enquiry, e.g. "private-office". Do not change once in use.',
                  validation: (r) => r.required().regex(/^[a-z0-9-]+$/),
                }),
                localized('name', 'Name', { max: 30 }),
                defineField({
                  name: 'hasTeamSize',
                  title: 'Ask for team size',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
              preview: { select: { title: 'id' } },
            }),
          ],
          validation: (r) => r.required().min(1).max(8),
        }),
        defineField({
          name: 'teamSizes',
          title: 'Team sizes offered',
          type: 'array',
          of: [{ type: 'number' }],
          validation: (r) => r.max(10),
        }),
        defineField({ name: 'cta', title: 'Button', type: 'link' }),
        defineField({ name: 'ring', title: 'Round "Work with us" link', type: 'link' }),
      ],
    }),

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
    defineField({ name: 'servicesLink', title: 'Services link', type: 'link', group: 'offers' }),

    defineField({
      name: 'trust',
      title: 'They trust us',
      type: 'object',
      group: 'trust',
      fields: [
        localized('title', 'Title', { max: 30 }),
        defineField({
          name: 'clients',
          title: 'Client logos',
          type: 'array',
          description: 'Leave empty to show all active client logos in their set order.',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'clientLogo' }] })],
        }),
      ],
    }),

    defineField({
      name: 'tomorrow',
      title: 'Building tomorrow’s now',
      type: 'object',
      group: 'closing',
      fields: [
        defineField({
          name: 'lines',
          title: 'Headline lines',
          type: 'array',
          description: 'Two or three short lines. The last line is set in italic.',
          of: [{ type: 'internationalizedArrayString' }],
          validation: (r) => r.required().min(1).max(3),
        }),
        localized('card', 'Card text', { max: 140, multiline: true }),
        image('image', 'Background photo', {
          minWidth: 2880,
          minHeight: 2000,
          description: 'Horizontal ≈ 3:2. Keep the top left calm: the headline sits there.',
        }),
      ],
    }),

    defineField({
      name: 'spaces',
      title: 'Our spaces',
      type: 'object',
      group: 'spaces',
      fields: [
        localized('title', 'Title', { max: 20 }),
        defineField({
          name: 'items',
          title: 'Photos',
          type: 'array',
          description:
            'Any number; the layout repeats every six photos. Leave empty to show all spaces.',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'space' }] })],
        }),
        defineField({ name: 'moreLink', title: 'Link after the arrows', type: 'link' }),
      ],
    }),

    defineField({
      name: 'findMore',
      title: 'Find more',
      type: 'object',
      group: 'closing',
      fields: [
        localized('title', 'Title', { max: 60 }),
        defineField({ name: 'cta', title: 'Button', type: 'link' }),
      ],
    }),

    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'object',
      group: 'closing',
      fields: [
        localized('title', 'Title', { max: 40 }),
        defineField({
          name: 'items',
          title: 'Testimonials',
          type: 'array',
          description: 'Leave empty to show all testimonials in their set order.',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'testimonial' }] })],
        }),
      ],
    }),

    defineField({
      name: 'final',
      title: 'Final call to action',
      type: 'object',
      group: 'closing',
      fields: [
        defineField({
          name: 'lines',
          title: 'Headline lines',
          type: 'array',
          description: 'Two short lines. The second is set in italic.',
          of: [{ type: 'internationalizedArrayString' }],
          validation: (r) => r.required().min(1).max(2),
        }),
        defineField({ name: 'cta', title: 'Button', type: 'link' }),
        image('image', 'Background photo', {
          minWidth: 2880,
          minHeight: 1720,
          description: 'Horizontal ≈ 5:3. Keep the left side calm: the headline sits there.',
        }),
      ],
    }),

    defineField({ name: 'seo', title: 'Search engines', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
});
