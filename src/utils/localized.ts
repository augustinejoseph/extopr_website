import { fallbackLocale, type Locale } from "@/lib/i18n/config";

/**
 * A value that may carry per-locale variants. Payload returns localized fields either as the
 * resolved value for the requested locale, or (when queried with `locale: "all"`) as a map keyed
 * by locale code. This helper centralizes the English-fallback rule for the latter shape.
 */
export type LocalizedValue<T> = Partial<Record<Locale, T>>;

/**
 * Resolve a localized value for the requested locale, falling back to English.
 *
 * Why: rules.md mandates that a missing `ta`/`kn` translation renders the `en` value, never an
 * empty string. Keeping this in one framework-agnostic helper means every surface (pages, SEO,
 * components) applies the same fallback and it stays unit-testable.
 */
export function resolveLocalized<T>(
  value: LocalizedValue<T> | undefined,
  locale: Locale,
): T | undefined {
  if (!value) return undefined;

  const requested = value[locale];
  if (!isEmpty(requested)) return requested;

  // Fall back to English when the requested locale is missing or empty.
  const fallback = value[fallbackLocale];
  return isEmpty(fallback) ? undefined : fallback;
}

/** A value counts as empty when it is null/undefined or a whitespace-only string. */
function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  return false;
}
