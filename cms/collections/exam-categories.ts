import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * Exam categories — the single source for exam names across the site (hero exam-chip strip, the
 * Courses tab filter, CourseLanding.exam, Posts.category). Why a collection: CLAUDE.md forbids
 * hard-coding the exam/category set in component logic; editors manage it and everything reads it.
 *
 * MARKETING METADATA ONLY. `batchCount` is a display string ("2.1k"), not real LMS data.
 */
export const ExamCategories: CollectionConfig = buildCollection({
  slug: "exam-categories",
  labels: {
    singular: "Exam Category",
    plural: "Exam Categories",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "order", "active"],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Display name, e.g. 'NEET', 'JEE Main', 'CA Foundation'." },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL/tab key, e.g. 'neet'. Lowercase, hyphenated." },
    },
    {
      name: "group",
      type: "select",
      options: [
        { label: "NEET", value: "neet" },
        { label: "JEE", value: "jee" },
        { label: "Commerce & CA", value: "commerce" },
        { label: "Other", value: "other" },
      ],
      admin: { description: "Coarse grouping for the Courses tab filter." },
    },
    {
      name: "batchCount",
      type: "text",
      admin: { description: "Display-only count shown on the chip, e.g. '2.1k batches'." },
    },
    {
      name: "accentColor",
      type: "text",
      admin: { description: "Optional hex accent for the chip/icon, e.g. '#2C4BFF'." },
    },
  ],
});
