import Link from "next/link";

import { getExamCategories } from "@/lib/cms/queries";
import { getTranslator } from "@/lib/i18n/messages";

/**
 * Horizontally scrollable strip of exam chips, driven entirely by the ExamCategories collection
 * (CLAUDE.md: never hard-code the exam set in components). Each chip links to the Courses section.
 * Server Component; renders nothing when no categories exist.
 */
export async function ExamStrip() {
  const [exams, t] = [await getExamCategories(), getTranslator()];
  if (exams.length === 0) return null;

  return (
    <section className="overflow-hidden pb-16 pt-2">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <div className="mb-[18px] flex items-baseline justify-between gap-4">
          <span className="eyebrow inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary before:inline-block before:h-[1.5px] before:w-[18px] before:bg-primary before:content-['']">
            {t("examStrip.eyebrow")}
          </span>
          <p className="text-sm font-semibold text-muted-foreground">{t("examStrip.swipe")}</p>
        </div>
      </div>
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <ul className="-mx-[22px] flex snap-x snap-mandatory gap-[11px] overflow-x-auto px-[22px] pb-3.5 pt-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mx-10 md:px-10">
          {exams.map((exam) => (
            <li key={exam.id} className="flex-none snap-start">
              <Link
                href="#courses"
                className="group inline-flex items-center gap-[9px] rounded-pill border-[1.5px] border-line-2 bg-surface px-[18px] py-[11px] text-[14.5px] font-bold text-foreground transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {exam.name}
                {exam.batchCount ? (
                  <span className="rounded-pill bg-ivory-2 px-2 py-0.5 text-[11px] font-bold text-muted-foreground transition-colors group-hover:bg-primary-tint group-hover:text-primary">
                    {exam.batchCount}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
