import { defineArrayMember, defineField, defineType } from 'sanity';
import { assetSize, localized } from '../lib';

/** Contact page. The form and contact details come from the code and Site settings. */
export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact page',
  type: 'document',
  fields: [
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'object',
      description:
        'Shown above the last block of the contact page. Drag photos to change the order.',
      fields: [
        localized('title', 'Title', { max: 30 }),
        defineField({
          name: 'photos',
          title: 'Photos',
          type: 'array',
          of: [defineArrayMember({ type: 'imageWithAlt' })],
          options: { layout: 'grid' },
          description:
            'At least 1600 px wide, JPG or WebP. Set the hotspot: the gallery crops photos to different shapes.',
          validation: (r) => [
            r.min(1).max(40),
            r
              .custom((photos: { asset?: { _ref?: string } }[] | undefined) => {
                const small = (photos ?? []).filter((p) => {
                  const size = assetSize(p.asset?._ref);
                  return size && size.width < 1600;
                }).length;
                return small
                  ? `${small} photo(s) narrower than 1600 px; they may look soft on large screens.`
                  : true;
              })
              .warning(),
          ],
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Contact page' }) },
});
