import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * URL builders for per-locale public links.
 *
 * Why: canonical URLs and hreflang alternates must be consistent everywhere (SEO rules). The
 * default locale (en) is unprefixed; other locales carry a /{locale} prefix. Centralizing this
 * keeps routing, sitemap, and metadata in agreement. Framework-agnostic for unit testing.
 */

/** Build a locale-aware path (no origin), e.g. localePath("/about", "ta") -> "/ta/about". */
export function localePath(path: string, locale: Locale): string {
  const normalized = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return normalized || "/";
  return `/${locale}${normalized}` || `/${locale}`;
}

/** Build an absolute URL for a path + locale against the configured site origin. */
export function absoluteUrl(path: string, locale: Locale, siteUrl: string): string {
  const origin = siteUrl.replace(/\/$/, "");
  return `${origin}${localePath(path, locale)}`;
}
