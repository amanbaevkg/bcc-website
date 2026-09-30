import type { ServicesPage } from '../types';

/**
 * Our Services content, copied from businesscentercapellen.lu/about-us#services (typos corrected).
 * FR/DE/LU are added in the translation stage.
 */
export const servicesFallback: ServicesPage = {
  hero: {
    eyebrow: { en: 'Our Services' },
    title: { en: 'Flexible packages to suit your needs.' },
    body: [
      { en: 'We believe flexibility isn’t a bonus, it’s the standard.' },
      { en: 'We are dedicated to providing simple and effective solutions.' },
    ],
  },
  choose: {
    title: { en: 'Choose your “player”' },
    coworking: {
      title: { en: 'Co-Working Space' },
      kicker: { en: 'Company Domiciliation' },
      body: {
        en: [
          { strong: 'Grow your business' },
          ' from a place that feels right. Our coworking spaces give you a ',
          { strong: 'real business address' },
          ', flexible offices, and a community that inspires you to do more.',
        ],
      },
      packages: { en: 'From basic to all-inclusive packages, you decide.' },
      highlight: {
        en: 'Enjoy a pleasant, welcoming workspace at a very attractive price, less than 15 minutes from the centre of Luxembourg.',
      },
      audience: { en: 'Perfect for entrepreneurs, freelancers…' },
      cta: { label: { en: 'Ask for information' }, href: '/contact?workspace=coworking' },
      image: {
        src: '/images/home/cowork-wide.jpg',
        width: 2000,
        height: 1600,
        alt: {
          en: 'Co-working space with white desks, grey acoustic dividers and black office chairs',
        },
      },
    },
    privateOffices: {
      title: { en: 'Private Offices' },
      sizes: [1, 2, 3, 4, 6, 8],
      sizeNote: { en: 'Furnished or unfurnished' },
      image: {
        src: '/images/home/office-detail.jpg',
        width: 900,
        height: 900,
        alt: { en: 'Office desks with the BCC roll-up banner' },
      },
    },
  },
  offers: {
    title: { en: 'What we offer' },
    items: [
      {
        icon: 'wifi',
        title: { en: 'Professional-quality Wi-Fi' },
        body: { en: 'Included in the monthly rental charge.' },
      },
      {
        icon: 'reception',
        title: { en: 'Reception & Switchboard' },
        body: { en: 'Included in the monthly rental charge.' },
      },
      {
        icon: 'meeting',
        title: { en: 'Meeting rooms' },
        body: {
          en: 'Take advantage of our meeting rooms for in-house meetings or to welcome your customers and suppliers.',
        },
      },
      {
        icon: 'kitchen',
        title: { en: 'Cafeteria & Kitchen' },
        body: { en: 'Access to the kitchenette is included in the monthly rental.' },
      },
      {
        icon: 'supplies',
        title: { en: 'Office supplies' },
        body: {
          en: 'Take advantage of our central purchasing group for office supplies. Consumption is rebilled with the monthly rental payment.',
        },
      },
      {
        icon: 'parking',
        title: { en: 'Parking spaces' },
        body: {
          en: 'Free parking available at the rear of the building. Supplement for a reserved, named parking space.',
        },
      },
      {
        icon: 'cloud',
        title: { en: 'Cloud services' },
        body: {
          en: 'BCC, in partnership with Cloud Power Luxembourg, offers its tenants the possibility of using a private cloud for their IT infrastructure and virtual desktop. Pricing is monthly, according to need.',
        },
      },
      {
        icon: 'mail',
        title: { en: 'Mail room' },
        body: {
          en: 'BCC offers a mail opening, digitisation and emailing service for all your incoming mail. Pricing is based on volume.',
        },
      },
      {
        icon: 'handshake',
        title: { en: 'Accounting, Legal & HR' },
        body: { en: 'Additional cost depending on requirements.' },
      },
      {
        icon: 'more',
        title: { en: 'Additional services' },
        body: { en: 'Additional cost depending on requirements.' },
      },
    ],
  },
  cta: {
    title: { en: 'Ready to take your business to the next level?' },
    link: { label: { en: 'Contact Us' }, href: '/contact' },
  },
};
