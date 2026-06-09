import type { Media } from "@cms/payload-types";

/**
 * Normalizes a Payload upload relation (which may be an ID string or a populated Media doc) into a
 * renderable image. Why: collections reference Media by relation; components need a consistent
 * { url, alt, width, height } shape for next/image with explicit dimensions (avoids layout shift)
 * and meaningful alt. Returns null when the relation is unpopulated or lacks a URL.
 */
export interface ResolvedImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export function resolveImage(
  relation: Media | number | string | null | undefined,
  fallbackAlt = "",
): ResolvedImage | null {
  // Unpopulated relations come back as an ID (number with the Postgres adapter, or a string).
  if (!relation || typeof relation === "string" || typeof relation === "number") return null;
  if (!relation.url || !relation.width || !relation.height) return null;
  return {
    url: relation.url,
    alt: relation.alt ?? fallbackAlt,
    width: relation.width,
    height: relation.height,
  };
}
