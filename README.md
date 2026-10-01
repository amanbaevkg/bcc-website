# bcc-web

Website for **BCC – Business Center Capellen**, built with Next.js (App Router), React, TypeScript and Node.js.
Four languages (EN default, FR, DE, LU) from one codebase; content will be managed in Sanity (phase 2).

> **Not live.** Nothing may be published on the production domain until every item in the
> [launch checklist](#launch-checklist) is done. The current live BCC website is not touched by this repository.

## Structure

```
apps/web            Next.js site (frontend + API routes)
  messages/         UI text per language (en, fr, de, lu)
  src/app/[locale]  pages; every page exists once and is rendered for all languages
  src/components    layout (header, language selector, mobile menu, footer) and UI parts
  src/content       fallback content used until the CMS is connected
  src/i18n          language routing (next-intl)
  src/lib/env.ts    validated server environment (secrets are read only here)
  src/proxy.ts      language redirects, staging login, noindex outside production
  e2e/              Playwright browser tests
apps/studio         Sanity Studio: the content editor (schemas in apps/studio/schemaTypes)
docs/               security notes and decisions
```

## Requirements

- Node.js 22 (`.nvmrc`), pnpm 10 (`corepack enable`)

## Local development

```sh
corepack enable
pnpm install
cp .env.example apps/web/.env.local   # then fill in what you need; never commit it
pnpm dev                              # http://localhost:3000 → redirects to /en
```

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

## Content (Sanity CMS)

BCC's Sanity project: **`8bx4pgzw`**, dataset `production` (public identifiers, not secrets).
Editors change texts, photos, videos, logos, testimonials, news and contact details; section order,
layout and styling stay in the code. Every part of a page uses the CMS content once it is complete
and the built-in content (`apps/web/src/content/fallback`) otherwise, so an empty or half-filled CMS
never breaks the site, and a CMS outage serves the built-in content.

| In the Studio                               | On the site                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| Home page, About Us page, Our Services page | the three pages, all four languages side by side                            |
| Contact page                                | the photo gallery on the contact page (title and photos, drag to reorder)   |
| Site settings                               | phone, e-mail, address, map link, social links, footer tagline              |
| Client logo, Space photo, Testimonial       | “They trust us”, “Our spaces”, testimonials                                 |
| News                                        | /news (one document per language)                                           |
| Legal page                                  | Privacy Policy and Legal Notice (one per language; must be marked approved) |

**Open the Studio locally:** `pnpm --filter studio dev` → http://localhost:3333 (log in with the
Sanity account). **Publish it for staff:** `pnpm --filter studio deploy` → https://bcc-capellen.sanity.studio (live since 1 October 2026).
Invite editors at sanity.io/manage → Members (role Editor).

**First import of the current content** (once): create a token at sanity.io/manage → API → Tokens
(permission Editor), then

```sh
SANITY_API_WRITE_TOKEN=<token> pnpm --filter web seed:cms
```

It uploads the photos, logos and hero videos and creates the documents that do not exist yet
(`--replace` overwrites them, `--dry-run` only lists them). Delete the token afterwards.

**Refresh after publishing:** pages re-read the CMS at most every 5 minutes. For an instant refresh,
add a webhook at sanity.io/manage → API → Webhooks: URL `https://<site>/api/revalidate`, trigger on
create/update/delete, HTTP header `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`. New News articles
need a rebuild: point a second webhook (filter `_type == "newsPost"`) at the host's deploy hook.

Hero videos in the repository (`public/media/hero`, ~26 MB) are the fallback; once the CMS holds the
video they can be removed.

## News

News comes only from the CMS (“News” documents, one per language). Nothing is invented: until the
first article is published, `/news` shows a short “no news yet” message and the menu has no News item;
it appears by itself once there is an article. A post not yet translated is listed in English, marked
as such. Articles are pre-rendered: set up a Sanity webhook that calls the host’s deploy hook so a newly
published article goes online within a minute or two.

To review the templates before there is real news, run a staging build with `NEWS_FIXTURES=1`: two
example articles appear, each marked “Test data”. This is ignored when `SITE_ENV=production`.

## Launch gate

`pnpm build` with `SITE_ENV=production` stops unless the Privacy Policy and Legal Notice exist in the
CMS in all four languages and are marked "Approved by BCC’s legal adviser". Staging builds are not affected.

## Environment variables

See [`.env.example`](.env.example) for the full list with comments. Rules:

- Secrets (SMTP password, API keys, tokens) exist **only** as environment variables in the host
  (Vercel / Netlify settings, GitLab CI/CD variables, or the server's env file). Never in Git, never in
  frontend code. Only variables starting with `NEXT_PUBLIC_` reach the browser, and those must never be secret.
- `SITE_ENV` and `SITE_URL` must be set **at build time** as well as at run time: pages are pre-rendered,
  so `noindex` and canonical URLs are fixed during the build.

## Deployment

The same code runs on all three targets; security headers come from `next.config.ts` and apply everywhere.

**Vercel** — import the GitLab repository, set _Root Directory_ to `apps/web`, add the environment variables.

**Netlify** — import the repository; `netlify.toml` sets the base directory and build command. Add the environment variables in Site settings.

**Own Node server / Docker**

```sh
docker build -t bcc-web .
docker run -p 3000:3000 --env-file /secure/path/bcc.env bcc-web
```

Without Docker: `pnpm install && pnpm build`, then run `node apps/web/.next/standalone/apps/web/server.js`
after copying `apps/web/.next/static` to `apps/web/.next/standalone/apps/web/.next/static` and `apps/web/public`
to `apps/web/.next/standalone/apps/web/public`. Put a TLS-terminating reverse proxy (nginx, Caddy) in front.

**Staging** — set `SITE_ENV=staging` and `SITE_BASIC_AUTH=user:password`: the whole site asks for a login
and sends `noindex`.

## CI (GitLab)

`.gitlab-ci.yml` runs formatting, lint, typecheck, i18n check, unit tests, build and Playwright, plus GitLab
SAST, Dependency Scanning and Secret Detection.

## Launch checklist

All must be done and confirmed by BCC before the production domain points here:

- [ ] Privacy Policy and Legal Notice texts supplied and approved by BCC (currently placeholders; no legal text is written by developers)
- [ ] FR / DE / LU translations reviewed (see `translations/review-notes.md`, phase 5)
- [ ] Real e-mail delivery connected and tested (`EMAIL_PROVIDER`, recipient confirmed)
- [ ] Contact form tested end to end, including spam protection and rate limits
- [ ] CMS roles and permissions checked
- [ ] Responsive check on all device classes, all four languages
- [ ] Security review and performance checks (Lighthouse) passed
- [ ] Every language route tested
- [ ] `SITE_ENV=production`, correct `SITE_URL`, no `SITE_BASIC_AUTH`
