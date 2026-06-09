import type { CollectionConfig } from "payload";

/**
 * Admin/editor accounts for the Payload CMS. Auth-enabled; not a public website surface.
 * Kept minimal for the foundations slice (roles/permissions can expand later).
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
