import { en, type MessageKey } from "./messages/en";

/**
 * UI-string translator.
 *
 * The site is English-only, so this resolves keys against the single English dictionary. Kept as a
 * `t(key)` helper (rather than inlining literals) so static UI text stays centralized and typed.
 */
export type Translator = (key: MessageKey) => string;

export function getTranslator(): Translator {
  return (key) => en[key];
}
