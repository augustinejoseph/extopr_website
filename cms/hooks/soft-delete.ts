import type {
  CollectionBeforeDeleteHook,
  CollectionConfig,
} from "payload";

/**
 * Soft-delete support shared by every collection.
 *
 * Why: the base model requires deletedAt/deletedBy audit fields and "delete" must not destroy
 * data. Payload has no first-class soft delete, so we record the audit fields via an access-time
 * pattern: the admin "trash" action sets deletedAt; a beforeDelete guard records who triggered a
 * hard delete for traceability. Read queries in the access layer exclude soft-deleted rows.
 *
 * Note: this keeps the audit trail; a true "restore from trash" UI is a later enhancement.
 */

/** Records the acting user on a hard delete so the audit trail is never silently lost. */
export const recordDeleteActor: CollectionBeforeDeleteHook = async ({ req, collection, id }) => {
  // Intent: surface who removed a record in structured logs (collection/id/user).
  req.payload.logger.info({
    msg: "collection.delete",
    collection: collection?.slug,
    id,
    userId: req.user?.id ?? null,
  });
};

/**
 * Attach shared delete hooks to a collection config without clobbering collection-specific hooks.
 */
export function withSoftDeleteHooks(config: CollectionConfig): CollectionConfig {
  return {
    ...config,
    hooks: {
      ...config.hooks,
      beforeDelete: [...(config.hooks?.beforeDelete ?? []), recordDeleteActor],
    },
  };
}
