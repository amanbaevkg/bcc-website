import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite';
import { fillContactForm } from '../payload/seed';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`contact_form_office_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`finder\` text DEFAULT 'none',
  	\`ask_team_size\` integer DEFAULT false,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`contact_form_office_types_order_idx\` ON \`contact_form_office_types\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`contact_form_office_types_parent_id_idx\` ON \`contact_form_office_types\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`contact_form_office_types_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_form_office_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`contact_form_office_types_locales_locale_parent_id_unique\` ON \`contact_form_office_types_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`contact_form_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`finder\` text DEFAULT 'none',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`contact_form_services_order_idx\` ON \`contact_form_services\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`contact_form_services_parent_id_idx\` ON \`contact_form_services\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`contact_form_services_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_form_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`contact_form_services_locales_locale_parent_id_unique\` ON \`contact_form_services_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_contact_v_version_form_office_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`finder\` text DEFAULT 'none',
  	\`ask_team_size\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_contact_v_version_form_office_types_order_idx\` ON \`_contact_v_version_form_office_types\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_contact_v_version_form_office_types_parent_id_idx\` ON \`_contact_v_version_form_office_types\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_contact_v_version_form_office_types_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v_version_form_office_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_contact_v_version_form_office_types_locales_locale_parent_i\` ON \`_contact_v_version_form_office_types_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_contact_v_version_form_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`finder\` text DEFAULT 'none',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_contact_v_version_form_services_order_idx\` ON \`_contact_v_version_form_services\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_contact_v_version_form_services_parent_id_idx\` ON \`_contact_v_version_form_services\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_contact_v_version_form_services_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v_version_form_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_contact_v_version_form_services_locales_locale_parent_id_un\` ON \`_contact_v_version_form_services_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_form_title\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_first_name\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_last_name\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_company\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_email\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_phone\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_message_label\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_submit\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_office_question\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_team_size_question\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_services_question\` text;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` ADD \`form_services_hint\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_form_title\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_first_name\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_last_name\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_company\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_email\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_phone\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_message_label\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_submit\` text;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_office_question\` text;`);
  await db.run(
    sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_team_size_question\` text;`,
  );
  await db.run(
    sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_services_question\` text;`,
  );
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` ADD \`version_form_services_hint\` text;`);

  // A site set up before this change: copy the form's current words and answers into the admin,
  // so the Contact page shows them and can be saved. A new site gets them from the first-start import.
  const contact = (await payload.findGlobal({ slug: 'contact', locale: 'en', depth: 0, req })) as {
    top?: { title?: string | null };
  };
  if (contact?.top?.title) {
    try {
      await fillContactForm(payload, req);
    } catch (error) {
      // The site keeps showing the built-in words and answers until they are filled in the admin.
      payload.logger.error({ err: error }, '[admin] contact form texts could not be copied');
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`contact_form_office_types\`;`);
  await db.run(sql`DROP TABLE \`contact_form_office_types_locales\`;`);
  await db.run(sql`DROP TABLE \`contact_form_services\`;`);
  await db.run(sql`DROP TABLE \`contact_form_services_locales\`;`);
  await db.run(sql`DROP TABLE \`_contact_v_version_form_office_types\`;`);
  await db.run(sql`DROP TABLE \`_contact_v_version_form_office_types_locales\`;`);
  await db.run(sql`DROP TABLE \`_contact_v_version_form_services\`;`);
  await db.run(sql`DROP TABLE \`_contact_v_version_form_services_locales\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_form_title\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_first_name\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_last_name\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_company\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_email\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_phone\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_message_label\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_submit\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_office_question\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_team_size_question\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_services_question\`;`);
  await db.run(sql`ALTER TABLE \`contact_locales\` DROP COLUMN \`form_services_hint\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_form_title\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_first_name\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_last_name\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_company\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_email\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_phone\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_message_label\`;`);
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_submit\`;`);
  await db.run(
    sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_office_question\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_team_size_question\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_services_question\`;`,
  );
  await db.run(sql`ALTER TABLE \`_contact_v_locales\` DROP COLUMN \`version_form_services_hint\`;`);
}
