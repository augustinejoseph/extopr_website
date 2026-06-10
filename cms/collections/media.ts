import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * Uploaded media (images for hero slides, testimonials, OG images, etc.).
 * Local file storage now; a Cloudflare R2 adapter is wired in a later phase. `alt` is required so
 * every image satisfies the accessibility rule (meaningful alt text).
 */
export const Media: CollectionConfig = buildCollection({
  slug: "media",
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400 },
      { name: "card", width: 768 },
      { name: "hero", width: 1600 },
    ],
    mimeTypes: ["image/*"],
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      admin: {
        description: "Human-friendly name for this asset in the admin (e.g. 'Hero — Aisha desktop').",
      },
    },
    {
      name: "alt",
      type: "text",
      required: true,
      admin: { description: "Meaningful alt text. Use an empty string only for decorative images." },
    },
  ],
});
