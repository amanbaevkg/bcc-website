import type { Field, GlobalConfig } from 'payload';
import { signedIn } from '../access';
import { image, rowLabel, text } from '../fields';
import { pagePreview } from '../preview';
import { refreshAfterChange } from '../revalidate';

/** "Pre-selected by the home page search": which of the search's choices selects this answer. */
const finder = (choices: { label: string; value: string }[]): Field => ({
  name: 'finder',
  label: 'Pre-selected when the home page search picks',
  type: 'select',
  defaultValue: 'none',
  options: [{ label: 'Nothing (the visitor chooses)', value: 'none' }, ...choices],
});

/** One list of answers: the form sends the row's id, the server accepts only listed answers. */
const answers = (name: string, label: string, extra: Field[], description: string): Field => ({
  name,
  label,
  type: 'array',
  minRows: 1,
  maxRows: 20,
  labels: { singular: 'Answer', plural: 'Answers' },
  admin: { description, ...rowLabel('label', 'Answer') },
  fields: [
    {
      type: 'row',
      fields: [text('label', 'Answer', { max: 40 }), ...extra],
    },
  ],
});

/**
 * Contact page, tab by tab in page order. The form's questions and answers are edited here too;
 * the phone, address and e-mail come from "Footer & contact details".
 */
export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Contact page',
  admin: {
    group: 'Website',
    description:
      'One tab per block, from the top of the page to the bottom. Phone, address and e-mail: see "Footer & contact details".',
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
              type: 'collapsible',
              label: 'The form: title, fields and button',
              admin: { initCollapsed: true },
              fields: [
                text('formTitle', 'Form title', { max: 30 }),
                {
                  type: 'row',
                  fields: [
                    text('firstName', 'First name field', { max: 25 }),
                    text('lastName', 'Last name field', { max: 25 }),
                    text('company', 'Company field', { max: 25 }),
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    text('email', 'E-mail field', { max: 25 }),
                    text('phone', 'Phone field', { max: 25 }),
                    text('messageLabel', 'Message field', { max: 25 }),
                  ],
                },
                text('submit', 'Send button', { max: 20 }),
              ],
            },
            {
              type: 'collapsible',
              label: 'Question: type of office',
              admin: { initCollapsed: true },
              fields: [
                text('officeQuestion', 'Question', { max: 70 }),
                answers(
                  'officeTypes',
                  'Answers (the visitor picks one)',
                  [
                    finder([
                      { label: 'Private offices', value: 'private-office' },
                      { label: 'Co-working', value: 'coworking' },
                    ]),
                    {
                      name: 'askTeamSize',
                      label: 'Then ask how many people',
                      type: 'checkbox',
                      defaultValue: false,
                    },
                  ],
                  'Drag to change the order. The e-mail you receive shows the English answer.',
                ),
                text('teamSizeQuestion', 'Follow-up question: how many people', {
                  max: 70,
                  description: 'Shown after an answer with "Then ask how many people" ticked.',
                }),
              ],
            },
            {
              type: 'collapsible',
              label: 'Question: services',
              admin: { initCollapsed: true },
              fields: [
                text('servicesQuestion', 'Question', { max: 70 }),
                text('servicesHint', 'Hint under the question', { max: 60 }),
                answers(
                  'services',
                  'Answers (the visitor ticks one or more)',
                  [
                    finder([
                      { label: 'Meeting rooms', value: 'meeting-room' },
                      { label: 'Domiciliation', value: 'domiciliation' },
                    ]),
                  ],
                  'Drag to change the order. The e-mail you receive shows the English answers.',
                ),
              ],
            },
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
