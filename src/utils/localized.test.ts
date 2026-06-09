import { describe, expect, it } from "vitest";

import { resolveLocalized } from "./localized";

describe("resolveLocalized", () => {
  it("returns the requested locale value when present", () => {
    expect(resolveLocalized({ en: "Hello", ta: "வணக்கம்" }, "ta")).toBe("வணக்கம்");
  });

  it("falls back to English when the requested locale is missing", () => {
    expect(resolveLocalized({ en: "Hello" }, "ta")).toBe("Hello");
  });

  it("falls back to English when the requested locale is an empty string", () => {
    expect(resolveLocalized({ en: "Hello", kn: "   " }, "kn")).toBe("Hello");
  });

  it("returns undefined when neither the requested locale nor English exist", () => {
    expect(resolveLocalized({ ta: "வணக்கம்" }, "kn")).toBeUndefined();
  });

  it("returns undefined for an undefined value", () => {
    expect(resolveLocalized(undefined, "en")).toBeUndefined();
  });
});
