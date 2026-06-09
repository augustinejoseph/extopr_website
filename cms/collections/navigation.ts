import { buildCollection } from "@cms/collections/build-collection";

import type { CollectionConfig } from "payload";

/**
 * Site navigation menus (e.g. "header", "footer"). Each menu owns a drag-orderable list of items
 * with localized labels. Why a collection (not a global): supports multiple named menus and reuses
 * the shared base (order/active/soft-delete) consistently.
 */
export const Navigation: CollectionConfig = buildCollection({
  slug: "navigation",
  admin: {
    useAsTitle: "location",
  },
  fields: [
    {
      name: "location",
      type: "select",
      required: true,
      options: [
        { label: "Header", value: "header" },
        { label: "Footer", value: "footer" },
      ],
      admin: { description: "Where this menu renders." },
    },
    {
      name: "items",
      type: "array",
      // Array rows are drag-reorderable in the admin out of the box.
      labels: { singular: "Nav item", plural: "Nav items" },
      fields: [
        {
          name: "column",
          type: "text",
          localized: true,
          admin: {
            description:
              "Footer column heading this link sits under (e.g. 'Company', 'Learn', 'Support'). Items sharing a column render together. Leave empty for header menus.",
          },
        },
        {
          name: "label",
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "href",
          type: "text",
          required: true,
          admin: { description: "Relative path (e.g. /about) or absolute URL." },
        },
      ],
    },
  ],
});
