import { describe, expect, it } from "vitest";

import {
  blogPostingJsonLd,
  courseJsonLd,
  organizationJsonLd,
  videoObjectJsonLd,
} from "./json-ld";

describe("organizationJsonLd", () => {
  it("builds a valid Organization node", () => {
    const node = organizationJsonLd({ name: "extopr", url: "https://example.com" });
    expect(node["@type"]).toBe("Organization");
    expect(node.name).toBe("extopr");
    expect(node).not.toHaveProperty("logo");
  });
});

describe("courseJsonLd", () => {
  it("includes the provider as an Organization", () => {
    const node = courseJsonLd({
      name: "Algebra",
      url: "https://example.com/courses/algebra",
      providerName: "extopr",
      providerUrl: "https://example.com",
    });
    expect(node["@type"]).toBe("Course");
    expect(node.provider).toMatchObject({ "@type": "Organization", name: "extopr" });
  });
});

describe("blogPostingJsonLd", () => {
  it("omits optional fields when not provided", () => {
    const node = blogPostingJsonLd({ headline: "Hello", url: "https://example.com/blog/hello" });
    expect(node["@type"]).toBe("BlogPosting");
    expect(node).not.toHaveProperty("author");
    expect(node).not.toHaveProperty("datePublished");
  });
});

describe("videoObjectJsonLd", () => {
  it("derives embed, content, and default thumbnail URLs from the YouTube id", () => {
    const node = videoObjectJsonLd({ name: "Intro", youtubeId: "abc123" });
    expect(node).toMatchObject({
      "@type": "VideoObject",
      embedUrl: "https://www.youtube.com/embed/abc123",
      contentUrl: "https://www.youtube.com/watch?v=abc123",
      thumbnailUrl: "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
    });
  });
});
