import {
  clientLogo,
  legalPage,
  newsPost,
  service,
  space,
  testimonial,
} from './documents/collections';
import { imageWithAlt, link, localizedBlock, richText, seo } from './objects';
import { homePage } from './singletons/homePage';
import { siteSettings } from './singletons/siteSettings';

export const schemaTypes = [
  imageWithAlt,
  link,
  seo,
  richText,
  localizedBlock,
  siteSettings,
  homePage,
  clientLogo,
  space,
  testimonial,
  service,
  newsPost,
  legalPage,
];

/** Documents that exist once. They cannot be created or deleted from the Studio. */
export const singletonTypes = new Set(['siteSettings', 'homePage']);

/** Documents with one version per language, linked as translations. */
export const translatedTypes = ['service', 'newsPost', 'legalPage'];
