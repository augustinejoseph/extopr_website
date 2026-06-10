"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

import type { ResolvedImage } from "@/utils/media";

/** Plain testimonial card data prepared on the server. */
export interface QuoteCard {
  id: string;
  quote: string;
  name: string;
  context?: string | null;
  initial: string;
  accent: string;
  photo?: ResolvedImage | null;
}

const AUTOPLAY_MS = 5500;

/**
 * Serif pull-quote carousel. Slides translate horizontally; dots + arrows control it; autoplay
 * pauses for reduced-motion users (rules.md). Client Component for the interactivity only.
 */
export function TestimonialsCarousel({
  quotes,
  labels,
}: {
  quotes: QuoteCard[];
  labels: { previous: string; next: string; goToSlide: string };
}) {
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  // From `md` up we narrow the slides so the previous/next quotes peek beside the active one;
  // below that each slide is full-width (no peek) for readability on phones.
  const [peek, setPeek] = useState(false);
  const count = quotes.length;
  const goTo = useCallback((next: number) => setIndex((next + count) % count), [count]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setAutoplay(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setPeek(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!autoplay || count <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [autoplay, count]);

  // Slide width as a % of the track: narrower when peeking (neighbours show) else full-width.
  // The track is shifted so the active slide stays centred for either width.
  const slidePct = peek ? 72 : 100;
  const offset = 50 - slidePct / 2 - index * slidePct;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-smooth"
          style={{ transform: `translateX(${offset}%)` }}
        >
          {quotes.map((q, i) => {
            const isActive = i === index;
            return (
              <figure
                key={q.id}
                aria-hidden={!isActive}
                style={{ flexBasis: `${slidePct}%` }}
                className="flex flex-none justify-center px-2 transition-all duration-500 ease-smooth"
              >
                <div
                  onClick={isActive ? undefined : () => goTo(i)}
                  className={`relative flex min-h-[400px] w-full max-w-[600px] flex-col justify-center rounded-xl border bg-surface px-10 py-14 transition-all duration-500 ease-smooth ${
                    isActive
                      ? "border-border opacity-100 shadow"
                      : "scale-95 cursor-pointer border-border/60 opacity-40 hover:opacity-70"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-6 top-10 font-serif text-[120px] leading-[0.5] text-primary-tint-2"
                  >
                    ”
                  </span>
                  <blockquote className="relative z-[1] font-serif text-[clamp(22px,5.5vw,30px)] leading-[1.28] tracking-[-0.01em] text-foreground">
                    {q.quote}
                  </blockquote>
                  <figcaption className="relative z-[1] mt-6 flex items-center gap-3.5">
                    {q.photo ? (
                      <Image
                        src={q.photo.url}
                        alt={q.photo.alt}
                        width={50}
                        height={50}
                        className="h-[50px] w-[50px] flex-none rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="grid h-[50px] w-[50px] flex-none place-items-center rounded-full text-[17px] font-bold text-primary-foreground"
                        style={{ background: q.accent }}
                      >
                        {q.initial}
                      </span>
                    )}
                    <div>
                      <div className="text-base font-extrabold text-foreground">{q.name}</div>
                      {q.context ? (
                        <div className="text-[13px] font-bold text-primary">{q.context}</div>
                      ) : null}
                    </div>
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      </div>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {quotes.map((q, i) => (
              <button
                key={q.id}
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
          <div className="flex gap-2.5">
            <button
              type="button"
              aria-label={labels.previous}
              onClick={() => goTo(index - 1)}
              className="grid h-[46px] w-[46px] place-items-center rounded-pill border-[1.5px] border-line-2 bg-surface text-foreground transition-transform hover:-translate-y-0.5 hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              ←
            </button>
            <button
              type="button"
              aria-label={labels.next}
              onClick={() => goTo(index + 1)}
              className="grid h-[46px] w-[46px] place-items-center rounded-pill border-[1.5px] border-line-2 bg-surface text-foreground transition-transform hover:-translate-y-0.5 hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              →
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
