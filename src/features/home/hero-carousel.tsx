"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/utils/cn";

import type { ResolvedImage } from "@/utils/media";

/** A single hero slide: a resolved image plus the localized outcome text. */
export interface HeroSlide {
  id: string;
  /** Desktop/wide image, shown from the md breakpoint up. */
  image: ResolvedImage;
  /** Optional portrait crop for small screens; falls back to `image` when absent. */
  mobileImage?: ResolvedImage | null;
  studentName: string;
  achievement?: string | null;
  caption?: string | null;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  labels: { previous: string; next: string; goToSlide: string };
  /** When true the card fills its container (full-width banner) instead of the narrow framed mode. */
  fullWidth?: boolean;
}

const AUTOPLAY_MS = 5000;

/**
 * The hero's right-side visual: an auto-playing carousel of student-outcome images, framed in the
 * design's rounded card with a cobalt glow. Auto-advances unless the user prefers reduced motion
 * (rules.md). Manual arrows + dots. Renders nothing when there are no slides so the hero copy can
 * take the full width.
 */
export function HeroCarousel({ slides, labels, fullWidth = false }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const count = slides.length;
  const goTo = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoplay || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [autoplay, count]);

  if (count === 0) return null;

  const active = slides[index];

  return (
    <div
      className={
        fullWidth
          ? "relative"
          : "relative flex min-h-[430px] items-center justify-center"
      }
    >
      {/* soft cobalt glow behind the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[8%] h-[520px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(44,75,255,.16), transparent 62%)",
        }}
      />
      <div
        aria-roledescription="carousel"
        aria-label={active.studentName}
        className={cn(
          "relative z-[2] w-full overflow-hidden border border-border bg-surface shadow-lg",
          fullWidth ? "rounded-xl" : "max-w-[360px] rounded-xl",
        )}
      >
        <div className="relative">
          {/* Mobile crop below md (hidden when no dedicated mobileImage so the desktop one fills). */}
          {active.mobileImage ? (
            <Image
              key={`${active.id}-mobile`}
              src={active.mobileImage.url}
              alt={active.mobileImage.alt || active.studentName}
              width={active.mobileImage.width}
              height={active.mobileImage.height}
              priority
              sizes="100vw"
              className="h-auto w-full object-cover md:hidden"
            />
          ) : null}
          {/* Desktop/wide image from md up; also the sole image below md when no mobileImage. */}
          <Image
            key={`${active.id}-desktop`}
            src={active.image.url}
            alt={active.image.alt || active.studentName}
            width={active.image.width}
            height={active.image.height}
            priority
            sizes="100vw"
            className={cn(
              "h-auto w-full object-cover",
              active.mobileImage ? "hidden md:block" : "block",
            )}
          />
          <div className="absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
            <p className="text-lg font-extrabold tracking-[-0.01em]">{active.studentName}</p>
            {active.achievement ? (
              <p className="text-sm font-semibold text-primary-foreground/90">
                {active.achievement}
              </p>
            ) : null}
            {active.caption ? <p className="mt-1 text-sm opacity-90">{active.caption}</p> : null}
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                aria-label={labels.previous}
                onClick={() => goTo(index - 1)}
                className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-pill border-[1.5px] border-line-2 bg-surface/90 text-foreground transition-transform hover:-translate-y-1/2 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                ←
              </button>
              <button
                type="button"
                aria-label={labels.next}
                onClick={() => goTo(index + 1)}
                className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-pill border-[1.5px] border-line-2 bg-surface/90 text-foreground transition-transform hover:-translate-y-1/2 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                →
              </button>
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="flex justify-center gap-2 py-4">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${labels.goToSlide} ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-2 rounded-pill transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${
                  i === index ? "w-[26px] bg-primary" : "w-2 bg-line-2"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
