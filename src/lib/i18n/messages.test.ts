import { describe, expect, it } from "vitest";

import { locales } from "@/lib/i18n/config";

import { en, type MessageKey } from "./messages/en";
import { getTranslator } from "./messages";

describe("getTranslator", () => {
  it("returns the locale value when a translation exists", () => {
    const t = getTranslator("ta");
    expect(t("localeSwitcher.label")).toBe("மொழி");
  });

  it("never returns an empty string for any key in any locale (English fallback)", () => {
    // Locale dictionaries are partial by contract; any gap must resolve to the English value.
    const keys = Object.keys(en) as MessageKey[];
    for (const locale of locales) {
      const t = getTranslator(locale);
      for (const key of keys) {
        expect(t(key), `${locale}/${key}`).toBeTruthy();
      }
    }
  });

  it("returns English directly for the en locale", () => {
    const t = getTranslator("en");
    expect(t("cta.submit")).toBe("Join extopr");
  });
});
