import Link from "next/link";

import { getNavigation, getSiteSettings } from "@/lib/cms/queries";
import { getTranslator } from "@/lib/i18n/messages";

import { BrandLogo } from "./brand-logo";

import type { Navigation } from "@cms/payload-types";

type NavItem = NonNullable<Navigation["items"]>[number];

/** Social icon paths keyed by the SiteSettings.social field name. */
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <path
      fill="currentColor"
      stroke="none"
      d="M21.6 7.2c.3 1.1.4 3.4.4 4.8s-.1 3.7-.4 4.8a2.5 2.5 0 0 1-1.8 1.8c-1.6.4-7.8.4-7.8.4s-6.2 0-7.8-.4a2.5 2.5 0 0 1-1.8-1.8C2.1 15.7 2 13.4 2 12s.1-3.7.4-4.8a2.5 2.5 0 0 1 1.8-1.8C5.8 5 12 5 12 5s6.2 0 7.8.4a2.5 2.5 0 0 1 1.8 1.8zM10 15l5-3-5-3z"
    />
  ),
  x: (
    <path
      fill="currentColor"
      stroke="none"
      d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.8L5.3 22H2l7.8-8.9L1.4 2H8l4.7 6.2L18.9 2zm-2.3 18h1.8L7.5 3.9H5.6L16.6 20z"
    />
  ),
  telegram: (
    <path
      fill="currentColor"
      stroke="none"
      d="M21.9 4.3l-3.3 15.6c-.25 1.1-.9 1.37-1.83.85l-5.05-3.72-2.44 2.35c-.27.27-.5.5-1.02.5l.36-5.2L17.2 6.5c.4-.36-.09-.56-.62-.2L6.9 12.6 1.95 11.05c-1.07-.34-1.1-1.08.23-1.6L20.5 2.72c.9-.33 1.69.2 1.4 1.58z"
    />
  ),
};

/** Group footer nav items by their `column` heading, preserving order; ungrouped go under "". */
function groupByColumn(items: NavItem[]): { heading: string; links: NavItem[] }[] {
  const order: string[] = [];
  const map = new Map<string, NavItem[]>();
  for (const item of items) {
    const key = item.column ?? "";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  return order.map((heading) => ({ heading, links: map.get(heading)! }));
}

/**
 * Multi-column footer: brand + tagline + social on the left, CMS nav columns on the right, and a
 * bottom legal bar. Server Component; all links are crawlable. Columns come from each nav item's
 * `column` heading so editors control grouping.
 */
export async function Footer() {
  const [nav, settings, t] = [
    await getNavigation("footer"),
    await getSiteSettings(),
    getTranslator(),
  ];
  const year = new Date().getFullYear();
  const columns = groupByColumn(nav?.items ?? []);
  const social = settings.social ?? {};

  const socialLabels: Record<string, string> = {
    instagram: t("social.instagram"),
    youtube: t("social.youtube"),
    x: t("social.x"),
    telegram: t("social.telegram"),
  };

  const legalLinks = [
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/terms", label: t("footer.terms") },
    { href: "/contact", label: t("footer.contact") },
  ];

  return (
    <footer className="border-t border-border pb-8 pt-16">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <div className="grid gap-[38px] md:grid-cols-[1.4fr_1fr] md:items-start">
          <div>
            <BrandLogo className="text-[26px]" />
            <p className="mt-3.5 max-w-[30ch] text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-5 flex gap-2.5">
              {(["instagram", "youtube", "x", "telegram"] as const)
                .filter((key) => social[key])
                .map((key) => (
                  <a
                    key={key}
                    href={social[key] as string}
                    aria-label={socialLabels[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-line-2 text-ink-2 transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-[17px] w-[17px]"
                    >
                      {SOCIAL_ICONS[key]}
                    </svg>
                  </a>
                ))}
            </div>
          </div>

          {columns.length > 0 ? (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {columns.map((col) => (
                <nav key={col.heading} aria-label={col.heading || "Footer"}>
                  {col.heading ? (
                    <h2 className="mb-4 font-sans text-xs font-extrabold uppercase tracking-[0.1em] text-muted-foreground">
                      {col.heading}
                    </h2>
                  ) : null}
                  <ul>
                    {col.links.map((item) => (
                      <li key={`${item.href}-${item.label}`}>
                        <Link
                          href={item.href}
                          className="block py-1.5 text-[14.5px] font-semibold text-ink-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3.5 border-t border-border pt-6 text-[13px] text-muted-foreground">
          <span>
            © {year} extopr Learning Pvt. Ltd. {t("footer.madeInIndia")}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            {legalLinks.map((item, i) => (
              <span key={item.href} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden>·</span> : null}
                <Link
                  href={item.href}
                  className="font-semibold transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                >
                  {item.label}
                </Link>
              </span>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
