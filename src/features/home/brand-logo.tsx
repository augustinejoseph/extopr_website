import Link from "next/link";

import { cn } from "@/utils/cn";

/**
 * Wordmark used in the header and footer. "extopr" with the trailing "opr" in cobalt plus a small
 * cobalt dot — the design's logo treatment (the mock's "xtopr•"), kept on the real brand name.
 * Links home.
 */
export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="extopr — home"
      className={cn(
        "inline-flex items-baseline font-sans font-extrabold tracking-[-0.04em] text-foreground",
        className,
      )}
    >
      <span>ext</span>
      <span className="text-primary">opr</span>
      <span className="ml-0.5 inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-primary" />
    </Link>
  );
}
