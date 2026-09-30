import { defineArrayMember, defineField, defineType } from 'sanity';
import { localized } from '../lib';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'contact', title: 'Contact', default: true },
    { name: 'social', title: 'Social links' },
    { name: 'seo', title: 'Search engines' },
  ],
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone (as displayed)',
      type: 'string',
      group: 'contact',
      description: 'For example "(+352) 20 600 820".',
      validation: (rule) =>
        rule
          .required()
          .regex(/^[+()\d\s-]{6,25}$/, { name: 'phone' })
          .error('Digits, spaces, +, ( ) and - only.'),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({
          name: 'street',
          title: 'Street',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'postalCode',
          title: 'Postal code',
          type: 'string',
          validation: (r) => r.required(),
        }),
        defineField({
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (r) => r.required(),
        }),
      ],
    }),
    defineField({
      name: 'mapUrl',
      title: 'Google Maps link',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      type: 'array',
      group: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'hours',
          fields: [
            localized('days', 'Days', { max: 40, description: 'For example "Monday–Friday".' }),
            defineField({
              name: 'time',
              title: 'Time',
              type: 'string',
              description: 'For example "08:30–18:00".',
              validation: (r) => r.required().max(30),
            }),
          ],
          preview: { select: { title: 'time' } },
        }),
      ],
    }),
    localized('tagline', 'Footer tagline', { max: 90, group: 'contact' }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'array',
      group: 'social',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({
              name: 'network',
              type: 'string',
              options: { list: ['linkedin', 'facebook', 'instagram', 'youtube', 'x'] },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              type: 'url',
              validation: (r) => r.required().uri({ scheme: ['https'] }),
            }),
          ],
          preview: { select: { title: 'network', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'seo', title: 'Default search settings', type: 'seo', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
