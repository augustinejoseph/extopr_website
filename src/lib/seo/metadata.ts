import { env } from "@/config/env";
import { type Locale,locales } from "@/lib/i18n/config";
import { absoluteUrl } from "@/utils/urls";

import type { Media } from "@cms/payload-types";
import type { Metadata } from "next";

/** Shape accepted from a Payload `seo` group (all optional, localized values already resolved). */
export interface SeoInput {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
  ogImage?: Media | number | string | null;
  noindex?: boolean | null;
}

interface BuildMetadataArgs {
  seo: SeoInput | undefined;
  // Fallback title when seo.title is empty (e.g. the page/post title).
  fallbackTitle: string;
  // Path without locale prefix, e.g. "/" or "/about".
  path: string;
  locale: Locale;
}

/**
 * Build Next.js Metadata from a Payload SEO group for a given locale.
 *
 * Why: every page must expose per-locale title/description, a canonical URL, OpenGraph/Twitter
 * cards, and hreflang alternates across all locales (SEO rules). Centralizing this guarantees
 * consistency and a single place to evolve metadata. Alternates are derived from the locale config
 * so adding a language needs no change here.
 */
export function buildMetadata({ seo, fallbackTitle, path, locale }: BuildMetadataArgs): Metadata {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const title = seo?.title?.trim() || fallbackTitle;
  const description = seo?.description?.trim() || undefined;
  const canonical = seo?.canonicalUrl?.trim() || absoluteUrl(path, locale, siteUrl);
  const ogImageUrl = resolveImageUrl(seo?.ogImage, siteUrl);

  // hreflang alternates: one entry per supported locale for this same path.
  const languages = Object.fromEntries(
    locales.map((l) => [l, absoluteUrl(path, l, siteUrl)]),
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: seo?.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      locale,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
    twitter: {
      card: ogImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
  };
}

/** Resolve an OG image URL from a Payload upload relation or a raw string. */
function resolveImageUrl(image: SeoInput["ogImage"], siteUrl: string): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  // Unpopulated upload relation (ID only): nothing to render.
  if (typeof image === "number") return undefined;
  const url = image.url;
  if (!url) return undefined;
  // Media URLs may be relative; make them absolute for crawlers and social cards.
  return url.startsWith("http") ? url : `${siteUrl.replace(/\/$/, "")}${url}`;
}
