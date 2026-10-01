import type { CollectionConfig } from 'payload';
import { signedIn } from '../access';
import { image, order, text } from '../fields';
import { refreshAfterChange } from '../revalidate';

const editable = {
  read: signedIn,
  create: signedIn,
  update: signedIn,
  delete: signedIn,
};

export const ClientLogos: CollectionConfig = {
  slug: 'client-logos',
  labels: { singular: 'Client logo', plural: 'Client logos' },
  admin: { group: 'Lists', useAsTitle: 'name', defaultColumns: ['name', 'active', 'order'] },
  defaultSort: 'order',
  access: editable,
  hooks: { afterChange: refreshAfterChange, afterDelete: refreshAfterChange },
  fields: [
    { name: 'name', label: 'Company', type: 'text', required: true, maxLength: 60 },
    {
      ...image('logo', 'Logo', {
        minWidth: 400,
        description: 'SVG, or PNG with a transparent background. Dark logo for a light background.',
      }),
      required: true,
    },
    {
      name: 'url',
      label: 'Website',
      type: 'text',
      validate: (v: unknown) =>
        !v || (typeof v === 'string' && v.startsWith('https://'))
          ? true
          : 'Must start with https://',
    },
    { name: 'active', label: 'Show on the site', type: 'checkbox', defaultValue: true },
    order,
  ],
};

export const Spaces: CollectionConfig = {
  slug: 'spaces',
  labels: { singular: 'Space photo', plural: 'Space photos' },
  admin: { group: 'Lists', useAsTitle: 'title', defaultColumns: ['title', 'category', 'order'] },
  defaultSort: 'order',
  access: editable,
  hooks: { afterChange: refreshAfterChange, afterDelete: refreshAfterChange },
  fields: [
    {
      name: 'title',
      label: 'Name in the list',
      type: 'text',
      required: true,
      admin: { description: 'Only shown here in the admin, e.g. "Meeting room".' },
    },
    {
      ...image('image', 'Photo', {
        minWidth: 1600,
        description: 'Horizontal or vertical; the gallery crops by its focal point.',
      }),
      required: true,
    },
    text('caption', 'Caption', { max: 100 }),
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        'office',
        'coworking',
        'meeting-room',
        'common-area',
        'reception',
        'parking',
        'other',
      ],
    },
    order,
  ],
};

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Testimonial', plural: 'Testimonials' },
  admin: { group: 'Lists', useAsTitle: 'company', defaultColumns: ['company', 'name', 'order'] },
  defaultSort: 'order',
  access: editable,
  hooks: { afterChange: refreshAfterChange, afterDelete: refreshAfterChange },
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
      name: 'quoteLanguage',
      label: 'Language of the quote',
      type: 'select',
      required: true,
      defaultValue: 'en',
      options: ['en', 'fr', 'de', 'lu'],
    },
    { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 60 },
    text('role', 'Role', { max: 60 }),
    { name: 'company', label: 'Company', type: 'text', required: true, maxLength: 60 },
    {
      name: 'rating',
      label: 'Rating',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'consent',
      label: 'The client agreed to publication',
      type: 'checkbox',
      admin: { description: 'Only publish testimonials the client agreed to.' },
    },
    order,
  ],
};
