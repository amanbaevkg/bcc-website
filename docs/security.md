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
- ESLint forbids `dangerouslySetInnerHTML` and `eval`; CMS rich text is rendered as React elements
  (Portable Text), never as raw HTML. This removes the injection path the inline allowance would expose.
- `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`.
- Third-party origins are added one by one, only when a feature needs them (Sanity CDN images, Turnstile).

If a later requirement demands a nonce-based CSP, it can be added in `src/proxy.ts` (see the Next.js CSP
guide); the cost is dynamic rendering of every page.

## Staging

`SITE_BASIC_AUTH` protects the whole site with a login (constant-time comparison); any `SITE_ENV` other
than `production` adds `X-Robots-Tag: noindex, nofollow` and a `noindex` meta tag.
