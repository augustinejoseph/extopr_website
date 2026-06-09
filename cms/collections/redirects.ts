import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * 301/302 redirects, consumed by Next.js to preserve SEO when URLs change. Avoid redirect chains:
 * point `from` directly at the final destination.
 */
export const Redirects: CollectionConfig = buildCollection({
  slug: "redirects",
  admin: {
    useAsTitle: "from",
    defaultColumns: ["from", "to", "type"],
  },
  fields: [
    {
      name: "from",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "Source path, e.g. /old-url." },
    },
    {
      name: "to",
      type: "text",
      required: true,
      admin: { description: "Destination path or URL." },
    },
    {
      name: "type",
      type: "select",
      defaultValue: "301",
      options: [
        { label: "301 (permanent)", value: "301" },
        { label: "302 (temporary)", value: "302" },
      ],
    },
  ],
});
