import { buildCollection } from "@cms/collections/build-collection";
import { seoField } from "@cms/fields/seo";
import { revalidateHook } from "@cms/hooks/revalidate";

import type { CollectionConfig } from "payload";

/**
 * Generic marketing pages (home, about, pricing, contact). Title and body are localized; the
 * shared SEO group drives per-locale metadata. Slug is the human-readable URL segment.
 */
export const Pages: CollectionConfig = buildCollection({
  slug: "pages",
  admin: {
    useAsTitle: "title",
  },
  versions: { drafts: true },
  hooks: {
    // Revalidate the page's public path on publish/update.
    afterChange: [revalidateHook((doc) => (doc.slug ? `/${String(doc.slug)}` : null))],
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL segment, e.g. 'about'. Lowercase, hyphenated." },
    },
    {
      name: "body",
      type: "richText",
      localized: true,
    },
    seoField(),
  ],
});
