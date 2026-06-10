import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * Student testimonials for the homepage section. Drag to reorder via the shared `order` field.
 */
export const Testimonials: CollectionConfig = buildCollection({
  slug: "testimonials",
  admin: {
    useAsTitle: "studentName",
    defaultColumns: ["studentName", "order", "active"],
  },
  fields: [
    {
      name: "studentName",
      type: "text",
      required: true,
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
    },
    {
      name: "course",
      type: "text",
      admin: { description: "Course or context for this testimonial." },
    },
  ],
});
