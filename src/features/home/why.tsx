import { SectionHead } from "./section-head";

import type { SiteSetting } from "@cms/payload-types";

type WhyStat = NonNullable<SiteSetting["whyStats"]>[number];

/** Decorative card icon (cobalt stroke). Cycles a small set so each card differs; aria-hidden. */
const ICONS = [
  // people
  "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7 a4 4 0 1 0 0 .01 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  // cap
  "M22 10v6 M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  // play screen
  "M2 3h20v14H2z M8 21h8 M12 17v4",
];

function CardIcon({ which }: { which: number }) {
  return (
    <span className="mb-5 grid h-[54px] w-[54px] place-items-center rounded-md bg-primary-tint">
      <svg
        aria-hidden="true"
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {ICONS[which % ICONS.length].split(" M").map((d, i) => (
          <path key={i} d={i === 0 ? d : `M${d}`} />
        ))}
      </svg>
    </span>
  );
}

/**
 * "Why" section: stat feature cards from SiteSettings.whyStats. Server-rendered; the editor
 * controls how many cards appear.
 *
 * `asPageHeading` makes this section's heading the page's single <h1> (the hero is image-only in
 * the redesign). When set, the section always renders its heading even if no stats are configured,
 * so the page never loses its <h1>.
 */
export function Why({
  eyebrow,
  heading,
  stats,
  asPageHeading = false,
}: {
  eyebrow: string;
  heading: string;
  stats?: WhyStat[] | null;
  asPageHeading?: boolean;
}) {
  const hasStats = !!stats && stats.length > 0;
  if (!hasStats && !asPageHeading) return null;

  return (
    <section id="why" className="py-24 md:py-32">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <SectionHead
          eyebrow={eyebrow}
          heading={heading}
          className="mb-12"
          as={asPageHeading ? "h1" : "h2"}
        />
        {hasStats ? (
        <ul className="grid gap-[18px] md:grid-cols-3">
          {stats.map((item, i) => (
            <li
              key={item.id ?? i}
              className="group rounded-lg border border-border bg-surface p-7 transition-all duration-300 ease-smooth hover:-translate-y-1.5 hover:border-line-2 hover:shadow"
            >
              <CardIcon which={i} />
              {item.stat ? (
                <div className="font-serif text-[42px] leading-none tracking-[-0.02em] text-foreground">
                  {item.stat}
                </div>
              ) : null}
              <h3 className="mb-[7px] mt-3.5 text-lg font-extrabold tracking-[-0.01em] text-foreground">
                {item.title}
              </h3>
              {item.description ? (
                <p className="text-[14.5px] leading-relaxed text-ink-2">{item.description}</p>
              ) : null}
            </li>
          ))}
        </ul>
        ) : null}
      </div>
    </section>
  );
}
