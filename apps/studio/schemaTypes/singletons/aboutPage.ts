import { defineArrayMember, defineField, defineType } from 'sanity';
import { image, localized } from '../lib';

/** About Us. Layout is fixed in the website code; editors change the words and photos. */
export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Us page',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Intro', default: true },
    { name: 'facts', title: 'Highlights & figures' },
    { name: 'features', title: 'Turnkey & Vision' },
    { name: 'visit', title: 'Visit' },
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
        localized('titleAccent', 'End of the title in italic', {
          max: 40,
          required: false,
          description: 'Must be the last words of the title.',
        }),
        localized('body', 'Text', { max: 300, multiline: true }),
        image('image', 'Wide photo', {
          minWidth: 2400,
          minHeight: 1200,
          description: 'Horizontal, about 2:1.',
        }),
      ],
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      type: 'array',
      group: 'facts',
      description: 'Three to seven short points.',
      of: [defineArrayMember({ type: 'localizedLine' })],
      validation: (r) => r.max(7),
    }),
    localized('location', 'Location sentence', { max: 160, group: 'facts' }),
    localized('audience', 'Who it is for', { max: 200, multiline: true, group: 'facts' }),
    defineField({
      name: 'figures',
      title: 'Figures',
      type: 'array',
      group: 'facts',
      validation: (r) => r.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'figure',
          fields: [
            defineField({
              name: 'value',
              title: 'Number',
              type: 'string',
              description: 'For example "20+".',
              validation: (r) => r.required().max(8),
            }),
            localized('label', 'Label', { max: 40 }),
          ],
          preview: { select: { title: 'value' } },
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      group: 'features',
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'feature',
          fields: [
            localized('title', 'Title', { max: 40 }),
            localized('body', 'Text', { max: 240, multiline: true }),
            localized('note', 'Highlighted note', { max: 300, multiline: true, required: false }),
            image('image', 'Photo', { minWidth: 1200, description: 'Tall or horizontal.' }),
            defineField({ name: 'cta', title: 'Button (optional)', type: 'link' }),
          ],
          preview: { select: { title: 'title.0.value', media: 'image' } },
        }),
      ],
    }),
    defineField({
      name: 'visit',
      title: 'Visit call to action',
      type: 'object',
      group: 'visit',
      fields: [
        localized('eyebrow', 'Small label', { max: 40 }),
        localized('title', 'Title', { max: 60 }),
        defineField({ name: 'cta', title: 'Button', type: 'link' }),
        image('image', 'Background photo', { minWidth: 2400, description: 'Horizontal.' }),
      ],
    }),
    defineField({ name: 'seo', title: 'Search engines', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'About Us page' }) },
});
