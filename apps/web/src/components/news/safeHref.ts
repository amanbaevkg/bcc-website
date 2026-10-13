/**
 * Web, e-mail and phone links, and paths on this site. "//host" and "/\host" lead to another
 * site, and browsers drop tabs and line breaks inside addresses, so those are refused too.
 */
export function safeHref(url: string | undefined) {
  return url && !/[\t\n\r]/.test(url) && /^(https?:|mailto:|tel:|\/(?![/\\]))/i.test(url)
    ? url
    : undefined;
}
