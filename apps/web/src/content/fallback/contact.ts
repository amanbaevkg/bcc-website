import en from '../../../messages/en.json';
import fr from '../../../messages/fr.json';
import de from '../../../messages/de.json';
import lu from '../../../messages/lu.json';
import type { ContactPage, Localized } from '../types';
import { homeFallback } from './home';

/** A text of the site's built-in translations, in all four languages. */
const msg = (pick: (m: typeof en) => string): Localized => ({
  en: pick(en),
  fr: pick(fr as typeof en),
  de: pick(de as typeof en),
  lu: pick(lu as typeof en),
});

/**
 * Contact page content used until the admin's Contact page is filled in (and imported into it on first start).
 * The 20 photos are the gallery from the contact page of businesscentercapellen.lu,
 * resized to 2000 px; alt texts describe what each photo shows.
 */
const photo = (n: number, alt: Localized) => ({
  src: `/images/contact/gallery-${String(n).padStart(2, '0')}.jpg`,
  width: 2000,
  height: 1500,
  alt,
});

export const contactFallback: ContactPage = {
  top: {
    eyebrow: msg((m) => m.Contact.eyebrow),
    title: msg((m) => m.Contact.title),
    subtitle: msg((m) => m.Contact.subtitle),
    callUs: msg((m) => m.Contact.callUs),
    visitUs: msg((m) => m.Contact.visitUs),
    writeUs: msg((m) => m.Contact.writeUs),
  },
  form: {
    title: msg((m) => m.Contact.introTitle),
    body: msg((m) => m.Contact.introBody),
    formTitle: msg((m) => m.Contact.formTitle),
    firstName: msg((m) => m.Contact.firstName),
    lastName: msg((m) => m.Contact.lastName),
    company: msg((m) => m.Contact.company),
    email: msg((m) => m.Contact.email),
    phone: msg((m) => m.Contact.phone),
    officeQuestion: msg((m) => m.Contact.officeType),
    teamSizeQuestion: msg((m) => m.Contact.teamSize),
    servicesQuestion: msg((m) => m.Contact.services),
    servicesHint: msg((m) => m.Contact.servicesHint),
    messageLabel: msg((m) => m.Contact.message),
    submit: msg((m) => m.Contact.submit),
    successTitle: msg((m) => m.Contact.successTitle),
    successBody: msg((m) => m.Contact.successBody),
    // The answers of the form on businesscentercapellen.lu; the first service renamed by BCC.
    officeTypes: [
      {
        id: 'coworking',
        label: msg((m) => m.Contact.officeCoworking),
        finder: 'coworking',
      },
      {
        id: 'private-office',
        label: msg((m) => m.Contact.officePrivate),
        finder: 'private-office',
        askTeamSize: true,
      },
    ],
    services: [
      { id: 'office-rental', label: msg((m) => m.Contact.serviceOfficeRental) },
      { id: 'accounting', label: msg((m) => m.Contact.serviceAccounting) },
      { id: 'parking', label: msg((m) => m.Contact.serviceParking) },
      { id: 'mail', label: msg((m) => m.Contact.serviceMail) },
      {
        id: 'meeting-rooms',
        label: msg((m) => m.Contact.serviceMeetingRooms),
        finder: 'meeting-room',
      },
      { id: 'private-cloud', label: msg((m) => m.Contact.servicePrivateCloud) },
      { id: 'other', label: msg((m) => m.Contact.serviceOther) },
    ],
  },
  cta: {
    title: msg((m) => m.Contact.ctaTitle),
    body: msg((m) => m.Contact.ctaBody),
    mapButton: msg((m) => m.Footer.openMap),
    image: homeFallback.final.image,
  },
  gallery: {
    title: {
      en: 'Take a look inside',
      fr: 'Découvrez nos locaux',
      de: 'Ein Blick in unsere Räume',
      lu: 'E Bléck an eis Raim',
    },
    photos: [
      photo(1, {
        en: 'Entrance hall with the glass-walled BCC office',
        fr: 'Hall d’entrée avec le bureau vitré de BCC',
        de: 'Eingangshalle mit dem verglasten BCC-Büro',
        lu: 'Entréeshal mat dem verglaaste BCC-Büro',
      }),
      photo(2, {
        en: 'Lobby with mailboxes',
        fr: 'Hall avec les boîtes aux lettres',
        de: 'Foyer mit Briefkästen',
        lu: 'Hal mat de Bréifkëschten',
      }),
      photo(3, {
        en: 'Office with a round table and a printer',
        fr: 'Bureau avec une table ronde et une imprimante',
        de: 'Büro mit rundem Tisch und Drucker',
        lu: 'Büro mat engem ronnen Dësch an engem Drécker',
      }),
      photo(4, {
        en: 'Meeting room with a long table and a projector',
        fr: 'Salle de réunion avec une grande table et un projecteur',
        de: 'Besprechungsraum mit langem Tisch und Beamer',
        lu: 'Versammlungsraum mat engem laangen Dësch an engem Beamer',
      }),
      photo(5, {
        en: 'Meeting room seen from the door',
        fr: 'Salle de réunion vue depuis la porte',
        de: 'Besprechungsraum, von der Tür aus gesehen',
        lu: 'Versammlungsraum, vun der Dier aus gesinn',
      }),
      photo(6, {
        en: 'Waiting area with blue chairs',
        fr: 'Espace d’attente avec des chaises bleues',
        de: 'Wartebereich mit blauen Stühlen',
        lu: 'Waardeberäich mat bloe Still',
      }),
      photo(7, {
        en: 'Meeting room with a screen, next to the corridor',
        fr: 'Salle de réunion avec un écran, à côté du couloir',
        de: 'Besprechungsraum mit Bildschirm neben dem Flur',
        lu: 'Versammlungsraum mat Bildschierm nieft dem Gank',
      }),
      photo(8, {
        en: 'Corridor with office doors and stairs',
        fr: 'Couloir avec des portes de bureaux et un escalier',
        de: 'Flur mit Bürotüren und Treppe',
        lu: 'Gank mat Bürosdieren an enger Trap',
      }),
      photo(9, {
        en: 'Landing at the top of the stairs',
        fr: 'Palier en haut de l’escalier',
        de: 'Treppenabsatz oben an der Treppe',
        lu: 'Pallier uewen un der Trap',
      }),
      photo(10, {
        en: 'Reception desk by the entrance',
        fr: 'Comptoir d’accueil près de l’entrée',
        de: 'Empfangstheke am Eingang',
        lu: 'Empfangstheek bei der Entrée',
      }),
      photo(11, {
        en: 'Door of office B03',
        fr: 'Porte du bureau B03',
        de: 'Tür zum Büro B03',
        lu: 'Dier vum Büro B03',
      }),
      photo(12, {
        en: 'Corridor leading to the offices',
        fr: 'Couloir menant aux bureaux',
        de: 'Flur zu den Büros',
        lu: 'Gank bei d’Büroen',
      }),
      photo(13, {
        en: 'Corridor next to a meeting room',
        fr: 'Couloir à côté d’une salle de réunion',
        de: 'Flur neben einem Besprechungsraum',
        lu: 'Gank nieft engem Versammlungsraum',
      }),
      photo(14, {
        en: 'Meeting room with a screen and an oval table',
        fr: 'Salle de réunion avec un écran et une table ovale',
        de: 'Besprechungsraum mit Bildschirm und ovalem Tisch',
        lu: 'Versammlungsraum mat Bildschierm an engem ovalen Dësch',
      }),
      photo(15, {
        en: 'Long meeting table facing a screen',
        fr: 'Grande table de réunion face à un écran',
        de: 'Langer Besprechungstisch vor einem Bildschirm',
        lu: 'Laange Versammlungsdësch virun engem Bildschierm',
      }),
      photo(16, {
        en: 'Shared kitchen with a dining table',
        fr: 'Cuisine commune avec une table à manger',
        de: 'Gemeinschaftsküche mit Esstisch',
        lu: 'Gemeinschaftskichen mat engem Iessdësch',
      }),
      photo(17, {
        en: 'Break room with table football and an exercise bike',
        fr: 'Salle de pause avec un baby-foot et un vélo d’appartement',
        de: 'Pausenraum mit Tischkicker und Heimtrainer',
        lu: 'Pausesall mat Kicker an Hometrainer',
      }),
      photo(18, {
        en: 'Lounge with a sofa, table football and a TV',
        fr: 'Salon avec un canapé, un baby-foot et une télévision',
        de: 'Lounge mit Sofa, Tischkicker und Fernseher',
        lu: 'Lounge mat engem Canapé, Kicker a Fernseh',
      }),
      photo(19, {
        en: 'Staircase between the floors',
        fr: 'Escalier entre les étages',
        de: 'Treppe zwischen den Etagen',
        lu: 'Trap tëscht den Etagen',
      }),
      photo(20, {
        en: 'Meeting room with an oval table',
        fr: 'Salle de réunion avec une table ovale',
        de: 'Besprechungsraum mit ovalem Tisch',
        lu: 'Versammlungsraum mat engem ovalen Dësch',
      }),
    ],
  },
};
