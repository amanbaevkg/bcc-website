import { jsonLd } from '@/lib/seo';

/**
 * Structured data for search engines. The browser never runs it (type is not JavaScript), and
 * jsonLd() escapes "<", so our own data cannot break out of the tag.
 */
export function JsonLd({ data }: { data: unknown }) {
  // eslint-disable-next-line react/no-danger -- escaped JSON produced by our own code, not HTML
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />;
}
