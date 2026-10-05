import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { Contact } from './payload/globals/Contact';
import { About } from './payload/globals/About';
import { Home } from './payload/globals/Home';
import { Services } from './payload/globals/Services';
import { SiteSettings } from './payload/globals/SiteSettings';
import { LegalPages } from './payload/collections/LegalPages';
import { Media } from './payload/collections/Media';
import { News } from './payload/collections/News';
import { Users } from './payload/collections/Users';
import { bootstrap } from './payload/bootstrap';
import { adminEmail } from './payload/email';
import { migrations } from './migrations';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const databaseUrl = process.env.DATABASE_URL || 'file:./data/payload.db';
// SQLite creates the file but not its folder.
if (databaseUrl.startsWith('file:')) {
  fs.mkdirSync(path.dirname(path.resolve(databaseUrl.slice('file:'.length))), { recursive: true });
}

/**
 * The website's admin (/admin): Payload CMS inside this Next.js app, data in one SQLite file
 * (DATABASE_URL) and uploads in PAYLOAD_MEDIA_DIR. No outside service is involved.
 */
export default buildConfig({
  serverURL: process.env.SITE_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || '',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' – BCC admin',
      icons: [{ rel: 'icon', type: 'image/png', url: '/icon.png' }],
    },
    components: {
      // An eye button in every password field to show what was typed.
      providers: ['@/payload/admin/PasswordEye#PasswordEye'],
      graphics: {
        Icon: '@/payload/admin/Brand#Icon',
        Logo: '@/payload/admin/Brand#Logo',
      },
    },
    // No Gravatar look-ups: the admin contacts no outside service.
    avatar: 'default',
    importMap: { baseDir: dirname },
  },
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'fr', label: 'Français' },
      { code: 'de', label: 'Deutsch' },
      { code: 'lu', label: 'Lëtzebuergesch' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  // Order and groups decide the admin's menu: "Website" (news, then the pages), then "Settings".
  collections: [News, LegalPages, Media, Users],
  globals: [Home, About, Services, Contact, SiteSettings],
  editor: lexicalEditor(),
  email: adminEmail,
  db: sqliteAdapter({
    client: { url: databaseUrl },
    // The live server applies the schema from src/migrations on start; development syncs it.
    prodMigrations: migrations,
  }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  csrf: [process.env.SITE_URL || 'http://localhost:3000'],
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  onInit: bootstrap,
});
