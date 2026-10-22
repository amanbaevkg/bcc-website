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
  // Not in development: it would break the site opened from a phone at http://<computer's IP>:3000.
  ...(isDev ? [] : ['upgrade-insecure-requests']),
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

// Builds on machines with about 2 GB of memory (GitLab's runner OOM-killed the default build,
// which peaks near 3 GB): with webpack (package.json) and NODE_OPTIONS=--max-old-space-size=1024,
// one build worker and no second type check (the "quality" job and `pnpm typecheck` run tsc).
const lowMemory = process.env.BUILD_LOW_MEMORY === '1';

const nextConfig: NextConfig = {
  // Self-contained server for Docker / plain Node hosting. Vercel and Netlify ignore it.
  output: 'standalone',
  // Trace files from the monorepo root so workspace packages are included.
  outputFileTracingRoot: path.join(path.dirname(fileURLToPath(import.meta.url)), '../..'),
  // The admin's SQLite driver: Payload keeps `libsql` out of the bundle, so it is a direct dependency
  // (same version as @libsql/client uses) for tracing to find it. Its native part is loaded by
  // platform name (@libsql/linux-x64-musl, …), which tracing cannot follow. Without both, the
  // standalone server (Docker image) stops with "Cannot find module"; CI checks it starts.
  outputFileTracingIncludes: {
    // Through libsql's own links, so that each platform's package is found next to it.
    '/**': ['../../node_modules/.pnpm/libsql@*/node_modules/@libsql/*/**'],
  },
  poweredByHeader: false,
  // Development only: open the dev server from a phone or tablet on the same Wi-Fi.
  // Private addresses only (172.16–172.31, not the public rest of 172.*).
  allowedDevOrigins: [
    '192.168.*.*',
    '10.*.*.*',
    ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
    '*.local',
  ],
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: lowMemory },
  experimental: {
    ...(lowMemory ? { cpus: 1, webpackMemoryOptimizations: true, serverMinification: false } : {}),
    sri: { algorithm: 'sha256' },
    // [locale]/layout.tsx is the root layout, so URLs outside a language get this page.
    globalNotFound: true,
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Uploaded files (SVG icons and logos can carry scripts): opened on their own, nothing runs.
        source: '/api/media/file/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withPayload(withNextIntl(nextConfig));
