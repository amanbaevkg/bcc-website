import type { HomePage, Localized } from '../types';

/**
 * Home page content used until the Sanity "Home page" document exists.
 * English is copied from businesscentercapellen.lu (see the approved mockup);
 * FR/DE/LU are translations (terms in translations/glossary.md).
 * Testimonials stay in the language they were written in.
 */
const img = (
  src: string,
  width: number,
  height: number,
  alt: Localized,
  hotspot?: { x: number; y: number },
) => ({ src: `/images/home/${src}`, width, height, alt, hotspot });

export const alts = {
  coworkWide: {
    en: 'Co-working space with white desks, grey acoustic dividers and black office chairs',
    fr: 'Espace de coworking avec bureaux blancs, cloisons acoustiques grises et chaises de bureau noires',
    de: 'Coworking-Bereich mit weißen Schreibtischen, grauen Akustiktrennwänden und schwarzen Bürostühlen',
    lu: 'Coworking-Space mat wäisse Schreifdëscher, groe Schallschutzwänn a schwaarze Bürosstill',
  },
  officeTall: {
    en: 'Bright furnished office with white desks, acoustic dividers and black office chairs',
    fr: 'Bureau meublé et lumineux avec bureaux blancs, cloisons acoustiques et chaises noires',
    de: 'Helles möbliertes Büro mit weißen Schreibtischen, Akustiktrennwänden und schwarzen Bürostühlen',
    lu: 'Hellt, mëbléiert Büro mat wäisse Schreifdëscher, Schallschutzwänn a schwaarze Bürosstill',
  },
  officeDetail: {
    en: 'Office desks with the BCC roll-up banner',
    fr: 'Bureaux avec le kakémono BCC',
    de: 'Schreibtische mit dem BCC-Roll-up',
    lu: 'Schreifdëscher mam BCC-Roll-up',
  },
  meetingRoom: {
    en: 'Modern meeting room with a conference table, a projector and bluish lighting',
    fr: 'Salle de réunion moderne avec table de conférence, projecteur et éclairage bleuté',
    de: 'Moderner Besprechungsraum mit Konferenztisch, Projektor und bläulicher Beleuchtung',
    lu: 'Modernen Versammlungsraum mat Konferenzdësch, Projekter a bloer Beliichtung',
  },
  lounge: {
    en: 'Lounge and meeting room with table football, TV and a large table',
    fr: 'Salon et salle de réunion avec baby-foot, télévision et grande table',
    de: 'Lounge und Besprechungsraum mit Tischkicker, Fernseher und großem Tisch',
    lu: 'Lounge a Versammlungsraum mat Kicker, Fernseh an engem groussen Dësch',
  },
  buildings: {
    en: 'Business Center Capellen buildings along route d’Arlon',
    fr: 'Bâtiments du Business Center Capellen le long de la route d’Arlon',
    de: 'Gebäude des Business Center Capellen entlang der Route d’Arlon',
    lu: 'Gebaier vum Business Center Capellen laanscht d’Route d’Arlon',
  },
} satisfies Record<string, Localized>;

const aboutUs: Localized = { en: 'About Us', fr: 'À propos', de: 'Über uns', lu: 'Iwwer eis' };
const getQuote: Localized = {
  en: 'Get a Quote',
  fr: 'Demander un devis',
  de: 'Angebot anfordern',
  lu: 'Offert ufroen',
};

