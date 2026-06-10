import { getTestimonials } from "@/lib/cms/queries";
import { getTranslator } from "@/lib/i18n/messages";

import { SectionHead } from "./section-head";
import { type QuoteCard,TestimonialsCarousel } from "./testimonials-carousel";

/** Decorative avatar accents cycled across cards (Testimonials carry no per-row accent field). */
const ACCENTS = ["#1F8A5B", "#2C4BFF", "#E8743B", "#9B4DE0"];

/**
 * Topper stories. Server Component: fetches testimonials (admin `order`), prepares plain quote
 * cards, and hands the carousel interactivity to the client. Renders nothing when empty.
 */
export async function Testimonials() {
  const [items, t] = [await getTestimonials(), getTranslator()];
  if (items.length === 0) return null;

  const quotes: QuoteCard[] = items.map((item, i) => ({
    id: String(item.id),
    quote: item.quote,
    name: item.studentName,
    context: item.course ?? null,
    initial: item.studentName.trim()[0]?.toUpperCase() ?? "·",
    accent: ACCENTS[i % ACCENTS.length],
  }));

  return (
    <section id="toppers" className="overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-wrap px-[22px] md:px-10">
        <SectionHead
          eyebrow={t("home.testimonials.eyebrow")}
          heading={t("home.testimonials.heading")}
          center
          className="mb-12"
        />
        <TestimonialsCarousel
          quotes={quotes}
          labels={{
            previous: t("hero.previous"),
            next: t("hero.next"),
            goToSlide: t("hero.goToSlide"),
          }}
        />
      </div>
    </section>
  );
}
