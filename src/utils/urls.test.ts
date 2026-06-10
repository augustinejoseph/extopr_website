import { describe, expect, it } from "vitest";

import { absoluteUrl } from "./urls";

describe("absoluteUrl", () => {
  it("joins origin and path, trimming a trailing slash on the origin", () => {
    expect(absoluteUrl("/about", "https://example.com/")).toBe("https://example.com/about");
    expect(absoluteUrl("/about", "https://example.com")).toBe("https://example.com/about");
  });

  it("maps the root path to a trailing slash", () => {
    expect(absoluteUrl("/", "https://example.com")).toBe("https://example.com/");
  });

  it("normalizes a path missing its leading slash", () => {
    expect(absoluteUrl("blog", "https://example.com")).toBe("https://example.com/blog");
  });
});
