import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { text } from '../fields';

const footerText = (name: string, label: string, max: number, description?: string) =>
  text(name, label, { max, description });
import { refreshAfterChange } from '../revalidate';

/** Contact details (header, footer, contact page) and the footer's texts. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Footer & contact details',
  admin: {
    group: 'Website',
    description:
      'Phone, e-mail and address appear in the header, the footer and on the contact page.',
  },
  access: { read: signedIn, update: signedIn },
  versions: { max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '1. Contact details',
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
                {
                  type: 'row',
                  fields: [
                    { name: 'street', label: 'Street', type: 'text', required: true },
                    { name: 'postalCode', label: 'Postal code', type: 'text', required: true },
                    { name: 'city', label: 'City', type: 'text', required: true },
                  ],
                },
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
                  options: [
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Facebook', value: 'facebook' },
                  ],
                },
                {
                  name: 'url',
                  label: 'Address',
                  type: 'text',
                  required: true,
                  validate: (v: unknown) =>
                    typeof v === 'string' && v.startsWith('https://')
                      ? true
                      : 'Must start with https://',
                },
              ],
            },
          ],
        },
        {
          name: 'footer',
          label: '2. Footer texts',
          fields: [
            footerText('tagline', 'Large sentence at the top of the footer', 90),
            {
              type: 'row',
              fields: [
                footerText('getInTouch', 'Column title: contact', 30),
                footerText('quickLinks', 'Column title: links', 30),
                footerText('follow', 'Column title: social', 30),
              ],
            },
            {
              type: 'row',
              fields: [
                footerText('address', 'Column title: address', 30),
                footerText('language', 'Column title: languages', 30),
                footerText('openMap', 'Map link text', 40),
              ],
            },
            footerText(
              'rights',
              'Copyright line',
              160,
              'The year is added in front automatically, e.g. "©2026. ".',
            ),
          ],
        },
      ],
    },
  ],
};
