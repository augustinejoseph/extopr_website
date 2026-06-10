import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getNavigation } from "@/lib/cms/queries";
import { getTranslator } from "@/lib/i18n/messages";
import { cn } from "@/utils/cn";

import { BrandLogo } from "./brand-logo";
import { NavShell } from "./nav-shell";

/**
 * Site header: brand, primary navigation (from the CMS), and login/register CTAs.
 * Server Component — only the scroll-blur shell is interactive. Semantic <header>/<nav> with a
 * skip link target and keyboard-focusable links (accessibility rules).
 */
export async function Header() {
  const [nav, t] = [await getNavigation("header"), getTranslator()];

  return (
    <header>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[101] focus:rounded-pill focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        {t("nav.skipToContent")}
      </a>
      <NavShell>
        <div className="mx-auto flex h-[68px] max-w-wrap items-center justify-between px-[22px] md:px-10">
          <BrandLogo className="text-[23px]" />

          <nav aria-label="Primary" className="hidden items-center gap-[30px] md:flex">
            {nav?.items?.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="text-[14.5px] font-semibold text-ink-2 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="#start"
              className="hidden text-[14.5px] font-semibold text-ink-2 transition-colors hover:text-foreground md:inline"
            >
              {t("nav.login")}
            </Link>
            <Link
              href="#start"
              className={cn(buttonVariants({ variant: "primary", size: "sm" }), "group")}
            >
              {t("nav.register")}
            </Link>
          </div>
        </div>
      </NavShell>
    </header>
  );
}
