import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { text } from '../fields';
import { refreshAfterChange } from '../revalidate';

/** Contact page. The form and contact details come from the code and Site settings. */
export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact page',
  admin: { group: 'Pages' },
  access: { read: signedIn, update: signedIn },
  versions: { drafts: true, max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      name: 'gallery',
      label: 'Photo gallery',
      type: 'group',
      admin: {
        description: 'Shown above the last block of the contact page. Drag photos to reorder.',
      },
      fields: [
        text('title', 'Title', { max: 30 }),
        {
          name: 'photos',
          label: 'Photos',
          type: 'upload',
          relationTo: 'media',
          hasMany: true,
          maxRows: 40,
          admin: {
            description:
              'At least 1600 px wide, JPG or WebP. Set the focal point: the gallery crops photos to different shapes.',
          },
        },
      ],
    },
  ],
};
