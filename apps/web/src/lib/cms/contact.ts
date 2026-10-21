import 'server-only';
import { contactFallback } from '@/content/fallback/contact';
import type { ContactChoice, ContactFormTexts, ContactPage, FinderChoice } from '@/content/types';
import { compact, image, localized, type CmsLocalized, type CmsMedia } from './map';
import { readGlobal } from './payload';

type CmsChoice = {
  id?: string | null;
  label?: CmsLocalized;
  finder?: FinderChoice | 'none' | null;
  askTeamSize?: boolean | null;
};

type ContactDoc = {
  top?: Partial<Record<keyof ContactPage['top'], CmsLocalized>>;
  form?: Partial<Record<keyof ContactFormTexts, CmsLocalized>> & {
    officeTypes?: CmsChoice[] | null;
    services?: CmsChoice[] | null;
  };
  gallery?: { title?: CmsLocalized; photos?: CmsMedia[] | null };
  cta?: { title?: CmsLocalized; body?: CmsLocalized; mapButton?: CmsLocalized; image?: CmsMedia };
};

/** Each text falls back to the built-in one on its own; the gallery once it has a title and photos. */
function texts<T extends Record<string, unknown>>(
  doc: Partial<Record<keyof T, CmsLocalized>> | undefined,
  fb: T,
): T {
  const out = { ...fb };
  for (const key of Object.keys(fb) as (keyof T)[]) {
    const v = localized(doc?.[key]);
    if (v) out[key] = v as T[keyof T];
  }
  return out;
}

/** The admin's answers (rows without an English label are skipped); the built-in ones if none. */
function choices(rows: CmsChoice[] | null | undefined, fb: ContactChoice[]): ContactChoice[] {
  const out: ContactChoice[] = [];
  for (const r of rows ?? []) {
    const label = localized(r.label);
    if (!r.id || !label) continue;
    out.push({
      id: r.id,
      label,
      finder: r.finder && r.finder !== 'none' ? r.finder : undefined,
      askTeamSize: r.askTeamSize || undefined,
    });
  }
  return out.length ? out : fb;
}

export function mapContact(doc: ContactDoc | null): ContactPage {
  const fb = contactFallback;
  const title = localized(doc?.gallery?.title);
  const photos = compact((doc?.gallery?.photos ?? []).map(image));
  const { image: fbImage, ...ctaTexts } = fb.cta;
  const { officeTypes, services, ...formTexts } = fb.form;
  return {
    top: texts(doc?.top, fb.top),
    form: {
      ...texts(doc?.form, formTexts),
      officeTypes: choices(doc?.form?.officeTypes, officeTypes),
      services: choices(doc?.form?.services, services),
    },
    gallery: title && photos.length ? { title, photos } : fb.gallery,
    cta: {
      ...texts(doc?.cta as Partial<Record<keyof typeof ctaTexts, CmsLocalized>>, ctaTexts),
      image: image(doc?.cta?.image) ?? fbImage,
    },
  };
}

export async function getContactPage(): Promise<ContactPage> {
  try {
    return mapContact(await readGlobal<ContactDoc>('contact'));
  } catch (error) {
    console.error('[cms] contact page query failed, using fallback content', error);
    return contactFallback;
  }
}
