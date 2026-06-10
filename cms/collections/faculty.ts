import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * Faculty / mentors — public educator profiles surfaced on course cards, blog bylines, and the
 * Faculty page. Replaces the free-text faculty strings in the design mock. These are MARKETING
 * profiles; they are not LMS user/auth records and carry no learner data.
 */
export const Faculty: CollectionConfig = buildCollection({
  slug: "faculty",
  labels: {
    singular: "Faculty",
    plural: "Faculty",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order", "active"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "e.g. 'Dr. Divya Mehta', 'CA Vikram Goyal'." },
    },
    {
      name: "role",
      type: "text",
      admin: { description: "Subject / discipline, e.g. 'Physics', 'Accountancy'." },
    },
    {
      name: "credential",
      type: "text",
      admin: { description: "Short credential line, e.g. 'AIIMS · 11 yrs teaching'." },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "accentColor",
      type: "text",
      admin: { description: "Avatar/accent hex used when no photo is set, e.g. '#1F8A5B'." },
    },
    {
      name: "bio",
      type: "richText",
      admin: { description: "Longer profile body shown on the Faculty page." },
    },
  ],
});
