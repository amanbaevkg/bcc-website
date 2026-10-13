# Security notes

## Secrets

- Only in environment variables of the host or GitLab CI/CD (masked, protected). Never committed.
- `.gitignore` excludes `.env*` (except `.env.example`), keys and certificates. GitLab Secret Detection runs in CI.
- `src/lib/env.ts` imports `server-only`: any attempt to import it from browser code fails the build.

## HTTP headers (`apps/web/next.config.ts`)

Content-Security-Policy, HSTS (2 years), `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy`,
`Cross-Origin-Opener-Policy: same-origin`. `X-Powered-By` is removed.

## CSP decision: static pages with `script-src 'unsafe-inline'`

Tested on Next.js 16.3 (Playwright, `e2e/smoke.spec.ts`):

- A strict `script-src 'self'` breaks the site: Next.js streams page data in inline `<script>` tags whose
  content differs per page, so they can be neither allowed by a fixed hash nor left out. The browser blocks
  them and React fails to hydrate (menus stop working).
- Nonces would fix that, but require rendering every page on every request, which removes CDN caching and
  static generation on Vercel/Netlify.

Chosen: pre-rendered pages, `script-src 'self' 'unsafe-inline'`, plus these controls:

- External scripts only from our own origin, pinned with Subresource Integrity (`experimental.sri`).
- ESLint forbids `dangerouslySetInnerHTML` and `eval`; the admin's rich text is rendered as React elements
  (Portable Text), never as raw HTML. This removes the injection path the inline allowance would expose.
- `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`.
- Third-party origins are added one by one, only when a feature needs them (Turnstile).

If a later requirement demands a nonce-based CSP, it can be added in `src/proxy.ts` (see the Next.js CSP
guide); the cost is dynamic rendering of every page.

## Admin (`/admin`, Payload CMS)

- Sign-in with e-mail and password; passwords are hashed by Payload (PBKDF2). Five wrong attempts lock
  an account for 10 minutes; sessions last 8 hours in an HTTP-only cookie (`Secure` in production,
  `SameSite=Lax`), and Payload checks the request origin against `SITE_URL` (CSRF).
- Roles: **Admin** manages users and the legal pages; **Editor** changes content only and sees only their
  own account. The REST API under `/api/*` answers only signed-in users (except uploaded files, which
  the public pages show); the website reads content on the server through Payload's local API.
- The first admin comes from `PAYLOAD_ADMIN_EMAIL` / `PAYLOAD_ADMIN_PASSWORD` on the first start, so the
  public "create first user" page never appears on a live server. With no account and neither variable
  set, a production server refuses to start. Remove both variables once the account exists.
- Password reset: a one-hour, single-use link, sent only to the account's own address and built from
  `SITE_URL` (never from the request's Host header). The answer is the same whether or not the address
  has an account, and an account gets at most one reset e-mail every 2 minutes. In production the
  link is never written to the log.
- `PAYLOAD_SECRET` (32+ random characters) signs sessions; the server does not start without it.
- No outside service: no Gravatar, no telemetry, GraphQL disabled.
- Data: `/data/payload.db` and `/data/media` on the server. Back them up; whoever can read the volume can
  read the content and the password hashes.

## Staging

`SITE_BASIC_AUTH` protects the website pages with a login (constant-time comparison); `/api` and `/admin`
are not covered (the admin has its own sign-in). Any `SITE_ENV` other
than `production` adds `X-Robots-Tag: noindex, nofollow` and a `noindex` meta tag.
