import Link from 'next/link';

// Requests outside a locale are redirected by the proxy; this is only a safety net.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', padding: 40 }}>
        <h1>Page not found</h1>
        <p>
          <Link href="/en">Business Center Capellen</Link>
        </p>
      </body>
    </html>
  );
}
