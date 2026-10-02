import type { Localized, ServicesPage } from '../types';
import { alts } from './home';

/**
 * Our Services content. English from businesscentercapellen.lu/about-us#services (typos
 * corrected); FR/DE/LU are translations (terms in translations/glossary.md).
 */
const includedMonthly: Localized = {
  en: 'Included in the monthly rental charge.',
  fr: 'Inclus dans le loyer mensuel.',
  de: 'In der monatlichen Miete inbegriffen.',
  lu: 'Am monatleche Loyer abegraff.',
};
const extraCost: Localized = {
  en: 'Additional cost depending on requirements.',
  fr: 'Coût supplémentaire selon les besoins.',
  de: 'Zusatzkosten je nach Bedarf.',
  lu: 'Zousätzlech Käschte jee no Besoin.',
};

export const servicesFallback: ServicesPage = {
  hero: {
    eyebrow: {
      en: 'Our Services',
      fr: 'Nos services',
      de: 'Unsere Leistungen',
      lu: 'Eis Servicer',
    },
    title: {
      en: 'Flexible packages to suit your needs.',
      fr: 'Des formules flexibles adaptées à vos besoins.',
      de: 'Flexible Pakete für Ihre Bedürfnisse.',
      lu: 'Flexibel Päck fir Är Besoinen.',
    },
    body: [
      {
        en: 'We believe flexibility isn’t a bonus, it’s the standard.',
        fr: 'Pour nous, la flexibilité n’est pas un bonus, c’est la norme.',
        de: 'Für uns ist Flexibilität kein Bonus, sondern Standard.',
        lu: 'Fir eis ass Flexibilitéit keen Bonus, mee de Standard.',
      },
      {
        en: 'We are dedicated to providing simple and effective solutions.',
        fr: 'Nous nous engageons à proposer des solutions simples et efficaces.',
        de: 'Wir setzen auf einfache und wirksame Lösungen.',
        lu: 'Mir setzen eis fir einfach an effikass Léisungen an.',
      },
    ],
  },
  choose: {
    title: {
      en: 'Choose your “player”',
      fr: 'Choisissez votre « player »',
      de: 'Wählen Sie Ihren „Player“',
      lu: 'Wielt Äre „Player“',
    },
    coworking: {
      title: {
        en: 'Co-Working Space',
        fr: 'Espace de coworking',
        de: 'Coworking-Bereich',
        lu: 'Coworking-Space',
      },
      kicker: {
        en: 'Company Domiciliation',
        fr: 'Domiciliation d’entreprise',
        de: 'Firmendomizilierung',
        lu: 'Domiciliatioun vu Firmen',
      },
      body: {
        en: [
          { strong: 'Grow your business' },
          ' from a place that feels right. Our coworking spaces give you a ',
          { strong: 'real business address' },
          ', flexible offices, and a community that inspires you to do more.',
        ],
        fr: [
          { strong: 'Développez votre entreprise' },
          ' dans un lieu qui vous correspond. Nos espaces de coworking vous offrent une ',
          { strong: 'véritable adresse professionnelle' },
          ', des bureaux flexibles et une communauté qui vous pousse à aller plus loin.',
        ],
        de: [
          { strong: 'Lassen Sie Ihr Unternehmen wachsen' },
          ', an einem Ort, der zu Ihnen passt. Unsere Coworking-Bereiche bieten Ihnen eine ',
          { strong: 'echte Geschäftsadresse' },
          ', flexible Büros und eine Community, die Sie zu mehr inspiriert.',
        ],
        lu: [
          { strong: 'Loosst Är Firma wuessen' },
          ' op enger Plaz, déi zu Iech passt. Eis Coworking-Spacen ginn Iech eng ',
          { strong: 'richteg Geschäftsadress' },
          ', flexibel Büroen an eng Communautéit, déi Iech inspiréiert, méi ze maachen.',
        ],
      },
      packages: {
        en: 'From basic to all-inclusive packages, you decide.',
        fr: 'Du forfait de base au forfait tout compris, c’est vous qui décidez.',
        de: 'Vom Basispaket bis zum All-inclusive-Paket: Sie entscheiden.',
        lu: 'Vum Basispak bis zum All-inclusive-Pak, Dir decidéiert.',
      },
      highlight: {
        en: 'Enjoy a pleasant, welcoming workspace at a very attractive price, less than 15 minutes from the centre of Luxembourg.',
        fr: 'Profitez d’un espace de travail agréable et accueillant à un prix très attractif, à moins de 15 minutes du centre de Luxembourg.',
        de: 'Genießen Sie einen angenehmen, einladenden Arbeitsplatz zu einem sehr attraktiven Preis, weniger als 15 Minuten vom Zentrum Luxemburgs entfernt.',
        lu: 'Profitéiert vun enger agreabler, gaaschtfrëndlecher Aarbechtsplaz zu engem ganz attraktive Präis, manner wéi 15 Minutte vum Zentrum vu Lëtzebuerg.',
      },
      audience: {
        en: 'Perfect for entrepreneurs, freelancers…',
        fr: 'Idéal pour les entrepreneurs, les indépendants…',
        de: 'Ideal für Unternehmer, Freelancer …',
        lu: 'Ideal fir Entrepreneuren, Freelancer…',
      },
      cta: {
        label: {
          en: 'Ask for information',
          fr: 'Demander des informations',
          de: 'Informationen anfordern',
          lu: 'Informatiounen ufroen',
        },
        href: '/contact?workspace=coworking',
      },
      image: {
        src: '/images/home/cowork-wide.jpg',
        width: 2000,
        height: 1600,
        alt: alts.coworkWide,
      },
    },
    privateOffices: {
      title: { en: 'Private Offices', fr: 'Bureaux privés', de: 'Privatbüros', lu: 'Privatbüroen' },
      sizes: [1, 2, 3, 4, 6, 8],
      sizeNote: {
        en: 'Furnished or unfurnished',
        fr: 'Meublé ou non meublé',
        de: 'Möbliert oder unmöbliert',
        lu: 'Mëbléiert oder net mëbléiert',
      },
      image: {
        src: '/images/home/office-detail.jpg',
        width: 900,
        height: 900,
        alt: alts.officeDetail,
      },
    },
  },
  offers: {
    title: {
      en: 'What we offer',
      fr: 'Ce que nous proposons',
      de: 'Unser Angebot',
      lu: 'Wat mir ubidden',
    },
    items: [
      {
        icon: '/images/icons/wifi.svg',
        title: {
          en: 'Professional-quality Wi-Fi',
          fr: 'Wi-Fi de qualité professionnelle',
          de: 'WLAN in professioneller Qualität',
          lu: 'Wi-Fi a professioneller Qualitéit',
        },
        body: includedMonthly,
      },
      {
        icon: '/images/icons/reception.svg',
        title: {
          en: 'Reception & Switchboard',
          fr: 'Accueil et standard téléphonique',
          de: 'Empfang und Telefonzentrale',
          lu: 'Empfang an Telefonszentral',
        },
        body: includedMonthly,
      },
      {
        icon: '/images/icons/meeting.svg',
        title: {
          en: 'Meeting rooms',
          fr: 'Salles de réunion',
          de: 'Besprechungsräume',
          lu: 'Versammlungsraim',
        },
        body: {
          en: 'Take advantage of our meeting rooms for in-house meetings or to welcome your customers and suppliers.',
          fr: 'Profitez de nos salles de réunion pour vos réunions internes ou pour recevoir vos clients et fournisseurs.',
          de: 'Nutzen Sie unsere Besprechungsräume für interne Meetings oder um Ihre Kunden und Lieferanten zu empfangen.',
          lu: 'Profitéiert vun eise Versammlungsraim fir intern Reuniounen oder fir Är Clienten a Fournisseuren ze empfänken.',
        },
      },
      {
        icon: '/images/icons/kitchen.svg',
        title: {
          en: 'Cafeteria & Kitchen',
          fr: 'Cafétéria et cuisine',
          de: 'Cafeteria und Küche',
          lu: 'Cafeteria a Kichen',
        },
        body: {
          en: 'Access to the kitchenette is included in the monthly rental.',
          fr: 'L’accès à la kitchenette est inclus dans le loyer mensuel.',
          de: 'Der Zugang zur Teeküche ist in der monatlichen Miete inbegriffen.',
          lu: 'Den Zougang zur Kichenette ass am monatleche Loyer abegraff.',
        },
      },
      {
        icon: '/images/icons/supplies.svg',
        title: {
          en: 'Office supplies',
          fr: 'Fournitures de bureau',
          de: 'Büromaterial',
          lu: 'Büromaterial',
        },
        body: {
          en: 'Take advantage of our central purchasing group for office supplies. Consumption is rebilled with the monthly rental payment.',
          fr: 'Profitez de notre centrale d’achat pour vos fournitures de bureau. La consommation est refacturée avec le loyer mensuel.',
          de: 'Nutzen Sie unsere zentrale Einkaufsgemeinschaft für Büromaterial. Der Verbrauch wird mit der monatlichen Miete abgerechnet.',
          lu: 'Profitéiert vun eiser zentraler Akafsgemeinschaft fir Büromaterial. De Verbrauch gëtt mam monatleche Loyer verrechent.',
        },
      },
      {
        icon: '/images/icons/parking.svg',
        title: {
          en: 'Parking spaces',
          fr: 'Places de parking',
          de: 'Parkplätze',
          lu: 'Parkplazen',
        },
        body: {
          en: 'Free parking available at the rear of the building. Supplement for a reserved, named parking space.',
          fr: 'Parking gratuit à l’arrière du bâtiment. Supplément pour une place réservée et nominative.',
          de: 'Kostenlose Parkplätze hinter dem Gebäude. Aufpreis für einen reservierten, namentlich zugewiesenen Parkplatz.',
          lu: 'Gratis Parking hannert dem Gebai. Zouschlag fir eng reservéiert Parkplaz op Ären Numm.',
        },
      },
      {
        icon: '/images/icons/cloud.svg',
        title: {
          en: 'Cloud services',
          fr: 'Services cloud',
          de: 'Cloud-Services',
          lu: 'Cloud-Servicer',
        },
        body: {
          en: 'BCC, in partnership with Cloud Power Luxembourg, offers its tenants the possibility of using a private cloud for their IT infrastructure and virtual desktop. Pricing is monthly, according to need.',
          fr: 'En partenariat avec Cloud Power Luxembourg, BCC offre à ses locataires la possibilité d’utiliser un cloud privé pour leur infrastructure informatique et leur bureau virtuel. Tarification mensuelle, selon les besoins.',
          de: 'In Partnerschaft mit Cloud Power Luxembourg bietet BCC seinen Mietern die Möglichkeit, eine Private Cloud für ihre IT-Infrastruktur und ihren virtuellen Desktop zu nutzen. Die Abrechnung erfolgt monatlich nach Bedarf.',
          lu: 'A Partnerschaft mat Cloud Power Luxembourg bitt de BCC senge Locatairen d’Méiglechkeet, eng Private Cloud fir hir IT-Infrastruktur an hire virtuelle Desktop ze notzen. De Präis gëtt monatlech no Besoin berechent.',
        },
      },
      {
        icon: '/images/icons/mail.svg',
        title: { en: 'Mail room', fr: 'Service courrier', de: 'Postservice', lu: 'Postservice' },
        body: {
          en: 'BCC offers a mail opening, digitisation and emailing service for all your incoming mail. Pricing is based on volume.',
          fr: 'BCC propose un service d’ouverture, de numérisation et d’envoi par e-mail de tout votre courrier entrant. Tarification selon le volume.',
          de: 'BCC bietet für Ihre gesamte eingehende Post einen Service zum Öffnen, Digitalisieren und Versenden per E-Mail. Die Abrechnung richtet sich nach dem Volumen.',
          lu: 'De BCC bitt fir Är ganz akommend Post e Service fir d’Opmaachen, d’Digitaliséieren an d’Schécke per E-Mail. De Präis hänkt vum Volume of.',
        },
      },
      {
        icon: '/images/icons/handshake.svg',
        title: {
          en: 'Accounting, Legal & HR',
          fr: 'Comptabilité, juridique et RH',
          de: 'Buchhaltung, Recht und Personal',
          lu: 'Comptabilitéit, Juristesches a Personal',
        },
        body: extraCost,
      },
      {
        icon: '/images/icons/more.svg',
        title: {
          en: 'Additional services',
          fr: 'Services supplémentaires',
          de: 'Zusätzliche Leistungen',
          lu: 'Zousätzlech Servicer',
        },
        body: extraCost,
      },
    ],
  },
  cta: {
    title: {
      en: 'Ready to take your business to the next level?',
      fr: 'Prêt à faire passer votre entreprise à la vitesse supérieure ?',
      de: 'Bereit, Ihr Unternehmen auf die nächste Stufe zu bringen?',
      lu: 'Prett, fir Är Firma op den nächsten Niveau ze bréngen?',
    },
    link: {
      label: { en: 'Contact Us', fr: 'Contactez-nous', de: 'Kontakt', lu: 'Kontakt' },
      href: '/contact',
    },
  },
};
