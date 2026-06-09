import { cn } from "@/utils/cn";

/** The cobalt eyebrow label with its leading rule, reused across sections. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary before:inline-block before:h-[1.5px] before:w-[18px] before:bg-primary before:content-['']",
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Section header: eyebrow + serif heading. `center` centers it (used by Testimonials). Keeps the
 * eyebrow/heading rhythm identical everywhere (DRY).
 */
export function SectionHead({
  eyebrow,
  heading,
  center,
  className,
  as: Heading = "h2",
}: {
  eyebrow: string;
  heading: string;
  center?: boolean;
  className?: string;
  /** Heading level. Defaults to h2; pass "h1" for the section that carries the page's single h1. */
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-[560px]", center && "mx-auto text-center", className)}>
      <Eyebrow className={center ? "justify-center" : undefined}>{eyebrow}</Eyebrow>
      <Heading className="mt-4 text-display-section text-foreground">{heading}</Heading>
    </div>
  );
}
