import type { AboutPage } from '../types';
import { alts } from './home';

/**
 * About Us content. English from businesscentercapellen.lu/about-us (typos corrected);
 * FR/DE/LU are translations (terms in translations/glossary.md).
 */
export const aboutFallback: AboutPage = {
  hero: {
    eyebrow: { en: 'About Us', fr: 'À propos', de: 'Über uns', lu: 'Iwwer eis' },
    title: {
      en: 'Your business evolves, your office should too.',
      fr: 'Votre entreprise évolue, votre bureau aussi.',
      de: 'Ihr Unternehmen entwickelt sich, Ihr Büro sollte es auch.',
      lu: 'Är Firma entwéckelt sech, Äre Büro sollt dat och.',
    },
    titleAccent: {
      en: 'your office should too.',
      fr: 'votre bureau aussi.',
      de: 'Ihr Büro sollte es auch.',
      lu: 'Äre Büro sollt dat och.',
    },
    body: {
      en: 'At Business Center Capellen, flexibility isn’t an extra, it’s our foundation. Whether you’re expanding, downsizing, or launching your venture, our spaces adapt to your pace.',
      fr: 'Au Business Center Capellen, la flexibilité n’est pas une option, c’est notre fondement. Que vous vous agrandissiez, réduisiez votre surface ou lanciez votre activité, nos espaces s’adaptent à votre rythme.',
      de: 'Im Business Center Capellen ist Flexibilität kein Extra, sondern unser Fundament. Ob Sie wachsen, sich verkleinern oder Ihr Unternehmen gründen: Unsere Räume passen sich Ihrem Tempo an.',
      lu: 'Am Business Center Capellen ass Flexibilitéit keen Extra, mee eist Fundament. Egal ob Dir wuesst, méi kleng gitt oder Är Firma lancéiert, eis Raim passe sech Ärem Tempo un.',
    },
    image: { src: '/media/hero/hero-poster.jpg', width: 1920, height: 1080, alt: alts.buildings },
  },
  highlights: [
    {
      en: 'No long-term commitment',
      fr: 'Aucun engagement à long terme',
      de: 'Keine langfristige Bindung',
      lu: 'Keng laangfristeg Bindung',
    },
    {
      en: 'Month-to-month contracts',
      fr: 'Contrats au mois',
      de: 'Monatlich kündbare Verträge',
      lu: 'Kontrakter vu Mount zu Mount',
    },
    {
      en: 'Fully equipped offices & co-working spaces',
      fr: 'Bureaux et espaces de coworking entièrement équipés',
      de: 'Voll ausgestattete Büros und Coworking-Bereiche',
      lu: 'Komplett equipéiert Büroen a Coworking-Spacen',
    },
    {
      en: '24/7 secure badge access',
      fr: 'Accès sécurisé par badge 24 h/24, 7 j/7',
      de: 'Gesicherter Badge-Zugang rund um die Uhr',
      lu: 'Geséchert Zougang mam Badge 24/7',
    },
    {
      en: 'High-speed internet, parking & concierge service',
      fr: 'Internet haut débit, parking et service de conciergerie',
      de: 'Highspeed-Internet, Parkplätze und Concierge-Service',
      lu: 'Séiert Internet, Parking a Concierge-Service',
    },
  ],
  location: {
    en: 'Based in Capellen, a few minutes from Luxembourg City and the Belgian border.',
    fr: 'Situé à Capellen, à quelques minutes de la ville de Luxembourg et de la frontière belge.',
    de: 'In Capellen gelegen, nur wenige Minuten von Luxemburg-Stadt und der belgischen Grenze entfernt.',
    lu: 'Zu Capellen, just e puer Minutte vun der Stad Lëtzebuerg a vun der belscher Grenz ewech.',
  },
  audience: {
    en: 'Perfect for entrepreneurs, freelancers, and small teams who want to stay lean, agile, and focused on growth.',
    fr: 'Idéal pour les entrepreneurs, les indépendants et les petites équipes qui veulent rester légers, agiles et concentrés sur leur croissance.',
    de: 'Ideal für Unternehmer, Freelancer und kleine Teams, die schlank, agil und wachstumsorientiert bleiben möchten.',
    lu: 'Ideal fir Entrepreneuren, Freelancer a kleng Teams, déi schlank, agil a konzentréiert op hire Wuesstem bleiwe wëllen.',
  },
  figures: [
    {
      value: '1–8',
      label: {
        en: 'Offices for 1 to 8 people',
        fr: 'Bureaux de 1 à 8 personnes',
        de: 'Büros für 1 bis 8 Personen',
        lu: 'Büroe fir 1 bis 8 Persounen',
      },
    },
    {
      value: '20+',
      label: {
        en: 'Parking spaces available',
        fr: 'Places de parking disponibles',
        de: 'Verfügbare Parkplätze',
        lu: 'Disponibel Parkplazen',
      },
    },
  ],
  features: [
    {
      title: {
        en: 'Turnkey solution',
        fr: 'Solution clé en main',
        de: 'Schlüsselfertige Lösung',
        lu: 'Schlësselfäerdeg Léisung',
      },
      body: {
        en: 'Our office spaces are designed to comply with Luxembourg regulations.',
        fr: 'Nos bureaux sont conçus pour être conformes à la réglementation luxembourgeoise.',
        de: 'Unsere Büroflächen sind so konzipiert, dass sie den luxemburgischen Vorschriften entsprechen.',
        lu: 'Eis Büroe sinn esou konzipéiert, datt se de Lëtzebuerger Reglementer entspriechen.',
      },
      note: {
        en: 'Included: desk(s), chair(s), coat rack, high-speed Wi-Fi, locked cupboard with company name, drawer cabinet(s) on castors, and access to parking.',
        fr: 'Inclus : bureau(x), chaise(s), portemanteau, Wi-Fi haut débit, armoire fermant à clé avec le nom de l’entreprise, caisson(s) à tiroirs sur roulettes et accès au parking.',
        de: 'Inklusive: Schreibtisch(e), Stuhl bzw. Stühle, Garderobe, Highspeed-WLAN, abschließbarer Schrank mit Firmenname, Rollcontainer und Zugang zum Parkplatz.',
        lu: 'Abegraff: Schreifdësch(er), Stull oder Still, Garderob, séiere Wi-Fi, Schaf mat Schlass an dem Numm vun der Firma, Rollcontainer an Zougang zum Parking.',
      },
      image: {
        src: '/images/home/office-tall.jpg',
        width: 1200,
        height: 1935,
        alt: alts.officeTall,
      },
    },
    {
      title: { en: 'Vision', fr: 'Vision', de: 'Vision', lu: 'Visioun' },
      body: {
        en: 'Benefit from the services and facilities you need to create a productive and pleasant working environment.',
        fr: 'Profitez des services et des équipements dont vous avez besoin pour créer un environnement de travail productif et agréable.',
        de: 'Nutzen Sie die Services und Einrichtungen, die Sie für ein produktives und angenehmes Arbeitsumfeld brauchen.',
        lu: 'Profitéiert vun de Servicer an Equipementer, déi Dir fir en produktivt an agreabelt Aarbechtsëmfeld braucht.',
      },
      image: {
        src: '/images/home/space-meeting-room.jpg',
        width: 1600,
        height: 1200,
        alt: alts.meetingRoom,
      },
      cta: {
        label: {
          en: 'Get a Quote',
          fr: 'Demander un devis',
          de: 'Angebot anfordern',
          lu: 'Offert ufroen',
        },
        href: '/contact',
      },
    },
  ],
  visit: {
    eyebrow: {
      en: 'Come to visit us',
      fr: 'Venez nous rendre visite',
      de: 'Besuchen Sie uns',
      lu: 'Kommt eis besichen',
    },
    title: {
      en: 'Discover your future office',
      fr: 'Découvrez votre futur bureau',
      de: 'Entdecken Sie Ihr zukünftiges Büro',
      lu: 'Entdeckt Äre zukünftege Büro',
    },
    cta: {
      label: {
        en: 'Schedule a visit',
        fr: 'Planifier une visite',
        de: 'Besichtigung vereinbaren',
        lu: 'Visite plangen',
      },
      href: '/contact',
    },
    image: {
      src: '/images/home/space-lounge.jpg',
      width: 1280,
      height: 853,
      alt: alts.lounge,
    },
  },
};
