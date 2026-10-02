import type { GeneratePreviewURL } from 'payload';

const LOCALES = ['en', 'fr', 'de', 'lu'];

/** The "Preview" button opens the saved page on the site, in the language being edited. */
export const pagePreview =
  (path: string): GeneratePreviewURL =>
  (_doc, { locale }) => {
    const site = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
    return `${site}/${LOCALES.includes(locale) ? locale : 'en'}${path}`;
  };
