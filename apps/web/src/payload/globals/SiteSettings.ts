import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { text } from '../fields';
import { refreshAfterChange } from '../revalidate';

/** Contact details and links shown in the header, footer and contact page. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Pages' },
  access: { read: signedIn, update: signedIn },
  versions: { drafts: false, max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    { name: 'email', label: 'Email', type: 'email', required: true },
    {
      name: 'phone',
      label: 'Phone (as displayed)',
      type: 'text',
      required: true,
      admin: { description: 'For example "(+352) 20 600 820".' },
      validate: (v: unknown) =>
        typeof v === 'string' && /^[+()\d\s-]{6,25}$/.test(v)
          ? true
          : 'Digits, spaces, + ( ) - only.',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'group',
      fields: [
        { name: 'street', label: 'Street', type: 'text', required: true },
        { name: 'postalCode', label: 'Postal code', type: 'text', required: true },
        { name: 'city', label: 'City', type: 'text', required: true },
      ],
    },
    {
      name: 'mapUrl',
      label: 'Google Maps link',
      type: 'text',
      validate: (v: unknown) =>
        !v || (typeof v === 'string' && v.startsWith('https://'))
          ? true
          : 'Must start with https://',
    },
    text('tagline', 'Footer tagline', { max: 90, required: false }),
    {
      name: 'social',
      label: 'Social links',
      type: 'array',
      fields: [
        {
          name: 'network',
          label: 'Network',
          type: 'select',
          required: true,
          options: ['linkedin', 'facebook'],
        },
        {
          name: 'url',
          label: 'Address',
          type: 'text',
          required: true,
          validate: (v: unknown) =>
            typeof v === 'string' && v.startsWith('https://') ? true : 'Must start with https://',
        },
      ],
    },
  ],
};
