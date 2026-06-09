import { en, type MessageKey } from "./messages/en";
import { kn } from "./messages/kn";
import { ta } from "./messages/ta";

import type { Locale } from "@/lib/i18n/config";

/**
 * UI-string translator with English fallback.
 *
 * Why: rules.md requires English fallback for missing translations across both CMS content and UI
 * strings. The locale dictionaries (ta/kn) are partial; this resolver returns the locale value or
 * the English value, never an empty string. Returns a bound `t` so Server Components can localize
 * static UI text.
 */
const dictionaries: Record<Locale, Partial<Record<MessageKey, string>>> = {
  en,
  ta,
  kn,
};

export type Translator = (key: MessageKey) => string;

export function getTranslator(locale: Locale): Translator {
  const dictionary = dictionaries[locale];
  return (key) => dictionary[key] ?? en[key];
}
