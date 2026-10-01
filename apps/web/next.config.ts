import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';
import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const isDev = process.env.NODE_ENV === 'development';
// Cloudflare Turnstile (contact form bot check) only when its site key is set.
const turnstile = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  ? ' https://challenges.cloudflare.com'
  : '';

/**
 * Content Security Policy. Trade-off documented in docs/security.md:
 * pages are statically generated for CDN caching, so per-request nonces are not
 * possible, and Next.js streams page data in inline <script> tags that differ per
 * page, so script-src needs 'unsafe-inline'. External scripts are same-origin only
 * and pinned with Subresource Integrity (experimental.sri). No page renders raw
 * HTML (ESLint forbids dangerouslySetInnerHTML), which is what the inline
 * allowance would otherwise expose.
 * Third-party origins are added only when a feature needs them.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}${turnstile}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "media-src 'self'",
  `connect-src 'self'${turnstile}`,
  turnstile ? `frame-src${turnstile}` : "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  // Self-contained server for Docker / plain Node hosting. Vercel and Netlify ignore it.
  output: 'standalone',
  // Trace files from the monorepo root so workspace packages are included.
  outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), '../..'),
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    sri: { algorithm: 'sha256' },
    // [locale]/layout.tsx is the root layout, so URLs outside a language get this page.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withPayload(withNextIntl(nextConfig));
