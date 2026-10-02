import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { image, text } from '../fields';
import { pagePreview } from '../preview';
import { refreshAfterChange } from '../revalidate';

/**
 * Contact page, tab by tab in page order. The form's questions stay in the code (the server
 * checks the answers); the phone, address and e-mail come from "Address, phone & e-mail".
 */
export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact page',
  admin: {
    group: 'Website',
    description:
      'One tab per block, from the top of the page to the bottom. Phone, address and e-mail: see "Address, phone & e-mail".',
    preview: pagePreview('/contact'),
  },
  access: { read: signedIn, update: signedIn },
  versions: { max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'top',
          label: '1. Top',
          fields: [
            text('eyebrow', 'Small label', { max: 30 }),
            text('title', 'Title', { max: 40 }),
            text('subtitle', 'Subtitle (in italic)', { max: 60 }),
            {
              type: 'row',
              fields: [
                text('callUs', 'Phone card title', { max: 30 }),
                text('visitUs', 'Address card title', { max: 30 }),
                text('writeUs', 'E-mail card title', { max: 30 }),
              ],
            },
          ],
        },
        {
          name: 'form',
          label: '2. Form',
          fields: [
            text('title', 'Title next to the form', { max: 60 }),
            text('body', 'Text next to the form', { max: 240, multiline: true }),
            {
              type: 'row',
              fields: [
                text('successTitle', 'After sending: title', { max: 40 }),
                text('successBody', 'After sending: text', { max: 160, multiline: true }),
              ],
            },
          ],
        },
        {
          name: 'gallery',
          label: '3. Photo gallery',
          fields: [
            text('title', 'Title', { max: 30 }),
            {
              name: 'photos',
              label: 'Photos',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              maxRows: 40,
              filterOptions: { mimeType: { contains: 'image' } },
              admin: {
                description:
                  'Drag to change the order. JPG or WebP, 1600 px wide or larger. Click a photo to set its focal point: the gallery crops photos to different shapes.',
              },
            },
          ],
        },
        {
          name: 'cta',
          label: '4. Last block',
          fields: [
            text('title', 'Title', { max: 60 }),
            text('body', 'Text', { max: 120 }),
            text('mapButton', 'Map button text', {
              max: 30,
              description: 'The other button shows the phone number.',
            }),
            image('image', 'Background photo', {
              minWidth: 2880,
              minHeight: 1720,
              description: 'Horizontal ≈ 5:3. Keep the left side calm: the title sits there.',
            }),
          ],
        },
      ],
    },
  ],
};
