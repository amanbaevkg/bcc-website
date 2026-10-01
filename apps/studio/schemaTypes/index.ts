import { clientLogo, legalPage, newsPost, space, testimonial } from './documents/collections';
import { imageWithAlt, link, localizedBlock, localizedLine, richText, seo } from './objects';
import { aboutPage } from './singletons/aboutPage';
import { contactPage } from './singletons/contactPage';
import { homePage } from './singletons/homePage';
import { servicesPage } from './singletons/servicesPage';
import { siteSettings } from './singletons/siteSettings';

export const schemaTypes = [
  imageWithAlt,
  link,
  seo,
  richText,
  localizedBlock,
  localizedLine,
  siteSettings,
  homePage,
  aboutPage,
  servicesPage,
  contactPage,
  clientLogo,
  space,
  testimonial,
  newsPost,
  legalPage,
];

/** Documents that exist once. They cannot be created or deleted from the Studio. */
export const singletonTypes = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'servicesPage',
  'contactPage',
]);

/** Documents with one version per language, linked as translations. */
export const translatedTypes = ['newsPost', 'legalPage'];
