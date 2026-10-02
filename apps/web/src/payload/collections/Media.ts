import path from 'node:path';
import type { CollectionConfig } from 'payload';
import { anyone, signedIn } from '../access';
import { text } from '../fields';
import { refreshAfterChange } from '../revalidate';

/** Photos, logos and the hero videos. Files are kept on the server in PAYLOAD_MEDIA_DIR. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'File', plural: 'Photo library' },
  admin: {
    group: 'Settings',
    useAsTitle: 'filename',
    description: 'Photos, logos, icons and videos used on the site.',
  },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  hooks: { afterChange: refreshAfterChange },
  upload: {
    staticDir: process.env.PAYLOAD_MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4'],
    focalPoint: true,
    crop: false,
  },
  fields: [
    text('alt', 'Alternative text', {
      max: 160,
      required: false,
      description:
        'Describe what the photo shows, for screen readers and search engines. Not needed for videos.',
    }),
  ],
};
