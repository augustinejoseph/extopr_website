import { HeroCarousel, type HeroSlide } from "./hero-carousel";

export type { HeroSlide };

interface HeroProps {
  slides: HeroSlide[];
  labels: { previous: string; next: string; goToSlide: string };
}

/**
 * Homepage hero. A full-width banner carousel of student-outcome images — no overlaid copy. Server
 * Component (only the carousel is interactive).
 *
 * Note: the page's single <h1> intentionally does NOT live here (the hero is image-only). It moves
 * to the first content section (Why) so the "one h1 per page" SEO rule still holds.
 */
export function Hero({ slides, labels }: HeroProps) {
  return (
    <header className="relative overflow-hidden pb-12 pt-[88px] md:pb-16">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <HeroCarousel slides={slides} labels={labels} fullWidth />
      </div>
    </header>
  );
}
