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

The site works without a CMS: `apps/web/src/content/fallback` holds the current content, copied from
the live site. Once a Sanity project exists:

1. Create the project at sanity.io (company account), dataset `production`. Check the data-processing
   terms (DPA) for GDPR before adding personal data.
2. Put the project ID in `apps/studio/.env` (`SANITY_STUDIO_PROJECT_ID`) and in the site's environment
   (`NEXT_PUBLIC_SANITY_PROJECT_ID`). Both are public identifiers, not secrets.
3. `pnpm --filter studio dev` opens the editor on http://localhost:3333; `pnpm --filter studio deploy`
   publishes it at `<name>.sanity.studio`. Invite editors from sanity.io/manage (Editor role).

Each home page section uses the CMS content once it is complete and the built-in content until then,
so a half-filled CMS never breaks the page. Pages refresh from the CMS every 5 minutes.
The CMS manages content only: section order, layout and styling stay in the code.

Hero videos in the repository (`public/media/hero`, ~26 MB) are the fallback; once the CMS holds the
video they can be removed.

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
