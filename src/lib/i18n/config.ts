/**
 * Single source of truth for supported locales.
 *
 * Why: rules.md forbids hard-coding locale sets inside components/routes. Routing, Payload
 * localization, sitemap/hreflang generation, and the fallback helper all import from here, so
 * adding a language is a one-line change in this file.
 */

export const locales = ["en", "ta", "kn"] as const;

export type Locale = (typeof locales)[number];

/** English is both the default and the fallback (rules.md). */
export const defaultLocale: Locale = "en";
export const fallbackLocale: Locale = "en";

/** Human-readable language names, used in the locale switcher and `lang` handling. */
export const localeLabels: Record<Locale, string> = {
  en: "English",
  ta: "தமிழ்",
  kn: "ಕನ್ನಡ",
};

/** Narrow an arbitrary string to a supported Locale, defaulting to the fallback. */
export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Resolve a possibly-undefined/invalid locale segment to a supported Locale. */
export function resolveLocale(value: string | undefined): Locale {
  return value && isLocale(value) ? value : defaultLocale;
}
