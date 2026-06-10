import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * YouTube videos for the homepage section. The site renders a lite facade (thumbnail + play) and
 * loads the YouTube iframe only on click, so we store the video ID and an optional custom
 * thumbnail. Drag to reorder via the shared `order` field.
 */
export const Videos: CollectionConfig = buildCollection({
  slug: "videos",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order", "active"],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "youtubeId",
      type: "text",
      required: true,
      admin: { description: "YouTube video ID (the part after watch?v=)." },
    },
    {
      name: "thumbnail",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional custom thumbnail for the lite facade." },
    },
  ],
});
