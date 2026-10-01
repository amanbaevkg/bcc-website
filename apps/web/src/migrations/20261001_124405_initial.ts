import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`);
  await db.run(
    sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`role\` text DEFAULT 'editor' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`reset_password_requested_at\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `);
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`);
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`);
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `);
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`);
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`);
  await db.run(sql`CREATE TABLE \`media_locales\` (
  	\`alt\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`media_locales_locale_parent_id_unique\` ON \`media_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`client_logos\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`url\` text,
  	\`active\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(sql`CREATE INDEX \`client_logos_logo_idx\` ON \`client_logos\` (\`logo_id\`);`);
  await db.run(
    sql`CREATE INDEX \`client_logos_updated_at_idx\` ON \`client_logos\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`client_logos_created_at_idx\` ON \`client_logos\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`spaces\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`category\` text,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(sql`CREATE INDEX \`spaces_image_idx\` ON \`spaces\` (\`image_id\`);`);
  await db.run(sql`CREATE INDEX \`spaces_updated_at_idx\` ON \`spaces\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`spaces_created_at_idx\` ON \`spaces\` (\`created_at\`);`);
  await db.run(sql`CREATE TABLE \`spaces_locales\` (
  	\`caption\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`spaces\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`spaces_locales_locale_parent_id_unique\` ON \`spaces_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`quote_language\` text DEFAULT 'en' NOT NULL,
  	\`name\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`rating\` numeric DEFAULT 5 NOT NULL,
  	\`consent\` integer,
  	\`order\` numeric DEFAULT 100,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`testimonials_locales\` (
  	\`role\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`testimonials_locales_locale_parent_id_unique\` ON \`testimonials_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`date\` text,
  	\`cover_id\` integer,
  	\`author\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(sql`CREATE UNIQUE INDEX \`news_slug_idx\` ON \`news\` (\`slug\`);`);
  await db.run(sql`CREATE INDEX \`news_cover_idx\` ON \`news\` (\`cover_id\`);`);
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`news__status_idx\` ON \`news\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`news_locales\` (
  	\`title\` text,
  	\`excerpt\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`news_locales_locale_parent_id_unique\` ON \`news_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_date\` text,
  	\`version_cover_id\` integer,
  	\`version_author\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(sql`CREATE INDEX \`_news_v_parent_idx\` ON \`_news_v\` (\`parent_id\`);`);
  await db.run(
    sql`CREATE INDEX \`_news_v_version_version_slug_idx\` ON \`_news_v\` (\`version_slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_news_v_version_version_cover_idx\` ON \`_news_v\` (\`version_cover_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_news_v_version_version_updated_at_idx\` ON \`_news_v\` (\`version_updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_news_v_version_version_created_at_idx\` ON \`_news_v\` (\`version_created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_news_v_version_version__status_idx\` ON \`_news_v\` (\`version__status\`);`,
  );
  await db.run(sql`CREATE INDEX \`_news_v_created_at_idx\` ON \`_news_v\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`_news_v_updated_at_idx\` ON \`_news_v\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`_news_v_snapshot_idx\` ON \`_news_v\` (\`snapshot\`);`);
  await db.run(
    sql`CREATE INDEX \`_news_v_published_locale_idx\` ON \`_news_v\` (\`published_locale\`);`,
  );
  await db.run(sql`CREATE INDEX \`_news_v_latest_idx\` ON \`_news_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`_news_v_locales\` (
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_news_v_locales_locale_parent_id_unique\` ON \`_news_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`legal_pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`kind\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(sql`CREATE UNIQUE INDEX \`legal_pages_kind_idx\` ON \`legal_pages\` (\`kind\`);`);
  await db.run(
    sql`CREATE INDEX \`legal_pages_updated_at_idx\` ON \`legal_pages\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`legal_pages_created_at_idx\` ON \`legal_pages\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`legal_pages_locales\` (
  	\`title\` text,
  	\`body\` text,
  	\`last_updated\` text,
  	\`approved\` integer,
  	\`approved_by\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`legal_pages_locales_locale_parent_id_unique\` ON \`legal_pages_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `);
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`);
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`client_logos_id\` integer,
  	\`spaces_id\` integer,
  	\`testimonials_id\` integer,
  	\`news_id\` integer,
  	\`legal_pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_logos_id\`) REFERENCES \`client_logos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`spaces_id\`) REFERENCES \`spaces\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`legal_pages_id\`) REFERENCES \`legal_pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_client_logos_id_idx\` ON \`payload_locked_documents_rels\` (\`client_logos_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_spaces_id_idx\` ON \`payload_locked_documents_rels\` (\`spaces_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_legal_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_pages_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`home_hero_workspace_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`code\` text,
  	\`has_team_size\` integer,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`home_hero_workspace_types_order_idx\` ON \`home_hero_workspace_types\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`home_hero_workspace_types_parent_id_idx\` ON \`home_hero_workspace_types\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`home_hero_workspace_types_locales\` (
  	\`name\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_hero_workspace_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`home_hero_workspace_types_locales_locale_parent_id_unique\` ON \`home_hero_workspace_types_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`home\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_video_mp4_1080_id\` integer,
  	\`hero_video_mp4_720_id\` integer,
  	\`hero_video_mp4_480_id\` integer,
  	\`hero_video_poster_id\` integer,
  	\`hero_cta_href\` text,
  	\`hero_ring_href\` text,
  	\`coworking_href\` text DEFAULT '/services',
  	\`private_offices_href\` text DEFAULT '/services',
  	\`services_link_href\` text,
  	\`spaces_more_link_href\` text,
  	\`tomorrow_image_id\` integer,
  	\`find_more_cta_href\` text,
  	\`final_cta_href\` text,
  	\`final_image_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_video_mp4_1080_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_video_mp4_720_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_video_mp4_480_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_video_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`tomorrow_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`final_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`home_hero_video_hero_video_mp4_1080_idx\` ON \`home\` (\`hero_video_mp4_1080_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`home_hero_video_hero_video_mp4_720_idx\` ON \`home\` (\`hero_video_mp4_720_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`home_hero_video_hero_video_mp4_480_idx\` ON \`home\` (\`hero_video_mp4_480_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`home_hero_video_hero_video_poster_idx\` ON \`home\` (\`hero_video_poster_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`home_tomorrow_tomorrow_image_idx\` ON \`home\` (\`tomorrow_image_id\`);`,
  );
  await db.run(sql`CREATE INDEX \`home_final_final_image_idx\` ON \`home\` (\`final_image_id\`);`);
  await db.run(sql`CREATE INDEX \`home__status_idx\` ON \`home\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`home_locales\` (
  	\`hero_eyebrow\` text,
  	\`hero_title\` text,
  	\`hero_title_accent\` text,
  	\`hero_subtitle\` text,
  	\`hero_cta_label\` text,
  	\`hero_ring_label\` text,
  	\`coworking_title\` text,
  	\`coworking_body\` text,
  	\`private_offices_title\` text,
  	\`private_offices_body\` text,
  	\`services_link_label\` text,
  	\`trust_title\` text,
  	\`spaces_title\` text,
  	\`spaces_more_link_label\` text,
  	\`tomorrow_lines\` text,
  	\`tomorrow_card\` text,
  	\`find_more_title\` text,
  	\`find_more_cta_label\` text,
  	\`testimonials_title\` text,
  	\`final_lines\` text,
  	\`final_cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`home_locales_locale_parent_id_unique\` ON \`home_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`home_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`home_numbers_order_parent_idx\` ON \`home_numbers\` (\`order\`,\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`home_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`client_logos_id\` integer,
  	\`spaces_id\` integer,
  	\`testimonials_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`home\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_logos_id\`) REFERENCES \`client_logos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`spaces_id\`) REFERENCES \`spaces\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`home_rels_order_idx\` ON \`home_rels\` (\`order\`);`);
  await db.run(sql`CREATE INDEX \`home_rels_parent_idx\` ON \`home_rels\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`home_rels_path_idx\` ON \`home_rels\` (\`path\`);`);
  await db.run(sql`CREATE INDEX \`home_rels_media_id_idx\` ON \`home_rels\` (\`media_id\`);`);
  await db.run(
    sql`CREATE INDEX \`home_rels_client_logos_id_idx\` ON \`home_rels\` (\`client_logos_id\`);`,
  );
  await db.run(sql`CREATE INDEX \`home_rels_spaces_id_idx\` ON \`home_rels\` (\`spaces_id\`);`);
  await db.run(
    sql`CREATE INDEX \`home_rels_testimonials_id_idx\` ON \`home_rels\` (\`testimonials_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_home_v_version_hero_workspace_types\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`code\` text,
  	\`has_team_size\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_home_v_version_hero_workspace_types_order_idx\` ON \`_home_v_version_hero_workspace_types\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_hero_workspace_types_parent_id_idx\` ON \`_home_v_version_hero_workspace_types\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_home_v_version_hero_workspace_types_locales\` (
  	\`name\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v_version_hero_workspace_types\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_home_v_version_hero_workspace_types_locales_locale_parent_i\` ON \`_home_v_version_hero_workspace_types_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_home_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_video_mp4_1080_id\` integer,
  	\`version_hero_video_mp4_720_id\` integer,
  	\`version_hero_video_mp4_480_id\` integer,
  	\`version_hero_video_poster_id\` integer,
  	\`version_hero_cta_href\` text,
  	\`version_hero_ring_href\` text,
  	\`version_coworking_href\` text DEFAULT '/services',
  	\`version_private_offices_href\` text DEFAULT '/services',
  	\`version_services_link_href\` text,
  	\`version_spaces_more_link_href\` text,
  	\`version_tomorrow_image_id\` integer,
  	\`version_find_more_cta_href\` text,
  	\`version_final_cta_href\` text,
  	\`version_final_image_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_video_mp4_1080_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_video_mp4_720_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_video_mp4_480_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_video_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_tomorrow_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_final_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_home_v_version_hero_video_version_hero_video_mp4_1080_idx\` ON \`_home_v\` (\`version_hero_video_mp4_1080_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_hero_video_version_hero_video_mp4_720_idx\` ON \`_home_v\` (\`version_hero_video_mp4_720_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_hero_video_version_hero_video_mp4_480_idx\` ON \`_home_v\` (\`version_hero_video_mp4_480_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_hero_video_version_hero_video_poster_idx\` ON \`_home_v\` (\`version_hero_video_poster_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_tomorrow_version_tomorrow_image_idx\` ON \`_home_v\` (\`version_tomorrow_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_final_version_final_image_idx\` ON \`_home_v\` (\`version_final_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_version_version__status_idx\` ON \`_home_v\` (\`version__status\`);`,
  );
  await db.run(sql`CREATE INDEX \`_home_v_created_at_idx\` ON \`_home_v\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`_home_v_updated_at_idx\` ON \`_home_v\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`_home_v_snapshot_idx\` ON \`_home_v\` (\`snapshot\`);`);
  await db.run(
    sql`CREATE INDEX \`_home_v_published_locale_idx\` ON \`_home_v\` (\`published_locale\`);`,
  );
  await db.run(sql`CREATE INDEX \`_home_v_latest_idx\` ON \`_home_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`_home_v_locales\` (
  	\`version_hero_eyebrow\` text,
  	\`version_hero_title\` text,
  	\`version_hero_title_accent\` text,
  	\`version_hero_subtitle\` text,
  	\`version_hero_cta_label\` text,
  	\`version_hero_ring_label\` text,
  	\`version_coworking_title\` text,
  	\`version_coworking_body\` text,
  	\`version_private_offices_title\` text,
  	\`version_private_offices_body\` text,
  	\`version_services_link_label\` text,
  	\`version_trust_title\` text,
  	\`version_spaces_title\` text,
  	\`version_spaces_more_link_label\` text,
  	\`version_tomorrow_lines\` text,
  	\`version_tomorrow_card\` text,
  	\`version_find_more_title\` text,
  	\`version_find_more_cta_label\` text,
  	\`version_testimonials_title\` text,
  	\`version_final_lines\` text,
  	\`version_final_cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_home_v_locales_locale_parent_id_unique\` ON \`_home_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_home_v_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_home_v_numbers_order_parent_idx\` ON \`_home_v_numbers\` (\`order\`,\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_home_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	\`client_logos_id\` integer,
  	\`spaces_id\` integer,
  	\`testimonials_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_home_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_logos_id\`) REFERENCES \`client_logos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`spaces_id\`) REFERENCES \`spaces\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`testimonials_id\`) REFERENCES \`testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`_home_v_rels_order_idx\` ON \`_home_v_rels\` (\`order\`);`);
  await db.run(sql`CREATE INDEX \`_home_v_rels_parent_idx\` ON \`_home_v_rels\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`_home_v_rels_path_idx\` ON \`_home_v_rels\` (\`path\`);`);
  await db.run(sql`CREATE INDEX \`_home_v_rels_media_id_idx\` ON \`_home_v_rels\` (\`media_id\`);`);
  await db.run(
    sql`CREATE INDEX \`_home_v_rels_client_logos_id_idx\` ON \`_home_v_rels\` (\`client_logos_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_rels_spaces_id_idx\` ON \`_home_v_rels\` (\`spaces_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_home_v_rels_testimonials_id_idx\` ON \`_home_v_rels\` (\`testimonials_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`about_highlights_order_idx\` ON \`about_highlights\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`about_highlights_parent_id_idx\` ON \`about_highlights\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about_highlights_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`about_highlights_locales_locale_parent_id_unique\` ON \`about_highlights_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about_figures\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`about_figures_order_idx\` ON \`about_figures\` (\`_order\`);`);
  await db.run(
    sql`CREATE INDEX \`about_figures_parent_id_idx\` ON \`about_figures\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about_figures_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_figures\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`about_figures_locales_locale_parent_id_unique\` ON \`about_figures_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`cta_href\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`about_features_order_idx\` ON \`about_features\` (\`_order\`);`);
  await db.run(
    sql`CREATE INDEX \`about_features_parent_id_idx\` ON \`about_features\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`about_features_image_idx\` ON \`about_features\` (\`image_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about_features_locales\` (
  	\`title\` text,
  	\`body\` text,
  	\`note\` text,
  	\`cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`about_features_locales_locale_parent_id_unique\` ON \`about_features_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`about\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_image_id\` integer,
  	\`visit_cta_href\` text,
  	\`visit_image_id\` integer,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`visit_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(sql`CREATE INDEX \`about_hero_hero_image_idx\` ON \`about\` (\`hero_image_id\`);`);
  await db.run(
    sql`CREATE INDEX \`about_visit_visit_image_idx\` ON \`about\` (\`visit_image_id\`);`,
  );
  await db.run(sql`CREATE INDEX \`about__status_idx\` ON \`about\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`about_locales\` (
  	\`hero_eyebrow\` text,
  	\`hero_title\` text,
  	\`hero_title_accent\` text,
  	\`hero_body\` text,
  	\`location\` text,
  	\`audience\` text,
  	\`visit_eyebrow\` text,
  	\`visit_title\` text,
  	\`visit_cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`about_locales_locale_parent_id_unique\` ON \`about_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v_version_highlights\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_about_v_version_highlights_order_idx\` ON \`_about_v_version_highlights\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_about_v_version_highlights_parent_id_idx\` ON \`_about_v_version_highlights\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v_version_highlights_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v_version_highlights\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_about_v_version_highlights_locales_locale_parent_id_unique\` ON \`_about_v_version_highlights_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v_version_figures\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_about_v_version_figures_order_idx\` ON \`_about_v_version_figures\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_about_v_version_figures_parent_id_idx\` ON \`_about_v_version_figures\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v_version_figures_locales\` (
  	\`label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v_version_figures\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_about_v_version_figures_locales_locale_parent_id_unique\` ON \`_about_v_version_figures_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v_version_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`cta_href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_about_v_version_features_order_idx\` ON \`_about_v_version_features\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_about_v_version_features_parent_id_idx\` ON \`_about_v_version_features\` (\`_parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_about_v_version_features_image_idx\` ON \`_about_v_version_features\` (\`image_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v_version_features_locales\` (
  	\`title\` text,
  	\`body\` text,
  	\`note\` text,
  	\`cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v_version_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_about_v_version_features_locales_locale_parent_id_unique\` ON \`_about_v_version_features_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_about_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_image_id\` integer,
  	\`version_visit_cta_href\` text,
  	\`version_visit_image_id\` integer,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_visit_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_about_v_version_hero_version_hero_image_idx\` ON \`_about_v\` (\`version_hero_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_about_v_version_visit_version_visit_image_idx\` ON \`_about_v\` (\`version_visit_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_about_v_version_version__status_idx\` ON \`_about_v\` (\`version__status\`);`,
  );
  await db.run(sql`CREATE INDEX \`_about_v_created_at_idx\` ON \`_about_v\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`_about_v_updated_at_idx\` ON \`_about_v\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`_about_v_snapshot_idx\` ON \`_about_v\` (\`snapshot\`);`);
  await db.run(
    sql`CREATE INDEX \`_about_v_published_locale_idx\` ON \`_about_v\` (\`published_locale\`);`,
  );
  await db.run(sql`CREATE INDEX \`_about_v_latest_idx\` ON \`_about_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`_about_v_locales\` (
  	\`version_hero_eyebrow\` text,
  	\`version_hero_title\` text,
  	\`version_hero_title_accent\` text,
  	\`version_hero_body\` text,
  	\`version_location\` text,
  	\`version_audience\` text,
  	\`version_visit_eyebrow\` text,
  	\`version_visit_title\` text,
  	\`version_visit_cta_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_about_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_about_v_locales_locale_parent_id_unique\` ON \`_about_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`services_hero_body\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`services_hero_body_order_idx\` ON \`services_hero_body\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`services_hero_body_parent_id_idx\` ON \`services_hero_body\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`services_hero_body_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_hero_body\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`services_hero_body_locales_locale_parent_id_unique\` ON \`services_hero_body_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`services_offers_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`services_offers_items_order_idx\` ON \`services_offers_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`services_offers_items_parent_id_idx\` ON \`services_offers_items\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`services_offers_items_locales\` (
  	\`title\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services_offers_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`services_offers_items_locales_locale_parent_id_unique\` ON \`services_offers_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`services\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`choose_coworking_cta_href\` text,
  	\`choose_coworking_image_id\` integer,
  	\`choose_private_offices_image_id\` integer,
  	\`cta_link_href\` text,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`choose_coworking_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`choose_private_offices_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`services_choose_coworking_choose_coworking_image_idx\` ON \`services\` (\`choose_coworking_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`services_choose_private_offices_choose_private_offices_i_idx\` ON \`services\` (\`choose_private_offices_image_id\`);`,
  );
  await db.run(sql`CREATE INDEX \`services__status_idx\` ON \`services\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`services_locales\` (
  	\`hero_eyebrow\` text,
  	\`hero_title\` text,
  	\`choose_title\` text,
  	\`choose_coworking_title\` text,
  	\`choose_coworking_kicker\` text,
  	\`choose_coworking_body\` text,
  	\`choose_coworking_packages\` text,
  	\`choose_coworking_highlight\` text,
  	\`choose_coworking_audience\` text,
  	\`choose_coworking_cta_label\` text,
  	\`choose_private_offices_title\` text,
  	\`choose_private_offices_size_note\` text,
  	\`offers_title\` text,
  	\`cta_title\` text,
  	\`cta_link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`services_locales_locale_parent_id_unique\` ON \`services_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`services_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`services_numbers_order_parent_idx\` ON \`services_numbers\` (\`order\`,\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_services_v_version_hero_body\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_services_v_version_hero_body_order_idx\` ON \`_services_v_version_hero_body\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_services_v_version_hero_body_parent_id_idx\` ON \`_services_v_version_hero_body\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_services_v_version_hero_body_locales\` (
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v_version_hero_body\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_services_v_version_hero_body_locales_locale_parent_id_uniqu\` ON \`_services_v_version_hero_body_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_services_v_version_offers_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_services_v_version_offers_items_order_idx\` ON \`_services_v_version_offers_items\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_services_v_version_offers_items_parent_id_idx\` ON \`_services_v_version_offers_items\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_services_v_version_offers_items_locales\` (
  	\`title\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v_version_offers_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_services_v_version_offers_items_locales_locale_parent_id_un\` ON \`_services_v_version_offers_items_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_services_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_choose_coworking_cta_href\` text,
  	\`version_choose_coworking_image_id\` integer,
  	\`version_choose_private_offices_image_id\` integer,
  	\`version_cta_link_href\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_choose_coworking_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_choose_private_offices_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_services_v_version_choose_coworking_version_choose_cowo_idx\` ON \`_services_v\` (\`version_choose_coworking_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_services_v_version_choose_private_offices_version_choos_idx\` ON \`_services_v\` (\`version_choose_private_offices_image_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_services_v_version_version__status_idx\` ON \`_services_v\` (\`version__status\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_services_v_created_at_idx\` ON \`_services_v\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_services_v_updated_at_idx\` ON \`_services_v\` (\`updated_at\`);`,
  );
  await db.run(sql`CREATE INDEX \`_services_v_snapshot_idx\` ON \`_services_v\` (\`snapshot\`);`);
  await db.run(
    sql`CREATE INDEX \`_services_v_published_locale_idx\` ON \`_services_v\` (\`published_locale\`);`,
  );
  await db.run(sql`CREATE INDEX \`_services_v_latest_idx\` ON \`_services_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`_services_v_locales\` (
  	\`version_hero_eyebrow\` text,
  	\`version_hero_title\` text,
  	\`version_choose_title\` text,
  	\`version_choose_coworking_title\` text,
  	\`version_choose_coworking_kicker\` text,
  	\`version_choose_coworking_body\` text,
  	\`version_choose_coworking_packages\` text,
  	\`version_choose_coworking_highlight\` text,
  	\`version_choose_coworking_audience\` text,
  	\`version_choose_coworking_cta_label\` text,
  	\`version_choose_private_offices_title\` text,
  	\`version_choose_private_offices_size_note\` text,
  	\`version_offers_title\` text,
  	\`version_cta_title\` text,
  	\`version_cta_link_label\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_services_v_locales_locale_parent_id_unique\` ON \`_services_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_services_v_numbers\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`number\` numeric,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_services_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_services_v_numbers_order_parent_idx\` ON \`_services_v_numbers\` (\`order\`,\`parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`contact\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `);
  await db.run(sql`CREATE INDEX \`contact__status_idx\` ON \`contact\` (\`_status\`);`);
  await db.run(sql`CREATE TABLE \`contact_locales\` (
  	\`gallery_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`contact_locales_locale_parent_id_unique\` ON \`contact_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`contact_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`contact\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`contact_rels_order_idx\` ON \`contact_rels\` (\`order\`);`);
  await db.run(sql`CREATE INDEX \`contact_rels_parent_idx\` ON \`contact_rels\` (\`parent_id\`);`);
  await db.run(sql`CREATE INDEX \`contact_rels_path_idx\` ON \`contact_rels\` (\`path\`);`);
  await db.run(sql`CREATE INDEX \`contact_rels_media_id_idx\` ON \`contact_rels\` (\`media_id\`);`);
  await db.run(sql`CREATE TABLE \`_contact_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_contact_v_version_version__status_idx\` ON \`_contact_v\` (\`version__status\`);`,
  );
  await db.run(sql`CREATE INDEX \`_contact_v_created_at_idx\` ON \`_contact_v\` (\`created_at\`);`);
  await db.run(sql`CREATE INDEX \`_contact_v_updated_at_idx\` ON \`_contact_v\` (\`updated_at\`);`);
  await db.run(sql`CREATE INDEX \`_contact_v_snapshot_idx\` ON \`_contact_v\` (\`snapshot\`);`);
  await db.run(
    sql`CREATE INDEX \`_contact_v_published_locale_idx\` ON \`_contact_v\` (\`published_locale\`);`,
  );
  await db.run(sql`CREATE INDEX \`_contact_v_latest_idx\` ON \`_contact_v\` (\`latest\`);`);
  await db.run(sql`CREATE TABLE \`_contact_v_locales\` (
  	\`version_gallery_title\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_contact_v_locales_locale_parent_id_unique\` ON \`_contact_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_contact_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_contact_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(sql`CREATE INDEX \`_contact_v_rels_order_idx\` ON \`_contact_v_rels\` (\`order\`);`);
  await db.run(
    sql`CREATE INDEX \`_contact_v_rels_parent_idx\` ON \`_contact_v_rels\` (\`parent_id\`);`,
  );
  await db.run(sql`CREATE INDEX \`_contact_v_rels_path_idx\` ON \`_contact_v_rels\` (\`path\`);`);
  await db.run(
    sql`CREATE INDEX \`_contact_v_rels_media_id_idx\` ON \`_contact_v_rels\` (\`media_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`site_settings_social\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`network\` text NOT NULL,
  	\`url\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`site_settings_social_order_idx\` ON \`site_settings_social\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`site_settings_social_parent_id_idx\` ON \`site_settings_social\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`email\` text NOT NULL,
  	\`phone\` text NOT NULL,
  	\`address_street\` text NOT NULL,
  	\`address_postal_code\` text NOT NULL,
  	\`address_city\` text NOT NULL,
  	\`map_url\` text,
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `);
  await db.run(sql`CREATE TABLE \`site_settings_locales\` (
  	\`tagline\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`site_settings_locales_locale_parent_id_unique\` ON \`site_settings_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_site_settings_v_version_social\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`network\` text NOT NULL,
  	\`url\` text NOT NULL,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_site_settings_v_version_social_order_idx\` ON \`_site_settings_v_version_social\` (\`_order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_site_settings_v_version_social_parent_id_idx\` ON \`_site_settings_v_version_social\` (\`_parent_id\`);`,
  );
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_email\` text NOT NULL,
  	\`version_phone\` text NOT NULL,
  	\`version_address_street\` text NOT NULL,
  	\`version_address_postal_code\` text NOT NULL,
  	\`version_address_city\` text NOT NULL,
  	\`version_map_url\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `);
  await db.run(
    sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`,
  );
  await db.run(sql`CREATE TABLE \`_site_settings_v_locales\` (
  	\`version_tagline\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_site_settings_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE UNIQUE INDEX \`_site_settings_v_locales_locale_parent_id_unique\` ON \`_site_settings_v_locales\` (\`_locale\`,\`_parent_id\`);`,
  );
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`);
  await db.run(sql`DROP TABLE \`users\`;`);
  await db.run(sql`DROP TABLE \`media\`;`);
  await db.run(sql`DROP TABLE \`media_locales\`;`);
  await db.run(sql`DROP TABLE \`client_logos\`;`);
  await db.run(sql`DROP TABLE \`spaces\`;`);
  await db.run(sql`DROP TABLE \`spaces_locales\`;`);
  await db.run(sql`DROP TABLE \`testimonials\`;`);
  await db.run(sql`DROP TABLE \`testimonials_locales\`;`);
  await db.run(sql`DROP TABLE \`news\`;`);
  await db.run(sql`DROP TABLE \`news_locales\`;`);
  await db.run(sql`DROP TABLE \`_news_v\`;`);
  await db.run(sql`DROP TABLE \`_news_v_locales\`;`);
  await db.run(sql`DROP TABLE \`legal_pages\`;`);
  await db.run(sql`DROP TABLE \`legal_pages_locales\`;`);
  await db.run(sql`DROP TABLE \`payload_kv\`;`);
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`);
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`);
  await db.run(sql`DROP TABLE \`payload_preferences\`;`);
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`);
  await db.run(sql`DROP TABLE \`payload_migrations\`;`);
  await db.run(sql`DROP TABLE \`home_hero_workspace_types\`;`);
  await db.run(sql`DROP TABLE \`home_hero_workspace_types_locales\`;`);
  await db.run(sql`DROP TABLE \`home\`;`);
  await db.run(sql`DROP TABLE \`home_locales\`;`);
  await db.run(sql`DROP TABLE \`home_numbers\`;`);
  await db.run(sql`DROP TABLE \`home_rels\`;`);
  await db.run(sql`DROP TABLE \`_home_v_version_hero_workspace_types\`;`);
  await db.run(sql`DROP TABLE \`_home_v_version_hero_workspace_types_locales\`;`);
  await db.run(sql`DROP TABLE \`_home_v\`;`);
  await db.run(sql`DROP TABLE \`_home_v_locales\`;`);
  await db.run(sql`DROP TABLE \`_home_v_numbers\`;`);
  await db.run(sql`DROP TABLE \`_home_v_rels\`;`);
  await db.run(sql`DROP TABLE \`about_highlights\`;`);
  await db.run(sql`DROP TABLE \`about_highlights_locales\`;`);
  await db.run(sql`DROP TABLE \`about_figures\`;`);
  await db.run(sql`DROP TABLE \`about_figures_locales\`;`);
  await db.run(sql`DROP TABLE \`about_features\`;`);
  await db.run(sql`DROP TABLE \`about_features_locales\`;`);
  await db.run(sql`DROP TABLE \`about\`;`);
  await db.run(sql`DROP TABLE \`about_locales\`;`);
  await db.run(sql`DROP TABLE \`_about_v_version_highlights\`;`);
  await db.run(sql`DROP TABLE \`_about_v_version_highlights_locales\`;`);
  await db.run(sql`DROP TABLE \`_about_v_version_figures\`;`);
  await db.run(sql`DROP TABLE \`_about_v_version_figures_locales\`;`);
  await db.run(sql`DROP TABLE \`_about_v_version_features\`;`);
  await db.run(sql`DROP TABLE \`_about_v_version_features_locales\`;`);
  await db.run(sql`DROP TABLE \`_about_v\`;`);
  await db.run(sql`DROP TABLE \`_about_v_locales\`;`);
  await db.run(sql`DROP TABLE \`services_hero_body\`;`);
  await db.run(sql`DROP TABLE \`services_hero_body_locales\`;`);
  await db.run(sql`DROP TABLE \`services_offers_items\`;`);
  await db.run(sql`DROP TABLE \`services_offers_items_locales\`;`);
  await db.run(sql`DROP TABLE \`services\`;`);
  await db.run(sql`DROP TABLE \`services_locales\`;`);
  await db.run(sql`DROP TABLE \`services_numbers\`;`);
  await db.run(sql`DROP TABLE \`_services_v_version_hero_body\`;`);
  await db.run(sql`DROP TABLE \`_services_v_version_hero_body_locales\`;`);
  await db.run(sql`DROP TABLE \`_services_v_version_offers_items\`;`);
  await db.run(sql`DROP TABLE \`_services_v_version_offers_items_locales\`;`);
  await db.run(sql`DROP TABLE \`_services_v\`;`);
  await db.run(sql`DROP TABLE \`_services_v_locales\`;`);
  await db.run(sql`DROP TABLE \`_services_v_numbers\`;`);
  await db.run(sql`DROP TABLE \`contact\`;`);
  await db.run(sql`DROP TABLE \`contact_locales\`;`);
  await db.run(sql`DROP TABLE \`contact_rels\`;`);
  await db.run(sql`DROP TABLE \`_contact_v\`;`);
  await db.run(sql`DROP TABLE \`_contact_v_locales\`;`);
  await db.run(sql`DROP TABLE \`_contact_v_rels\`;`);
  await db.run(sql`DROP TABLE \`site_settings_social\`;`);
  await db.run(sql`DROP TABLE \`site_settings\`;`);
  await db.run(sql`DROP TABLE \`site_settings_locales\`;`);
  await db.run(sql`DROP TABLE \`_site_settings_v_version_social\`;`);
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`);
  await db.run(sql`DROP TABLE \`_site_settings_v_locales\`;`);
}
