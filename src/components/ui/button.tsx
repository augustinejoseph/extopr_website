import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

/**
 * Button variants and sizes from design_pattern.md (editorial ivory/cobalt).
 *
 * Pill-shaped, lift on hover. Variants map to semantic tokens so the look stays consistent and
 * components never hard-code hex/pixels. focus-visible ring + disabled handling satisfy the
 * accessibility rules. `buttonVariants` is exported so anchors styled as buttons (the hero/course
 * CTAs are <a>/<Link>) share the exact same classes.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill font-bold leading-none transition-[transform,box-shadow,background-color,border-color] duration-300 ease-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-cobalt hover:-translate-y-0.5 hover:bg-primary-hover",
        ghost:
          "border-[1.5px] border-line-2 bg-surface text-foreground hover:-translate-y-0.5 hover:border-foreground hover:shadow",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "px-[18px] py-[11px] text-sm",
        md: "px-6 py-[14px] text-[15px]",
        icon: "h-[46px] w-[46px] border-[1.5px] border-line-2 bg-surface text-foreground hover:-translate-y-0.5 hover:border-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";

/**
 * Trailing arrow that nudges right on the parent button/anchor's hover. Decorative, so it is
 * hidden from assistive tech. Pair it inside any element carrying `buttonVariants`.
 */
function ButtonArrow({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block transition-transform duration-300 ease-smooth group-hover:translate-x-[3px]",
        className,
      )}
    >
      →
    </span>
  );
}

export { Button, ButtonArrow, buttonVariants };
