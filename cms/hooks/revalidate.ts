import type { CollectionAfterChangeHook } from "payload";

/**
 * Triggers ISR revalidation after a document changes (publish/update).
 *
 * Why: SEO rules require ISR revalidation via a Payload publish webhook so content goes live
 * without a redeploy. This hook POSTs to the site's /api/revalidate handler with the affected
 * path. `buildPath` maps a document to its public path per collection. Failures are logged, not
 * thrown, so saving in the admin never fails because of a transient revalidation error.
 */
export function revalidateHook(
  buildPath: (doc: Record<string, unknown>) => string | null,
): CollectionAfterChangeHook {
  return async ({ doc, req }) => {
    const path = buildPath(doc as Record<string, unknown>);
    if (!path) return doc;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const secret = process.env.REVALIDATE_SECRET ?? "dev-revalidate-secret";

    try {
      await fetch(`${siteUrl.replace(/\/$/, "")}/api/revalidate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
        body: JSON.stringify({ path }),
      });
    } catch (error) {
      req.payload.logger.warn({ msg: "revalidate.failed", path, error: String(error) });
    }

    return doc;
  };
}
