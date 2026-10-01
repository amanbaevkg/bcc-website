import type { CollectionConfig } from 'payload';
import { isAdmin, signedIn } from '../access';
import { refreshAfterChange } from '../revalidate';

/**
 * Privacy Policy and Legal Notice, written by BCC's legal adviser. Admins only.
 * The live site refuses to start until both are approved in all four languages
 * (src/instrumentation.ts).
 */
export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Legal page', plural: 'Legal pages' },
  admin: { group: 'Pages', useAsTitle: 'kind' },
  access: { read: signedIn, create: isAdmin, update: isAdmin, delete: isAdmin },
  hooks: { afterChange: refreshAfterChange },
  fields: [
    {
      name: 'kind',
      label: 'Page',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Privacy Policy', value: 'privacy' },
        { label: 'Legal Notice', value: 'legal-notice' },
      ],
    },
    { name: 'title', label: 'Title', type: 'text', localized: true, maxLength: 80 },
    {
      name: 'body',
      label: 'Text',
      type: 'richText',
      localized: true,
      admin: { description: 'Paste the approved text exactly. Never write or change it yourself.' },
    },
    { name: 'lastUpdated', label: 'Last updated', type: 'date', localized: true },
    {
      name: 'approved',
      label: 'Approved by BCC’s legal adviser (this language)',
      type: 'checkbox',
      localized: true,
    },
    { name: 'approvedBy', label: 'Approved by (name)', type: 'text', localized: true },
  ],
};
