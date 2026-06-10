import { getCmsClient } from "./client";

import type {
  CourseLanding,
  ExamCategory,
  Faculty,
  HeroCarousel,
  Navigation,
  Page,
  Post,
  SiteSetting,
  Testimonial,
  Video,
} from "@cms/payload-types";
import type { Where } from "payload";

/**
 * Typed CMS access layer.
 *
 * Every read here applies the same baseline: only `active` items, excluding soft-deleted rows
 * (deletedAt is null), and sorted by the admin-controlled `order` so the site reflects drag-and-
 * drop ordering. Components import these functions and never touch Payload directly. The site is
 * English-only, so reads carry no locale.
 */

/** Shared filter: visible (active) and not soft-deleted. */
const visibleWhere: Where = {
  and: [{ active: { equals: true } }, { deletedAt: { equals: null } }],
};

/** Fetch a single published Page by slug. */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "pages",
    where: { and: [{ slug: { equals: slug } }, visibleWhere] },
    limit: 1,
    depth: 2,
  });
  return result.docs[0] ?? null;
}

/**
 * Fetch recent posts for the homepage strip, newest first. `depth: 2` so the related `author`
 * (Faculty) and `category` (ExamCategory) are populated for the post card byline/pill.
 */
export async function getLatestPosts(limit = 3): Promise<Post[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "posts",
    where: visibleWhere,
    sort: "-publishedAt",
    limit,
    depth: 2,
  });
  return result.docs;
}

/** Hero carousel slides, ordered by the admin `order` field. */
export async function getHeroSlides(): Promise<HeroCarousel[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "hero-carousel",
    where: visibleWhere,
    sort: "order",
    depth: 1,
  });
  return result.docs;
}

/** Student testimonials, ordered by the admin `order` field. */
export async function getTestimonials(): Promise<Testimonial[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "testimonials",
    where: visibleWhere,
    sort: "order",
    depth: 1,
  });
  return result.docs;
}

/** YouTube videos for the homepage section, ordered by the admin `order` field. */
export async function getVideos(): Promise<Video[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "videos",
    where: visibleWhere,
    sort: "order",
    depth: 1,
  });
  return result.docs;
}

/** Navigation menu for a given location (header/footer). */
export async function getNavigation(location: "header" | "footer"): Promise<Navigation | null> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "navigation",
    where: { and: [{ location: { equals: location } }, visibleWhere] },
    limit: 1,
    depth: 1,
  });
  return result.docs[0] ?? null;
}

/**
 * All published course-landing teasers, ordered by the admin `order` field. `depth: 2` so the
 * related `exam` and `faculty` docs are populated for the course card.
 */
export async function getCourseLandings(): Promise<CourseLanding[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "course-landing",
    where: visibleWhere,
    sort: "order",
    depth: 2,
  });
  return result.docs;
}

/** Exam categories for the hero chip strip and the Courses tab filter, in admin `order`. */
export async function getExamCategories(): Promise<ExamCategory[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "exam-categories",
    where: visibleWhere,
    sort: "order",
    depth: 1,
  });
  return result.docs;
}

/** Faculty profiles for the Faculty page, in admin `order`. */
export async function getFaculty(): Promise<Faculty[]> {
  const payload = await getCmsClient();
  const result = await payload.find({
    collection: "faculty",
    where: visibleWhere,
    sort: "order",
    depth: 1,
  });
  return result.docs;
}

/** Site-wide singleton copy (hero/trust/why/cta/social). */
export async function getSiteSettings(): Promise<SiteSetting> {
  const payload = await getCmsClient();
  return payload.findGlobal({ slug: "site-settings", depth: 1 });
}
