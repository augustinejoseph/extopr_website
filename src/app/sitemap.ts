import { env } from "@/config/env";
import { getCmsClient } from "@/lib/cms/client";
import { locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/utils/urls";

import type { MetadataRoute } from "next";

/**
 * Dynamic sitemap generated from Payload content.
 *
 * Why: SEO rules forbid hand-maintained sitemaps and require every locale to be listed with
 * hreflang alternates. We enumerate static marketing routes plus published, non-noindex pages and
 * posts, and emit a per-locale entry with language alternates for each. Excludes soft-deleted and
 * inactive content.
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

  // One sitemap entry per path, with hreflang alternates across every supported locale.
  return allPaths.map((path) => ({
    url: absoluteUrl(path, locales[0], siteUrl),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, absoluteUrl(path, locale, siteUrl)]),
      ),
    },
  }));
}
