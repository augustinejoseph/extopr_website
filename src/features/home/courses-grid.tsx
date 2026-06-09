"use client";

import { useState } from "react";

import { ButtonArrow,buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

/** Plain, serializable course card shape prepared on the server (no Payload relations). */
export interface CourseCard {
  id: string;
  tag?: string | null;
  rating?: number | null;
  title: string;
  facultyName?: string | null;
  facultyRole?: string | null;
  facultyAccent?: string | null;
  facultyInitials?: string | null;
  meta: { label: string; value: string }[];
  priceLabel?: string | null;
  wasLabel?: string | null;
  accentColor?: string | null;
  href: string;
}

export interface CourseTab {
  key: string;
  label: string;
  courses: CourseCard[];
}

/**
 * Tabbed course grid. Client Component for the tab switch only; all content is server-prepared.
 * Tabs come from the exam grouping, so nothing here hard-codes the exam set.
 */
export function CoursesGrid({ tabs, enrollLabel }: { tabs: CourseTab[]; enrollLabel: string }) {
  const [active, setActive] = useState(tabs[0]?.key ?? "");
  const current = tabs.find((tab) => tab.key === active) ?? tabs[0];

  return (
    <>
      {tabs.length > 1 ? (
        <div role="tablist" aria-label="Course categories" className="mb-[30px] flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.key === current?.key;
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => setActive(tab.key)}
                className={cn(
                  "rounded-pill border-[1.5px] px-[18px] py-2.5 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-ink-2 hover:border-muted-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <ul className="grid gap-5 md:grid-cols-2">
        {current?.courses.map((c) => (
          <li
            key={c.id}
            className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 shadow-sm transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:shadow"
            style={{ borderTop: `3px solid ${c.accentColor || "var(--primary)"}` }}
          >
            <div className="flex items-center justify-between">
              {c.tag ? (
                <span className="rounded-sm bg-primary-tint px-[11px] py-1.5 text-[11px] font-extrabold uppercase tracking-[0.04em] text-primary">
                  {c.tag}
                </span>
              ) : (
                <span />
              )}
              {c.rating ? (
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
                  <span className="text-[13px] text-primary">★</span> {c.rating}
                </span>
              ) : null}
            </div>

            <h3 className="text-[22px] font-extrabold leading-[1.18] tracking-[-0.02em] text-foreground">
              {c.title}
            </h3>

            {c.facultyName ? (
              <div className="flex items-center gap-[11px]">
                <span
                  className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full text-[15px] font-bold text-primary-foreground"
                  style={{ background: c.facultyAccent || "var(--primary)" }}
                >
                  {c.facultyInitials}
                </span>
                <div>
                  <div className="text-sm font-bold text-foreground">{c.facultyName}</div>
                  {c.facultyRole ? (
                    <div className="text-[12.5px] text-muted-foreground">{c.facultyRole}</div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {c.meta.length > 0 ? (
              <div className="flex flex-wrap gap-[18px] border-t border-border pt-4">
                {c.meta.map((m, i) => (
                  <div key={i} className="text-[12.5px] font-semibold text-ink-2">
                    {m.label}: <b className="font-extrabold text-foreground">{m.value}</b>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-0.5 flex items-center justify-between">
              {c.priceLabel ? (
                <div className="font-serif text-[26px] tracking-[-0.01em] text-foreground">
                  {c.priceLabel}
                  {c.wasLabel ? (
                    <s className="ml-1.5 font-sans text-sm font-semibold text-muted-foreground">
                      {c.wasLabel}
                    </s>
                  ) : null}
                </div>
              ) : (
                <span />
              )}
              <a
                href={c.href}
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "group")}
              >
                {enrollLabel}
                <ButtonArrow />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
