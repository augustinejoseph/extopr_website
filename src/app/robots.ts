import { env } from "@/config/env";

import type { MetadataRoute } from "next";

/**
 * robots.txt generated from config. Why: SEO rules require a generated robots file that points at
 * the sitemap. Admin and API surfaces are disallowed from crawling; everything else is allowed.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
