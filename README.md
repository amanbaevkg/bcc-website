# bcc-web

Website for **BCC – Business Center Capellen**, built with Next.js (App Router), React, TypeScript and Node.js.
Four languages (EN default, FR, DE, LU) from one codebase; texts and photos are edited in the built-in
admin at `/admin` (Payload CMS, data in one SQLite file on the same server, no outside service).

> **Not live.** Nothing may be published on the production domain until every item in the
> [launch checklist](#launch-checklist) is done. The current live BCC website is not touched by this repository.

## Structure

```
apps/web            Next.js site (frontend + API routes)
  messages/         UI text per language (en, fr, de, lu)
  src/app/[locale]  pages; every page exists once and is rendered for all languages
  src/components    layout (header, language selector, mobile menu, footer) and UI parts
  src/content       built-in content: imported into the admin on first start, and the fallback
  src/payload       the admin: pages, lists, users, first-start import (payload.config.ts wires it)
  src/migrations    database schema changes, applied on start in production
  src/i18n          language routing (next-intl)
  src/lib/env.ts    validated server environment (secrets are read only here)
  src/proxy.ts      language redirects, staging login, noindex outside production
  e2e/              Playwright browser tests
docs/               security notes and decisions
```

## Requirements

- Node.js 22 (`.nvmrc`), pnpm 10 (`corepack enable`) — or only Docker, see
  [Local development with Docker](#local-development-with-docker)

## Local development

```sh
corepack enable
pnpm install
cp .env.example apps/web/.env.local   # then fill in what you need; never commit it
pnpm dev                              # http://localhost:3000 → redirects to /en
```

## Local development with Docker

Needs only [Docker Desktop](https://www.docker.com/products/docker-desktop/) (no Node.js or pnpm on your machine).

```sh
cp .env.example .env          # optional: settings for local work; .env is never committed
docker compose up --build     # first start: a few minutes; later starts: seconds
```

| Address                     | What                                                       |
| --------------------------- | ---------------------------------------------------------- |
| http://localhost:3000       | the website, redirects to `/en` (also `/fr`, `/de`, `/lu`) |
| http://localhost:3000/admin | the admin; on the first visit create your local account    |

- **Hot reload:** the project folder is mounted into the container, so saving a file reloads the page.
  Dependencies and the Next.js cache live in Docker volumes, separate from anything installed on your machine.
- **Settings:** everything in `.env` reaches both services (see [Environment variables](#environment-variables)).
  Without a `.env` the site runs in development mode: the admin's database and uploads go to
  `apps/web/data` and `apps/web/media` (not committed; delete them to start again from the built-in
  content), and the contact form writes messages to the log instead of sending them (`EMAIL_PROVIDER=log`).
- **Stop:** `Ctrl+C`, or `docker compose down` when started with `-d`.
- **After `pnpm-lock.yaml` changes** (new dependencies): `docker compose up --build` installs them on start.
  If anything looks stale, `docker compose down -v` removes the volumes and the next start reinstalls.
- **Production is different:** `docker compose` is for development only. The live server uses the
  production image (the `Dockerfile`'s last stage), see [Deployment](#deployment).

### Open it on a phone (same Wi-Fi)

`localhost` on a phone means the phone itself. Use the computer's address instead: on a Mac,
`ipconfig getifaddr en0` prints it (e.g. `192.168.1.23`), then open `http://192.168.1.23:3000`.
To sign in to the admin from the phone too, set `SITE_URL=http://192.168.1.23:3000` in `.env` and
restart (the admin only accepts sign-ins from `SITE_URL`).

## Scripts

| Command                                              | What it does                                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `pnpm dev`                                           | development server                                                 |
| `pnpm build` / `pnpm start`                          | production build / server                                          |
| `pnpm lint` · `pnpm typecheck` · `pnpm format:check` | code quality                                                       |
| `pnpm test`                                          | unit tests (Vitest)                                                |
| `pnpm test:e2e`                                      | browser tests (Playwright; builds must exist, starts `pnpm start`) |
| `pnpm i18n:check`                                    | fails if any language is missing a text or placeholder             |

## Languages

URLs are always prefixed: `/en/…`, `/fr/…`, `/de/…`, `/lu/…`. `/` redirects to the visitor's browser
language (English if none matches); the choice in the language menu is remembered.
The `/lu/` prefix is kept for the URL, but pages declare the ISO code `lb` (`<html lang="lb">`, hreflang).

UI texts live in `apps/web/messages/*.json`. Add a key to all four files; `pnpm i18n:check` enforces it.
Page content (texts, services, news…) will come from the CMS per language.

## Content (admin at /admin)

The admin is [Payload CMS](https://payloadcms.com) running inside this Next.js app: open
`https://<site>/admin` and sign in with e-mail and password. Editors change texts, photos, videos,
logos, testimonials, news and contact details; section order, layout and styling stay in the code.
Every part of a page uses the admin's content once it is complete and the built-in content
(`apps/web/src/content/fallback`) otherwise, so a half-filled page never breaks the site.

| In the admin                                    | On the site                                                                                                                                      |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Website → News                                  | /news (articles have a draft until published; the address fills itself)                                                                          |
| Website → Home, About Us, Our Services, Contact | those pages, one tab per block in page order; lists (logos, photos, testimonials, services) are edited inside the page and reordered by dragging |
| Website → Footer & contact details              | phone, e-mail, address, social links; the footer's texts                                                                                         |
| Settings → Legal pages                          | Privacy Policy and Legal Notice (admins only; approve per language)                                                                              |
| Settings → Photo library                        | every uploaded photo, logo, icon and video                                                                                                       |
| Settings → Users                                | accounts: **Admin** (also users and legal pages) or **Editor**                                                                                   |

Buttons choose the page they open from a list; the "I'm looking for" menu chooses what it pre-selects
in the contact form. Service icons are any uploaded SVG/PNG, drawn in the site colour (CSS mask).
The language menu at the top right switches EN/FR/DE/LU; an empty FR/DE/LU text shows the English one.

- **Where the data lives:** one SQLite file (`DATABASE_URL`, default `apps/web/data/payload.db`) and the
  uploads folder (`PAYLOAD_MEDIA_DIR`, default `apps/web/media`). In Docker both are under `/data`:
  keep that on a persistent volume and back it up (copy the folder while the site runs or is stopped).
- **First start:** with an empty database the server creates the first admin from
  `PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD` and imports the current website texts and photos
  (`src/payload/seed.ts`). Without those variables in production it logs an error, because the
  "create first user" page would otherwise be open to anyone. Locally you can create the first account at `/admin`.
- **Saving:** **Save** puts a page live at once; **Versions** keeps the last 50 saves to restore.
  News articles have drafts and a **Publish** button. The eye/arrow button next to Save opens the page.
- **Sign-in protection:** 5 wrong passwords lock an account for 10 minutes; sessions last 8 hours.
- **Forgot password:** the sign-in page's "Forgot password?" e-mails a reset link valid for one hour
  (one use, at most one e-mail per account every 2 minutes). It goes out through the contact form's mail
  setup (`EMAIL_PROVIDER`, `CONTACT_FROM`, `SMTP_*`). With `EMAIL_PROVIDER=log` nothing is sent and,
  outside production, the link is printed in the server terminal. Admins can also set a new password
  for anyone under Settings → Users, and unlock a locked account there.
- **New users:** an admin adds someone under Settings → Users (e-mail, any password, role). They get
  a welcome e-mail with a link (valid three days) to choose their own password; the typed one stops working.
- **Changing the admin's fields** (`src/payload/**`): run
  `pnpm --filter web payload migrate:create <name>` and commit the new file in `src/migrations`;
  production applies it on the next start. In development the database follows the code by itself.
  After adding admin components, `pnpm --filter web payload generate:importmap`.

## News

News comes only from the admin (Lists → News; one article holds all four languages). Nothing is
invented: until the first article is published, `/news` shows a short “no news yet” message and the menu
has no News item; it appears by itself once there is an article. An article not yet translated is shown
in English, marked as such. A published article is online at once.

To review the templates before there is real news, run with `NEWS_FIXTURES=1` outside production: two
example articles appear, each marked “Test data”. This is ignored when `SITE_ENV=production`.

## Launch gate

With `SITE_ENV=production` the server refuses to start (`src/instrumentation-node.ts`) until the Privacy
Policy and Legal Notice are entered in the admin in all four languages and each is ticked "Approved by
BCC’s legal adviser". Enter them while the server runs with `SITE_ENV=staging` (same database), then
switch to production.

## Environment variables

See [`.env.example`](.env.example) for the full list with comments. Rules:

- Secrets (SMTP password, API keys, tokens) exist **only** as environment variables in the host
  (Vercel / Netlify settings, GitLab CI/CD variables, or the server's env file). Never in Git, never in
  frontend code. Only variables starting with `NEXT_PUBLIC_` reach the browser, and those must never be secret.
- `SITE_URL` and `SITE_ENV` are read when the server runs: pass them to the container (`--env-file`
  or `-e`), e.g. `SITE_URL=https://bcc-dev.squared.cloud-power.eu` on staging. With the default
  (`http://localhost:3000`) the admin rejects every save ("You are not allowed to perform this action")
  and canonical links point to localhost; the server logs `[config] SITE_URL …` at start, and
  production refuses to start.

## Deployment

The built-in admin keeps its database and uploads on the server's disk, so the site runs as one
long-lived Node server with a persistent folder: the Docker image below (or plain Node). Serverless
hosts (Vercel, Netlify) have no such disk; they would need PostgreSQL and cloud file storage instead.
Security headers come from `next.config.ts`.

**Docker (Cloud Power)**

```sh
docker build --build-arg SITE_ENV=production --build-arg SITE_URL=https://www.businesscentercapellen.lu -t bcc-web .
docker run -d --restart unless-stopped -p 127.0.0.1:3000:3000 \
  -v bcc-data:/data --env-file /secure/path/bcc.env bcc-web
```

`/data` holds `payload.db` and `media/`: back it up. Database changes in `src/migrations` are applied
automatically on start. Put a TLS-terminating reverse proxy (nginx, Caddy) in front. It must add the
visitor's address at the end of `X-Forwarded-For` (Caddy does by default; nginx:
`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`): the contact form's rate limit uses
that last entry.

Without Docker: `pnpm install && pnpm build`, then run `node apps/web/.next/standalone/apps/web/server.js`
after copying `apps/web/.next/static` to `apps/web/.next/standalone/apps/web/.next/static` and `apps/web/public`
to `apps/web/.next/standalone/apps/web/public`, with `DATABASE_URL` and `PAYLOAD_MEDIA_DIR` pointing to a
persistent folder.

**Staging** — set `SITE_ENV=staging` and `SITE_BASIC_AUTH=user:password`: the whole site asks for a login
and sends `noindex`. The admin at `/admin` keeps its own sign-in.

## CI (GitLab)

`.gitlab-ci.yml` runs formatting, lint, typecheck, i18n check, unit tests, build and Playwright, plus GitLab
SAST, Dependency Scanning and Secret Detection.

## Launch checklist

All must be done and confirmed by BCC before the production domain points here:

- [ ] Privacy Policy and Legal Notice texts supplied and approved by BCC (currently placeholders; no legal text is written by developers)
- [ ] FR / DE / LU translations reviewed (see `translations/review-notes.md`, phase 5)
- [ ] Real e-mail delivery connected and tested (`EMAIL_PROVIDER`, recipient confirmed)
- [ ] Contact form tested end to end, including spam protection and rate limits
- [ ] Admin accounts created (Admin / Editor roles checked); first-start variables removed
- [ ] Backups of the `/data` volume (database and uploads) scheduled and a restore tested
- [ ] Responsive check on all device classes, all four languages
- [ ] Security review and performance checks (Lighthouse) passed
- [ ] Every language route tested
- [ ] `SITE_ENV=production`, correct `SITE_URL`, no `SITE_BASIC_AUTH`
