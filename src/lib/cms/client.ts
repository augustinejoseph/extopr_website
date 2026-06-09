import config from "@payload-config";
import { getPayload, type Payload } from "payload";

/**
 * Returns a cached Payload Local API instance.
 *
 * Why: Server Components query content through Payload's Local API (in-process, no HTTP). Caching
 * the instance avoids re-initializing Payload on every request. All CMS access in the app goes
 * through the typed query functions that build on this client — components never call getPayload
 * directly (system-architecture.md: the access layer is the only thing that talks to Payload).
 */
let cached: Promise<Payload> | null = null;

export function getCmsClient(): Promise<Payload> {
  if (!cached) {
    cached = getPayload({ config });
  }
  return cached;
}
