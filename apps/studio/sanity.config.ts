import { documentInternationalization } from '@sanity/document-internationalization';
import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { internationalizedArray } from 'sanity-plugin-internationalized-array';
import { structureTool } from 'sanity/structure';
import { languages } from './schemaTypes/languages';
import { schemaTypes, singletonTypes, translatedTypes } from './schemaTypes';

// Public identifiers, not secrets. Set them in apps/studio/.env (see .env.example).
// Public identifier of BCC's Sanity project (not a secret); override with SANITY_STUDIO_PROJECT_ID.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || '8bx4pgzw';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'bcc',
  title: 'Business Center Capellen',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('About Us page')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Our Services page')
              .id('servicesPage')
              .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
            S.listItem()
              .title('Contact page')
              .id('contactPage')
              .child(S.document().schemaType('contactPage').documentId('contactPage')),
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => !singletonTypes.has(item.getId() ?? '')),
          ]),
    }),
    internationalizedArray({
      languages,
      defaultLanguages: ['en'],
      fieldTypes: ['string', 'text'],
    }),
    documentInternationalization({
      supportedLanguages: languages,
      schemaTypes: translatedTypes,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    // Singletons cannot be created from the "new document" menu.
    templates: (templates) => templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  document: {
    // Singletons cannot be duplicated or deleted.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(
            ({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action),
          )
        : input,
  },
});
