/**
 * The admin accepts changes only from SITE_URL, and canonical links, the sitemap and e-mail
 * links are built from it: a server left on the default (localhost) looks fine but cannot save.
 * Returns what is wrong, or undefined when SITE_URL looks like the site's public address.
 */
export function siteUrlProblem(siteUrl: string | undefined): string | undefined {
  if (!siteUrl) return 'SITE_URL is not set (it falls back to http://localhost:3000)';
  let url: URL;
  try {
    url = new URL(siteUrl);
  } catch {
    return `SITE_URL "${siteUrl}" is not a valid address`;
  }
  if (['localhost', '127.0.0.1', '0.0.0.0', '[::1]'].includes(url.hostname)) {
    return `SITE_URL is ${siteUrl}, not the site's public address`;
  }
  if (url.protocol !== 'https:') return `SITE_URL ${siteUrl} should start with https://`;
  return undefined;
}
