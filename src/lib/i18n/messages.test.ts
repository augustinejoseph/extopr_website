import { describe, expect, it } from "vitest";

import { en, type MessageKey } from "./messages/en";
import { getTranslator } from "./messages";

describe("getTranslator", () => {
  it("returns the English string for a key", () => {
    const t = getTranslator();
    expect(t("cta.submit")).toBe("Join extopr");
  });

  it("never returns an empty string for any known key", () => {
    const t = getTranslator();
    const keys = Object.keys(en) as MessageKey[];
    for (const key of keys) {
      expect(t(key), key).toBeTruthy();
    }
  });
});
