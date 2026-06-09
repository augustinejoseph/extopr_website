"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Lite YouTube facade: renders a thumbnail + play button and swaps in the iframe only on click.
 *
 * Why: embedding raw YouTube iframes is heavy and hurts LCP/INP. Loading the iframe on demand
 * keeps the homepage fast while preserving the video experience. The play control has an
 * accessible label.
 */
export function VideoFacade({
  youtubeId,
  title,
  thumbnailUrl,
  playLabel,
}: {
  youtubeId: string;
  title: string;
  thumbnailUrl: string;
  playLabel: string;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <div className="aspect-video overflow-hidden rounded-md">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerated-motion; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-label={`${playLabel}: ${title}`}
      onClick={() => setActive(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-foreground/30 transition-colors group-hover:bg-foreground/40">
        <span className="rounded-full bg-background/90 px-5 py-3 text-lg font-semibold text-foreground">
          ▶
        </span>
      </span>
    </button>
  );
}
