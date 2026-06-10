/**
 * URL builder for public links.
 *
 * Why: canonical URLs must be consistent everywhere (SEO rules). The site is English-only with no
 * locale prefixes, so a path maps directly to its public URL. Framework-agnostic for unit testing.
 */

/** Build an absolute URL for a path against the configured site origin. */
export function absoluteUrl(path: string, siteUrl: string): string {
  const origin = siteUrl.replace(/\/$/, "");
  const normalized = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return `${origin}${normalized}`;
}
