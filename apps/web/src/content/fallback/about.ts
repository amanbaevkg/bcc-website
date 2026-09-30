import type { AboutPage } from '../types';

/**
 * About Us content, copied from businesscentercapellen.lu/about-us (typos corrected).
 * FR/DE/LU are added in the translation stage.
 */
const img = (src: string, width: number, height: number, alt: string) => ({
  src,
  width,
  height,
  alt: { en: alt },
});

export const aboutFallback: AboutPage = {
  hero: {
    eyebrow: { en: 'About Us' },
    title: { en: 'Your business evolves, your office should too.' },
    titleAccent: { en: 'your office should too.' },
    body: {
      en: 'At Business Center Capellen, flexibility isn’t an extra, it’s our foundation. Whether you’re expanding, downsizing, or launching your venture, our spaces adapt to your pace.',
    },
    image: img(
      '/media/hero/hero-poster.jpg',
      1920,
      1080,
      'Business Center Capellen buildings on route d’Arlon',
    ),
  },
  highlights: [
    { en: 'No long-term commitment' },
    { en: 'Month-to-month contracts' },
    { en: 'Fully equipped offices & co-working spaces' },
    { en: '24/7 secure badge access' },
    { en: 'High-speed internet, parking & concierge service' },
  ],
  location: {
    en: 'Based in Capellen, a few minutes from Luxembourg City and the Belgian border.',
  },
  audience: {
    en: 'Perfect for entrepreneurs, freelancers, and small teams who want to stay lean, agile, and focused on growth.',
  },
  figures: [
    { value: '1–8', label: { en: 'Offices for 1 to 8 people' } },
    { value: '20+', label: { en: 'Parking spaces available' } },
  ],
  features: [
    {
      title: { en: 'Turnkey solution' },
      body: { en: 'Our office spaces are designed to comply with Luxembourg regulations.' },
      note: {
        en: 'Included: desk(s), chair(s), coat rack, high-speed Wi-Fi, locked cupboard with company name, drawer cabinet(s) on castors, and access to parking.',
      },
      image: img(
        '/images/home/office-tall.jpg',
        1200,
        1935,
        'Bright furnished office with white desks, acoustic dividers and black office chairs',
      ),
    },
    {
      title: { en: 'Vision' },
      body: {
        en: 'Benefit from the services and facilities you need to create a productive and pleasant working environment.',
      },
      image: img(
        '/images/home/space-meeting-room.jpg',
        1600,
        1200,
        'Modern meeting room with a conference table, a projector and bluish lighting',
      ),
      cta: { label: { en: 'Get a Quote' }, href: '/contact' },
    },
  ],
  visit: {
    eyebrow: { en: 'Come to visit us' },
    title: { en: 'Discover your future office' },
    cta: { label: { en: 'Schedule a visit' }, href: '/contact' },
    image: img(
      '/images/home/space-lounge.jpg',
      1280,
      853,
      'Lounge and meeting room with table football, TV and a large table',
    ),
  },
};
