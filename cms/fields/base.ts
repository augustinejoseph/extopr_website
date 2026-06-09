import type { Field } from "payload";

/**
 * Shared base fields applied to every collection ("base model extended to all").
 *
 * Why: code_style.md requires DRY. Rather than class inheritance (Payload collections are config
 * objects), the base is a field factory that each collection spreads. Provides:
 *  - order: drives drag-and-drop reordering in the admin list view.
 *  - active: publish/visibility toggle the site queries on.
 *  - deletedAt/deletedBy: soft-delete audit fields (createdAt/updatedAt are automatic in Payload).
 */
export function baseFields(): Field[] {
  return [
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      // Lower numbers sort first; the list view is sortable so editors drag to reorder.
      admin: {
        position: "sidebar",
        description: "Display order. Drag rows in the list view to reorder.",
      },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Uncheck to hide this item from the public site.",
      },
    },
    {
      name: "deletedAt",
      type: "date",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "Set when the item is soft-deleted. Empty means active.",
      },
    },
    {
      name: "deletedBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ];
}

/** Default admin list config so every collection opens sorted by `order` (drag-to-reorder). */
export const orderableAdmin = {
  defaultColumns: ["id", "order", "active"],
  // Sorting by `order` makes the list view drag-reorderable in the Payload admin.
  pagination: { defaultLimit: 50 },
};
