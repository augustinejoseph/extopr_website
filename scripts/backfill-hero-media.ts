/**
 * One-off backfill for data seeded before the Media `name` field and hero `mobileImage` existed.
 *
 * - Sets Media.name from the existing alt where it is empty (admin-friendly title).
 * - For each hero slide without a mobileImage, generates a portrait (4:5) crop from a solid colour
 *   and attaches it, so small screens get a dedicated image instead of the stretched wide one.
 *
 * Idempotent: skips media that already have a name and slides that already have a mobileImage.
 * Run with env loaded, e.g. `node --env-file=.env ./node_modules/.bin/tsx scripts/backfill-hero-media.ts`.
 */
import { getPayload, type Payload } from "payload";
import sharp from "sharp";

import config from "../cms/payload.config";

/** Portrait crop colours keyed by slide order, matching the seed's wide-image palette. */
const MOBILE_COLORS = ["#2563eb", "#0ea5e9", "#16a34a"];
const FALLBACK_COLOR = "#475569";

async function makePortrait(color: string): Promise<Buffer> {
  return sharp({ create: { width: 800, height: 1000, channels: 3, background: color } })
    .png()
    .toBuffer();
}

async function backfill(payload: Payload): Promise<void> {
  // 1) Media.name from alt where missing. `alt` is localized and required, so we resolve a
  //    non-empty alt across locales and write it back for `en` too — some legacy docs only have a
  //    regional alt, which would otherwise fail `en` validation on update.
  const media = await payload.find({
    collection: "media",
    limit: 1000,
    depth: 0,
    locale: "all",
  });
  let named = 0;
  for (const doc of media.docs) {
    if (doc.name) continue;
    // With locale "all", alt is an object keyed by locale; pick the first non-empty value.
    const altByLocale = (doc.alt ?? {}) as unknown as Record<string, string | null | undefined>;
    const alt = Object.values(altByLocale).find((v) => v && v.trim()) ?? doc.filename ?? "Image";
    await payload.update({
      collection: "media",
      id: doc.id,
      locale: "en",
      data: { name: alt, alt },
    });
    named += 1;
  }
  payload.logger.info(`Set name on ${named} media doc(s).`);

  // 2) Attach a portrait mobileImage to hero slides that lack one.
  const slides = await payload.find({
    collection: "hero-carousel",
    locale: "en",
    sort: "order",
    limit: 1000,
    depth: 0,
  });
  let attached = 0;
  for (const [i, slide] of slides.docs.entries()) {
    if (slide.mobileImage) continue;
    const color = MOBILE_COLORS[i] ?? FALLBACK_COLOR;
    const data = await makePortrait(color);
    const alt = `${slide.studentName} (mobile)`;
    const mobile = await payload.create({
      collection: "media",
      data: { name: alt, alt },
      file: {
        name: `hero-${slide.id}-mobile.png`,
        data,
        mimetype: "image/png",
        size: data.length,
      },
    });
    await payload.update({
      collection: "hero-carousel",
      id: slide.id,
      locale: "en",
      data: { mobileImage: mobile.id as number },
    });
    attached += 1;
  }
  payload.logger.info(`Attached mobileImage to ${attached} hero slide(s).`);
}

async function main(): Promise<void> {
  const payload = await getPayload({ config });
  payload.logger.info("Backfilling hero/media...");
  await backfill(payload);
  payload.logger.info("Backfill complete.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});