export const homeFallback: HomePage = {
  hero: {
    eyebrow: { en: "77, route d'Arlon · L-8311 Capellen" },
    title: { en: 'Business Center Capellen' },
    titleAccent: { en: 'Capellen' },
    subtitle: {
      en: 'Your trusted partner for office rentals in Capellen (Luxembourg)',
      fr: 'Votre partenaire de confiance pour la location de bureaux à Capellen (Luxembourg)',
      de: 'Ihr zuverlässiger Partner für Büroanmietung in Capellen (Luxemburg)',
      lu: 'Äre vertrauenswierdege Partner fir Büroen zu Capellen (Lëtzebuerg) ze lounen',
    },
    video: {
      sources: [
        { src: '/media/hero/hero-1080.mp4', height: 1080, type: 'video/mp4' },
        { src: '/media/hero/hero-720.mp4', height: 720, type: 'video/mp4' },
        { src: '/media/hero/hero-480.mp4', height: 480, type: 'video/mp4' },
      ],
      poster: { src: '/media/hero/hero-poster.jpg', width: 1920, height: 1080, alt: { en: '' } },
    },
    workspaceTypes: [
      {
        id: 'private-office',
        name: {
          en: 'Private Offices',
          fr: 'Bureaux privés',
          de: 'Privatbüros',
          lu: 'Privatbüroen',
        },
        hasTeamSize: true,
      },
      {
        id: 'coworking',
        name: {
          en: 'Co-Working Space',
          fr: 'Espace de coworking',
          de: 'Coworking-Bereich',
          lu: 'Coworking-Space',
        },
        hasTeamSize: false,
      },
      {
        id: 'meeting-room',
        name: {
          en: 'Meeting Rooms',
          fr: 'Salles de réunion',
          de: 'Besprechungsräume',
          lu: 'Versammlungsraim',
        },
        hasTeamSize: false,
      },
      {
        id: 'domiciliation',
        name: {
          en: 'Company Domiciliation',
          fr: 'Domiciliation d’entreprise',
          de: 'Firmendomizilierung',
          lu: 'Domiciliatioun vu Firmen',
        },
        hasTeamSize: false,
      },
    ],
    teamSizes: [1, 2, 3, 4, 6, 8],
    cta: { label: getQuote, href: '/contact' },
    ring: {
      label: {
        en: 'Work with us',
        fr: 'Travaillons ensemble',
        de: 'Arbeiten Sie mit uns',
        lu: 'Schafft mat eis',
      },
      href: '/contact',
    },
  },

  coworking: {
    title: {
      en: 'Co-Working Offices',
      fr: 'Bureaux en coworking',
      de: 'Coworking-Büros',
      lu: 'Coworking-Büroen',
    },
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
      fr: [
        { strong: 'Développez votre entreprise' },
        ' dans un lieu qui vous correspond. Nos espaces de coworking vous offrent une ',
        { strong: 'véritable adresse professionnelle' },
        ', des bureaux flexibles et une communauté qui vous pousse à aller plus loin. ',
        { strong: 'Du forfait de base au forfait tout compris, c’est vous qui décidez' },
        '.',
      ],
      de: [
        { strong: 'Lassen Sie Ihr Unternehmen wachsen' },
        ', an einem Ort, der zu Ihnen passt. Unsere Coworking-Bereiche bieten Ihnen eine ',
        { strong: 'echte Geschäftsadresse' },
        ', flexible Büros und eine Community, die Sie zu mehr inspiriert. ',
        { strong: 'Vom Basispaket bis zum All-inclusive-Paket: Sie entscheiden' },
        '.',
      ],
      lu: [
        { strong: 'Loosst Är Firma wuessen' },
        ' op enger Plaz, déi zu Iech passt. Eis Coworking-Spacen ginn Iech eng ',
        { strong: 'richteg Geschäftsadress' },
        ', flexibel Büroen an eng Communautéit, déi Iech inspiréiert, méi ze maachen. ',
        { strong: 'Vum Basispak bis zum All-inclusive-Pak, Dir decidéiert' },
        '.',
      ],
    },
    images: [
      img('cowork-wide.jpg', 2000, 1600, alts.coworkWide),
      img(
        'cowork-small.jpg',
        1100,
        1158,
        {
          en: 'Common room with a long black table and a table football game',
          fr: 'Salle commune avec une longue table noire et un baby-foot',
          de: 'Gemeinschaftsraum mit langem schwarzem Tisch und Tischkicker',
          lu: 'Gemeinschaftsraum mat engem laangen schwaarzen Dësch an engem Kicker',
        },
        { x: 0.5, y: 0.18 },
      ),
    ],
  },

  privateOffices: {
    title: { en: 'Private Offices', fr: 'Bureaux privés', de: 'Privatbüros', lu: 'Privatbüroen' },
    href: '/services',
    body: {
      en: [
        { strong: 'Your Private Space with no hidden fees' },
        '. We believe flexibility isn’t a bonus ➡️ it’s the standard.',
      ],
      fr: [
        { strong: 'Votre espace privé, sans frais cachés' },
        '. Pour nous, la flexibilité n’est pas un bonus ➡️ c’est la norme.',
      ],
      de: [
        { strong: 'Ihr privater Raum ohne versteckte Kosten' },
        '. Für uns ist Flexibilität kein Bonus ➡️ sondern Standard.',
      ],
      lu: [
        { strong: 'Äre private Raum ouni verstoppte Käschten' },
        '. Fir eis ass Flexibilitéit keen Bonus ➡️ mee de Standard.',
      ],
    },
    images: [
      img('office-tall.jpg', 1200, 1935, alts.officeTall),
      img('office-detail.jpg', 900, 900, alts.officeDetail),
    ],
  },

  servicesLink: {
    label: {
      en: 'Discover Our Services',
      fr: 'Découvrez nos services',
      de: 'Entdecken Sie unsere Leistungen',
      lu: 'Entdeckt eis Servicer',
    },
    href: '/services',
  },

  trust: {
    title: {
      en: 'They trust us',
      fr: 'Ils nous font confiance',
      de: 'Sie vertrauen uns',
      lu: 'Si vertrauen eis',
    },
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
    lines: {
      en: ['BUILDING', 'TOMORROW’S', 'NOW'],
      fr: ['BÂTIR', 'DEMAIN', 'DÈS AUJOURD’HUI'],
      de: ['WIR BAUEN', 'DAS MORGEN', 'SCHON HEUTE'],
      lu: ['MIR BAUEN', 'DE MUER', 'ELO SCHONN'],
    },
    card: {
      en: 'Setting Up Your Business in Capellen (Luxembourg): Combine Legal Compliance with Flexible Workspaces',
      fr: 'Créer votre entreprise à Capellen (Luxembourg) : conformité juridique et espaces de travail flexibles',
      de: 'Unternehmensgründung in Capellen (Luxemburg): rechtliche Konformität und flexible Arbeitsplätze vereint',
      lu: 'Är Firma zu Capellen (Lëtzebuerg) grënnen: juristesch Konformitéit a flexibel Aarbechtsplazen',
    },
    image: img('building.jpg', 1800, 1268, {
      en: 'Business Center Capellen building with the Bloc C sign',
      fr: 'Bâtiment du Business Center Capellen avec l’enseigne Bloc C',
      de: 'Gebäude des Business Center Capellen mit dem Schild Bloc C',
      lu: 'Gebai vum Business Center Capellen mam Schëld Bloc C',
    }),
  },

  spaces: {
    title: { en: 'OUR SPACES', fr: 'NOS ESPACES', de: 'UNSERE RÄUME', lu: 'EIS RAIM' },
    moreLink: { label: aboutUs, href: '/about' },
    items: [
      {
        image: img('space-meeting-room.jpg', 1600, 1200, alts.meetingRoom),
        caption: {
          en: 'Meeting room',
          fr: 'Salle de réunion',
          de: 'Besprechungsraum',
          lu: 'Versammlungsraum',
        },
      },
      {
        image: img('space-mailroom.jpg', 1086, 1395, {
          en: 'Mail shelves and tenant directory in the reception hall',
          fr: 'Casiers à courrier et liste des locataires dans le hall d’accueil',
          de: 'Postfächer und Mieterverzeichnis in der Empfangshalle',
          lu: 'Postfächer a Lëscht vun de Locatairen an der Empfangshal',
        }),
        caption: { en: 'Mailroom', fr: 'Salle du courrier', de: 'Postraum', lu: 'Postraum' },
      },
      {
        image: img('space-reception.jpg', 805, 1086, {
          en: 'Reception hall of Business Center Capellen, Bloc C',
          fr: 'Hall d’accueil du Business Center Capellen, Bloc C',
          de: 'Empfangshalle des Business Center Capellen, Bloc C',
          lu: 'Empfangshal vum Business Center Capellen, Bloc C',
        }),
        caption: {
          en: 'Reception hall, Bloc C',
          fr: 'Hall d’accueil, Bloc C',
          de: 'Empfangshalle, Bloc C',
          lu: 'Empfangshal, Bloc C',
        },
      },
      {
        image: img('space-lounge.jpg', 1280, 853, alts.lounge),
        caption: {
          en: 'Lounge and meeting room',
          fr: 'Salon et salle de réunion',
          de: 'Lounge und Besprechungsraum',
          lu: 'Lounge a Versammlungsraum',
        },
      },
      {
        image: img('space-parking.jpg', 1448, 965, {
          en: 'Parking spaces in front of the Business Center Capellen building',
          fr: 'Places de parking devant le bâtiment du Business Center Capellen',
          de: 'Parkplätze vor dem Gebäude des Business Center Capellen',
          lu: 'Parkplazen virum Gebai vum Business Center Capellen',
        }),
        caption: {
          en: 'Private parking',
          fr: 'Parking privé',
          de: 'Privatparkplatz',
          lu: 'Privatparking',
        },
      },
      {
        image: img('space-kitchen.jpg', 1007, 1280, {
          en: 'Shared kitchen with microwave, coffee machine and dishwasher',
          fr: 'Cuisine commune avec micro-ondes, machine à café et lave-vaisselle',
          de: 'Gemeinschaftsküche mit Mikrowelle, Kaffeemaschine und Geschirrspüler',
          lu: 'Gemeinschaftskichen mat Mikrowell, Kaffismaschinn a Spullmaschinn',
        }),
        caption: {
          en: 'Common area',
          fr: 'Espace commun',
          de: 'Gemeinschaftsbereich',
          lu: 'Gemeinschaftsraum',
        },
      },
    ],
  },

  findMore: {
    title: {
      en: 'Find More About Us And Our Services',
      fr: 'En savoir plus sur nous et nos services',
      de: 'Mehr über uns und unsere Leistungen',
      lu: 'Méi iwwer eis an eis Servicer',
    },
    cta: { label: aboutUs, href: '/about' },
  },

  testimonials: {
    title: {
      en: 'Trusted by dozens of clients',
      fr: 'Des dizaines de clients nous font confiance',
      de: 'Dutzende Kunden vertrauen uns',
      lu: 'Dosende vu Clienten vertrauen eis',
    },
    items: [
      {
        quote: {
          en: 'The Capellen business center offers excellent facilities for setting up and expanding your business, including offices, a mailroom and private parking. The people who work there are very friendly and available to help you with all your needs. The services provided are first-rate in the Luxembourg market.',
        },
        lang: 'en',
        name: 'Loïck Franc',
        role: { en: 'CEO' },
        company: 'CyheadIT',
        rating: 5,
      },
      {
        quote: {
          en: 'An excellent base in Luxembourg enables us to be close to our projects as they are carried out.',
        },
        lang: 'en',
        name: 'Cédric Bourdon',
        role: {
          en: 'Project Manager',
          fr: 'Chef de projet',
          de: 'Projektleiter',
          lu: 'Projetsleeder',
        },
        company: 'BEDDELEEM LUX',
        rating: 5,
      },
      {
        quote: {
          en: 'The BCC is a flexible and ideally located place for a business shared between working on site and creating quotations in the office!',
        },
        lang: 'en',
        name: 'Nicolas Gits',
        role: { en: 'CEO' },
        company: 'GGDIS',
        rating: 5,
      },
    ],
  },

  final: {
    lines: {
      en: ['Let’s Build The', 'Future Together'],
      fr: ['Construisons', 'l’avenir ensemble'],
      de: ['Gestalten wir', 'gemeinsam die Zukunft'],
      lu: ['Loosst eis zesummen', 'd’Zukunft bauen'],
    },
    cta: {
      label: { en: 'Contact Us', fr: 'Contactez-nous', de: 'Kontakt', lu: 'Kontakt' },
      href: '/contact',
    },
    image: img('final.jpg', 1600, 900, alts.buildings),
  },
};
