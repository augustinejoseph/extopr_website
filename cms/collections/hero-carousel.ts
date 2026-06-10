import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * Hero carousel slides for the homepage — images showing student outcomes. Drag-reorder via the
 * shared `order` field; `active` toggles visibility.
 */
export const HeroCarousel: CollectionConfig = buildCollection({
  slug: "hero-carousel",
  labels: {
    singular: "Hero Slide",
    plural: "Hero Carousel",
  },
  admin: {
    useAsTitle: "studentName",
    defaultColumns: ["studentName", "order", "active"],
  },
  fields: [
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: { description: "Desktop/wide image (e.g. 16:9). Shown from the md breakpoint up." },
    },
    {
      name: "mobileImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Optional portrait crop for small screens (e.g. 4:5). Falls back to the desktop image when empty.",
      },
    },
    {
      name: "studentName",
      type: "text",
      required: true,
    },
    {
      name: "achievement",
      type: "text",
      admin: { description: "Result/achievement headline shown on the slide." },
    },
    {
      name: "caption",
      type: "textarea",
    },
  ],
});
