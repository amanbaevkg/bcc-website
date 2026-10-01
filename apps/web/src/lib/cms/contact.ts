import 'server-only';
import { contactFallback } from '@/content/fallback/contact';
import type { ContactPage } from '@/content/types';
import { compact, image, localized, type SanityImage, type SanityLocalized } from './map';
import { sanityFetch } from './sanity';

type ContactDoc = { gallery?: { title?: SanityLocalized; photos?: SanityImage[] } };

/** The CMS gallery replaces the built-in one once it has a title and at least one photo. */
export function mapContact(doc: ContactDoc | null): ContactPage {
  const fb = contactFallback;
  const title = localized(doc?.gallery?.title);
  const photos = compact((doc?.gallery?.photos ?? []).map(image));
  return { gallery: title && photos.length ? { title, photos } : fb.gallery };
}

export async function getContactPage(): Promise<ContactPage> {
  try {
    return mapContact(
      await sanityFetch<ContactDoc>(
        `*[_id == "contactPage"][0]{ gallery { title, photos[] { alt, hotspot, asset->{ url, metadata { dimensions } } } } }`,
      ),
    );
  } catch (error) {
    console.error('[cms] contact page query failed, using fallback content', error);
    return contactFallback;
  }
}
