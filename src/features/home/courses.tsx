import { getCourseLandings } from "@/lib/cms/queries";
import { getTranslator } from "@/lib/i18n/messages";
import { resolveImage } from "@/utils/media";

import { type CourseCard, CoursesGrid, type CourseTab } from "./courses-grid";
import { SectionHead } from "./section-head";

import type { ExamCategory, Faculty } from "@cms/payload-types";

/** Two uppercase initials from a name, for the faculty avatar fallback. */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/** A populated relation comes back as the doc; an unpopulated one as an id — narrow to the doc. */
function asDoc<T extends { id: number }>(rel: T | number | null | undefined): T | null {
  return rel && typeof rel === "object" ? rel : null;
}

/**
 * Featured courses, grouped into tabs by exam group. MARKETING TEASERS ONLY — the Enroll link is
 * an outbound LMS deep link (lmsUrl), never an in-repo enrollment flow, and prices are display
 * labels. Server Component: prepares plain card data, hands interactivity to CoursesGrid.
 */
export async function Courses() {
  const [docs, t] = [await getCourseLandings(), getTranslator()];
  if (docs.length === 0) return null;

  // Group courses by their exam's coarse `group` (falls back to a single "all" tab).
  const byTab = new Map<string, { label: string; courses: CourseCard[] }>();

  for (const doc of docs) {
    const exam = asDoc<ExamCategory>(doc.exam);
    const faculty = asDoc<Faculty>(doc.faculty);
    const tabKey = exam?.group ?? "all";
    const tabLabel = exam?.group
      ? { neet: "NEET", jee: "JEE", commerce: "Commerce & CA", other: "Other" }[exam.group] ??
        exam.group
      : t("courses.heading");

    const card: CourseCard = {
      id: String(doc.id),
      tag: doc.tag ?? exam?.name ?? null,
      rating: doc.rating ?? null,
      title: doc.title,
      facultyName: faculty?.name ?? null,
      facultyRole: faculty ? [faculty.role, faculty.credential].filter(Boolean).join(" · ") : null,
      facultyAccent: faculty?.accentColor ?? null,
      facultyInitials: faculty ? initials(faculty.name) : null,
      facultyPhoto: faculty ? resolveImage(faculty.photo, faculty.name) : null,
      meta: (doc.meta ?? []).map((m) => ({ label: m.label, value: m.value })),
      priceLabel: doc.priceLabel ?? null,
      wasLabel: doc.wasLabel ?? null,
      accentColor: doc.accentColor ?? null,
      href: doc.lmsUrl || "#start",
    };

    const bucket = byTab.get(tabKey);
    if (bucket) bucket.courses.push(card);
    else byTab.set(tabKey, { label: tabLabel, courses: [card] });
  }

  const tabs: CourseTab[] = [...byTab.entries()].map(([key, { label, courses }]) => ({
    key,
    label,
    courses,
  }));

  return (
    <section id="courses" className="bg-ivory-2 py-24 md:py-32">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <SectionHead
          eyebrow={t("courses.eyebrow")}
          heading={t("courses.heading")}
          className="mb-12"
        />
        <CoursesGrid tabs={tabs} enrollLabel={t("courses.enroll")} />
      </div>
    </section>
  );
}
