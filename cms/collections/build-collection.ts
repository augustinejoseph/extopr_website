import { baseFields, orderableAdmin } from "@cms/fields/base";
import { withSoftDeleteHooks } from "@cms/hooks/soft-delete";

import type { CollectionConfig } from "payload";

/**
 * Single place where the shared base is merged into a collection ("base model extended to all").
 *
 * Why: every collection should carry the base fields (order/active/soft-delete), the soft-delete
 * hooks, and the orderable list admin without repeating that wiring. Collections declare only
 * their specific fields and overrides; this wrapper composes the rest. Base fields go first so
 * collection-specific fields render after them in the admin.
 *
 * Public read access is granted by default: these are marketing/SEO collections the public site
 * (and the middleware redirect lookup) reads over the REST API. Write operations stay
 * admin-authenticated. A collection can still override `access` for stricter rules.
 */
export function buildCollection(config: CollectionConfig): CollectionConfig {
  const merged: CollectionConfig = {
    ...config,
    access: {
      read: () => true,
      ...config.access,
    },
    admin: {
      ...orderableAdmin,
      ...config.admin,
    },
    fields: [...baseFields(), ...config.fields],
  };

  return withSoftDeleteHooks(merged);
}
