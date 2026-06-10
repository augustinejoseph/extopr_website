import { env } from "@/config/env";
import { getCmsClient } from "@/lib/cms/client";
import { absoluteUrl } from "@/utils/urls";

import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap generated from Payload content.
 *
 * Why: SEO rules forbid hand-maintained sitemaps. We enumerate static marketing routes plus
 * published, non-noindex pages and posts. Excludes soft-deleted and inactive content. The site is
 * English-only, so each path is a single entry with no hreflang alternates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getCmsClient();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;

  const staticPaths = ["/"];

  const [pages, posts] = await Promise.all([
    payload.find({
      collection: "pages",
      where: { and: [{ active: { equals: true } }, { deletedAt: { equals: null } }] },
      limit: 1000,
      depth: 0,
    }),
    payload.find({
      collection: "posts",
      where: { and: [{ active: { equals: true } }, { deletedAt: { equals: null } }] },
      limit: 1000,
      depth: 0,
    }),
  ]);

  const dynamicPaths = [
    ...pages.docs.filter((p) => !p.seo?.noindex).map((p) => `/${p.slug}`),
    ...posts.docs.filter((p) => !p.seo?.noindex).map((p) => `/blog/${p.slug}`),
  ];

  const allPaths = [...staticPaths, ...dynamicPaths];

  // One sitemap entry per path (the site is English-only, so no hreflang alternates).
  return allPaths.map((path) => ({
    url: absoluteUrl(path, siteUrl),
    lastModified: new Date(),
  }));
}
