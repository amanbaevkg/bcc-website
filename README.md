# Business Center Capellen — website

**Live:** [www.businesscentercapellen.lu](https://www.businesscentercapellen.lu)

The new website of Business Center Capellen, a business centre in Luxembourg offering private
offices, coworking, meeting rooms and domiciliation. I built it during my internship at
**Cloud Power** (Luxembourg), from the first mock-up to the site running on the production server.

<!-- Add 2–3 screenshots here: home page (desktop), a page on a phone, the admin.
![Home page](docs/screenshots/home.png)
-->

## What the site does

- **Four languages:** English, French, German and Luxembourgish, each page under its own address
  (`/en`, `/fr`, `/de`, `/lu`), with `hreflang`, a sitemap and canonical links for search engines.
- **Built-in admin** at `/admin`: the BCC team edits texts, photos, the contact form's options and
  news in all four languages, with no developer needed. Admin and Editor roles, version history.
- **Contact form** that e-mails enquiries to several recipients, with spam protection and a limit on
  messages per visitor.
- **Responsive design** tested on phones, tablets and desktops; long German and Luxembourgish words
  never break across lines in headings.
- **Hero video** with lighter versions for phones, and an auto-scrolling photo gallery.

## Tech stack

| Area | Tools |
|---|---|
| Front end | Next.js 16 (App Router), React 19, TypeScript, CSS Modules, next-intl |
| Content | Payload CMS 3 with SQLite, migrations for schema and data changes |
| E-mail | Nodemailer (SMTP), with Resend and Postmark as alternatives |
| Validation | Zod (form input and server settings) |
| Tests | Vitest (unit), Playwright (end to end, desktop and phone) |
| Delivery | Docker (standalone Next.js image), GitLab CI |

## Security

- Strict security headers: Content Security Policy, HSTS, no framing, Subresource Integrity.
- All secrets come from server environment variables; none are in the code or the repository.
- Admin protection: CSRF checks, account lock after failed sign-ins, minimum password length,
  only administrators can unlock accounts.
- The CI pipeline checks every push: lint, type check, tests, dependency audit
  (`pnpm audit`), secret detection and static analysis (Semgrep).
- A launch gate: the server refuses to start as production until the legal pages are approved.

## CI pipeline

`quality` → `audit` · `secret_detection` · `semgrep-sast` → `build` → `e2e` → `publish-image`

## What I worked on

- Turning the approved design into pages and reusable components.
- Setting up the admin so the client's team can manage all content themselves.
- The contact form and its e-mail delivery, including the connection to the company's mail server.
- Security fixes and dependency updates found by the security scans.
- Mobile testing and fixes, and the CI pipeline.
- Working with the infrastructure team to deploy it and move it to the client's domain.

## Running it locally

```bash
pnpm install
cp .env.example .env    # optional: settings for e-mail and the admin
pnpm dev                # http://localhost:3000, admin at /admin
```

Checks: `pnpm lint && pnpm typecheck && pnpm test`

---

*Shared with the permission of Cloud Power. Content and photos belong to Business Center Capellen.*
