import type { GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { text } from '../fields';
import { pagePreview } from '../preview';
import { refreshAfterChange } from '../revalidate';

/** Contact page. The form comes from the code; contact details from "Address, phone & e-mail". */
export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact page',
  admin: { group: 'Website', preview: pagePreview('/contact') },
  access: { read: signedIn, update: signedIn },
  versions: { max: 50 },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      name: 'gallery',
      label: 'Photo gallery',
      type: 'group',
      admin: {
        description: 'Shown at the end of the contact page. Drag photos to change the order.',
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
          filterOptions: { mimeType: { contains: 'image' } },
          admin: {
            description:
              'JPG or WebP, 1600 px wide or larger. Click a photo to set its focal point: the gallery crops photos to different shapes.',
          },
        },
      ],
    },
  ],
};
