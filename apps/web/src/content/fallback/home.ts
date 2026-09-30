import type { HomePage } from '../types';

/**
 * Home page content used until the Sanity "Home page" document exists.
 * Every text is copied word for word from businesscentercapellen.lu (see the approved mockup).
 * FR/DE/LU are added in the translation stage; until then those pages show the English text.
 */
const img = (
  src: string,
  width: number,
  height: number,
  alt: string,
  hotspot?: { x: number; y: number },
) => ({
  src: `/images/home/${src}`,
  width,
  height,
  alt: { en: alt },
  hotspot,
});

export const homeFallback: HomePage = {
  hero: {
    eyebrow: { en: "77, route d'Arlon · L-8311 Capellen" },
    title: { en: 'Business Center Capellen' },
    titleAccent: { en: 'Capellen' },
    subtitle: { en: 'Your trusted partner for office rentals in Capellen (Luxembourg)' },
    video: {
      sources: [
        { src: '/media/hero/hero-1080.mp4', height: 1080, type: 'video/mp4' },
        { src: '/media/hero/hero-720.mp4', height: 720, type: 'video/mp4' },
        { src: '/media/hero/hero-480.mp4', height: 480, type: 'video/mp4' },
      ],
      poster: {
        src: '/media/hero/hero-poster.jpg',
        width: 1920,
        height: 1080,
        alt: { en: '' },
      },
    },
    workspaceTypes: [
      { id: 'private-office', name: { en: 'Private Offices' }, hasTeamSize: true },
      { id: 'coworking', name: { en: 'Co-Working Space' }, hasTeamSize: false },
      { id: 'meeting-room', name: { en: 'Meeting Rooms' }, hasTeamSize: false },
      { id: 'domiciliation', name: { en: 'Company Domiciliation' }, hasTeamSize: false },
    ],
    teamSizes: [1, 2, 3, 4, 6, 8],
    cta: { label: { en: 'Get a Quote' }, href: '/contact' },
    ring: { label: { en: 'Work with us' }, href: '/contact' },
  },

  coworking: {
    title: { en: 'Co-Working Offices' },
    href: '/services',
    body: {
      en: [
        { strong: 'Grow your business' },
        ' from a place that feels right. Our coworking spaces give you a ',
        { strong: 'real business address' },
        ', flexible offices, and a community that inspires you to do more. ',
        { strong: 'From basic to all-inclusive packages, you decide' },
        '.',
      ],
    },
    images: [
      img(
        'cowork-wide.jpg',
        2000,
        1600,
        'Co-working space with white desks, grey acoustic dividers and black office chairs',
      ),
      img(
        'cowork-small.jpg',
        1100,
        1158,
        'Common room with a long black table and a table football game',
        { x: 0.5, y: 0.18 },
      ),
    ],
  },

  privateOffices: {
    title: { en: 'Private Offices' },
    href: '/services',
    body: {
      en: [
        { strong: 'Your Private Space with no hidden fees' },
        '. We believe flexibility isn’t a bonus ➡️ it’s the standard.',
      ],
    },
    images: [
      img(
        'office-tall.jpg',
        1200,
        1935,
        'Bright furnished office with white desks, acoustic dividers and black office chairs',
      ),
      img('office-detail.jpg', 900, 900, 'Office desks with the BCC roll-up banner'),
    ],
  },

  servicesLink: { label: { en: 'Discover Our Services' }, href: '/services' },

  trust: {
    title: { en: 'They trust us' },
    clients: [
      ['CyHeadIT', 'cyheadit'],
      ['KVSmart', 'kvsmart'],
      ['BeddeleemLux', 'beddeleem'],
      ['Cloud Power', 'cloudpower'],
      ['IPCGroupe', 'ipc'],
      ['Turaco Solutions', 'turaco'],
      ['Zementol', 'zementol'],
    ].map(([name, file]) => ({
      name,
      logo: { src: `/images/clients/${file}.png`, width: 196, height: 59, alt: { en: name } },
    })),
  },

  tomorrow: {
    lines: { en: ['BUILDING', 'TOMORROW’S', 'NOW'] },
    card: {
      en: 'Setting Up Your Business in Capellen (Luxembourg): Combine Legal Compliance with Flexible Workspaces',
    },
    image: img(
      'building.jpg',
      1800,
      1268,
      'Business Center Capellen building with the Bloc C sign',
    ),
  },

  spaces: {
    title: { en: 'OUR SPACES' },
    moreLink: { label: { en: 'About Us' }, href: '/about' },
    items: [
      {
        image: img(
          'space-meeting-room.jpg',
          1600,
          1200,
          'Modern meeting room with a conference table, a projector and bluish lighting',
        ),
        caption: { en: 'Meeting room' },
      },
      {
        image: img(
          'space-mailroom.jpg',
          1086,
          1395,
          'Mail shelves and tenant directory in the reception hall',
        ),
        caption: { en: 'Mailroom' },
      },
      {
        image: img(
          'space-reception.jpg',
          805,
          1086,
          'Reception hall of Business Center Capellen, Bloc C',
        ),
        caption: { en: 'Reception hall, Bloc C' },
      },
      {
        image: img(
          'space-lounge.jpg',
          1280,
          853,
          'Lounge and meeting room with table football, TV and a large table',
        ),
        caption: { en: 'Lounge and meeting room' },
      },
      {
        image: img(
          'space-parking.jpg',
          1448,
          965,
          'Parking spaces in front of the Business Center Capellen building',
        ),
        caption: { en: 'Private parking' },
      },
      {
        image: img(
          'space-kitchen.jpg',
          1007,
          1280,
          'Shared kitchen with microwave, coffee machine and dishwasher',
        ),
        caption: { en: 'Common area' },
      },
    ],
  },

  findMore: {
    title: { en: 'Find More About Us And Our Services' },
    cta: { label: { en: 'About Us' }, href: '/about' },
  },

  testimonials: {
    title: { en: 'Trusted by dozens of clients' },
    items: [
      {
        quote: {
          en: 'The Capellen business center offers excellent facilities for setting up and expanding your business, including offices, a mailroom and private parking. The people who work there are very friendly and available to help you with all your needs. The services provided are first-rate in the Luxembourg market.',
        },
        name: 'Loïck Franc',
        role: { en: 'CEO' },
        company: 'CyheadIT',
        rating: 5,
      },
      {
        quote: {
          en: 'An excellent base in Luxembourg enables us to be close to our projects as they are carried out.',
        },
        name: 'Cédric Bourdon',
        role: { en: 'Project Manager' },
        company: 'BEDDELEEM LUX',
        rating: 5,
      },
      {
        quote: {
          en: 'The BCC is a flexible and ideally located place for a business shared between working on site and creating quotations in the office!',
        },
        name: 'Nicolas Gits',
        role: { en: 'CEO' },
        company: 'GGDIS',
        rating: 5,
      },
    ],
  },

  final: {
    lines: { en: ['Let’s Build The', 'Future Together'] },
    cta: { label: { en: 'Contact Us' }, href: '/contact' },
    image: img('final.jpg', 1600, 900, 'Business Center Capellen buildings along route d’Arlon'),
  },
};
