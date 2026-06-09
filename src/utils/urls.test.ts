import { describe, expect, it } from "vitest";

import { absoluteUrl, localePath } from "./urls";

describe("localePath", () => {
  it("leaves the default locale (en) unprefixed", () => {
    expect(localePath("/about", "en")).toBe("/about");
    expect(localePath("/", "en")).toBe("/");
  });

  it("prefixes non-default locales", () => {
    expect(localePath("/about", "ta")).toBe("/ta/about");
    expect(localePath("/", "kn")).toBe("/kn");
  });
});

describe("absoluteUrl", () => {
  it("joins origin and locale path, trimming a trailing slash on the origin", () => {
    expect(absoluteUrl("/about", "en", "https://example.com/")).toBe("https://example.com/about");
    expect(absoluteUrl("/about", "ta", "https://example.com")).toBe(
      "https://example.com/ta/about",
    );
  });
});
