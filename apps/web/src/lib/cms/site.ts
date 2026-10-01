import 'server-only';
import { siteFallback } from '@/content/site';
import type { Localized } from '@/content/types';
import { localized, type CmsLocalized } from './map';
import { readGlobal } from './payload';

/** Contact details and social links; the CMS "Site settings" override the built-in values. */
export type SiteInfo = {
  name: string;
  shortName: string;
  email: string;
  phone: { display: string; href: string };
  address: { street: string; postalCode: string; city: string; countryCode: string };
  mapUrl: string;
  social: { network: 'linkedin' | 'facebook'; url: string }[];
  tagline?: Localized;
};

type SettingsDoc = {
  email?: string | null;
  phone?: string | null;
  address?: { street?: string | null; postalCode?: string | null; city?: string | null };
  mapUrl?: string | null;
  social?: { network?: string | null; url?: string | null }[] | null;
  tagline?: CmsLocalized;
};

const known = ['linkedin', 'facebook'] as const;

export function mapSite(doc: SettingsDoc | null): SiteInfo {
  const fb: SiteInfo = { ...siteFallback, social: [...siteFallback.social] };
  if (!doc) return fb;
  const phone = doc.phone?.trim();
  const social = (doc.social ?? [])
    .filter(
      (s): s is { network: (typeof known)[number]; url: string } =>
        known.includes(s.network as (typeof known)[number]) && !!s.url?.startsWith('https://'),
    )
    .map((s) => ({ network: s.network, url: s.url }));
  return {
    ...fb,
    email: doc.email?.trim() || fb.email,
    phone: phone ? { display: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` } : fb.phone,
    address:
      doc.address?.street && doc.address.postalCode && doc.address.city
        ? {
            street: doc.address.street,
            postalCode: doc.address.postalCode,
            city: doc.address.city,
            countryCode: 'LU',
          }
        : fb.address,
    mapUrl: doc.mapUrl?.startsWith('https://') ? doc.mapUrl : fb.mapUrl,
    social: social.length ? social : fb.social,
    tagline: localized(doc.tagline),
  };
}

export async function getSiteInfo(): Promise<SiteInfo> {
  try {
    return mapSite(await readGlobal<SettingsDoc>('site-settings', 0));
  } catch (error) {
    console.error('[cms] site settings query failed, using built-in details', error);
    return mapSite(null);
  }
}
