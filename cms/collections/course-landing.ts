import { buildCollection } from "@cms/collections/build-collection";
import { seoField } from "@cms/fields/seo";

import type { CollectionConfig } from "payload";

/**
 * Course catalog landing teasers — MARKETING COPY ONLY. The authoritative course data lives in
 * the LMS backend; this collection never holds real course/learner data. `lmsUrl` is an outbound
 * deep link into the LMS app (Enroll/View). Cross-system coupling is HTTP only.
 *
 * The card fields below (tag/rating/price labels/meta) are display strings shown on the marketing
 * course card. They are NOT authoritative pricing or enrollment data — those stay in the LMS.
 */
export const CourseLanding: CollectionConfig = buildCollection({
  slug: "course-landing",
  labels: {
    singular: "Course Landing",
    plural: "Course Landings",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "exam", "order", "active"],
  },
  versions: { drafts: true },
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
      name: "exam",
      type: "relationship",
      relationTo: "exam-categories",
      admin: { description: "Drives the Courses tab filter and the card tag." },
    },
    {
      name: "faculty",
      type: "relationship",
      relationTo: "faculty",
      admin: { description: "Lead educator shown on the card." },
    },
    {
      name: "tag",
      type: "text",
      admin: { description: "Card eyebrow tag, e.g. 'NEET · Biology'." },
    },
    {
      name: "rating",
      type: "number",
      min: 0,
      max: 5,
      admin: { description: "Display rating, e.g. 4.9. Marketing display only." },
    },
    {
      name: "teaser",
      type: "textarea",
      admin: { description: "Short marketing teaser. Not the real course description." },
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "priceLabel",
      type: "text",
      admin: {
        description:
          "Optional marketing display price, e.g. '₹24,999'. NOT authoritative pricing (LMS owns that).",
      },
    },
    {
      name: "wasLabel",
      type: "text",
      admin: { description: "Optional struck-through 'was' price, e.g. '₹38,000'." },
    },
    {
      name: "meta",
      type: "array",
      labels: { singular: "Meta row", plural: "Meta rows" },
      admin: { description: "Card stats, e.g. Duration / Live classes / Mock tests." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "text", required: true },
      ],
    },
    {
      name: "accentColor",
      type: "text",
      admin: { description: "Optional hex for the card's top border, e.g. '#2C4BFF'." },
    },
    {
      name: "lmsUrl",
      type: "text",
      admin: { description: "Outbound deep link into the LMS app (Enroll/View). HTTP only." },
    },
    seoField(),
  ],
});
