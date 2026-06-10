import { buildCollection } from "@cms/collections/build-collection";
import { seoField } from "@cms/fields/seo";
import { revalidateHook } from "@cms/hooks/revalidate";

import type { CollectionConfig } from "payload";

/**
 * Blog posts. Title, excerpt, and body; SEO group for metadata and BlogPosting
 * JSON-LD on the post page. `publishedAt` drives ordering of the "latest posts" homepage strip.
 */
export const Posts: CollectionConfig = buildCollection({
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "publishedAt", "active"],
  },
  versions: { drafts: true },
  hooks: {
    // Revalidate the post's public path on publish/update.
    afterChange: [revalidateHook((doc) => (doc.slug ? `/blog/${String(doc.slug)}` : null))],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "excerpt",
      type: "textarea",
    },
    {
      name: "body",
      type: "richText",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "faculty",
      admin: { description: "Public byline. Faculty profile, not the CMS editor account." },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "exam-categories",
      admin: { description: "Category pill shown on the blog card." },
    },
    {
      name: "readTime",
      type: "text",
      admin: { description: "Display read time, e.g. '6 min read'." },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "publishedAt",
      type: "date",
      admin: { position: "sidebar" },
    },
    seoField(),
  ],
});
