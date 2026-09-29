/**
 * Fallback site details, copied from businesscentercapellen.lu.
 * Used until the Sanity "Site settings" document exists; the CMS then overrides them.
 */
export const siteFallback = {
  name: 'Business Center Capellen',
  shortName: 'BCC',
  email: 'info@bcc-lux.eu',
  phone: { display: '(+352) 20 600 820', href: 'tel:+35220600820' },
  address: {
    street: "77, route d'Arlon",
    postalCode: 'L-8311',
    city: 'Capellen',
    countryCode: 'LU',
  },
  mapUrl: 'https://maps.google.com/maps?q=business%20center%20capellen',
  social: [
    { network: 'linkedin', url: 'https://www.linkedin.com/company/business-center-capellen/' },
    {
      network: 'facebook',
      url: 'https://www.facebook.com/people/BCC-Business-Center-Capellen/61560335773376/',
    },
  ],
} as const;

export type SocialNetwork = (typeof siteFallback.social)[number]['network'];
