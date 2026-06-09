"use client";

import { useEffect, useState } from "react";

import { cn } from "@/utils/cn";

/**
 * Fixed top nav wrapper that turns from transparent to a blurred ivory bar once the page is
 * scrolled past a small threshold (design_pattern.md). Client Component only for the scroll
 * listener; the header content itself stays server-rendered and is passed as children.
 */
export function NavShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-[100] border-b border-transparent transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300",
        scrolled &&
          "border-border bg-background/[0.72] backdrop-blur-[18px] [backdrop-filter:saturate(180%)_blur(18px)]",
      )}
    >
      {children}
    </nav>
  );
}
