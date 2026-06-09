import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { env } from "@/config/env";
import { Courses } from "@/features/home/courses";
import { Cta } from "@/features/home/cta";
import { ExamStrip } from "@/features/home/exam-strip";
import { Footer } from "@/features/home/footer";
import { Header } from "@/features/home/header";
import { Hero, type HeroSlide } from "@/features/home/hero";
import { LatestPosts } from "@/features/home/latest-posts";
import { Testimonials } from "@/features/home/testimonials";
import { Why } from "@/features/home/why";
import { getHeroSlides, getSiteSettings } from "@/lib/cms/queries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n/messages";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { resolveImage } from "@/utils/media";

import type { Metadata } from "next";

/** Per-locale metadata for the homepage (title/description/canonical/hreflang/OG). */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved: Locale = isLocale(locale) ? locale : "en";
  return buildMetadata({
    seo: undefined,
    fallbackTitle: "extopr — From aspirant to topper",
    path: "/",
    locale: resolved,
  });
}

/**
 * Homepage. Assembles the redesigned sections as separate components. Server Component by default;
 * only the carousels, course tabs, and CTA form are client-interactive. Editorial copy comes from
 * the SiteSettings global; the single <h1> lives inside Hero. Emits Organization JSON-LD.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getTranslator(locale);
  const [heroDocs, settings] = [await getHeroSlides(locale), await getSiteSettings(locale)];

  // Map CMS docs to the Hero's slide shape, dropping any slide whose image is unpopulated.
  const slides: HeroSlide[] = heroDocs.flatMap((doc) => {
    const image = resolveImage(doc.image, doc.studentName);
    if (!image) return [];
    return [
      {
        id: String(doc.id),
        image,
        mobileImage: resolveImage(doc.mobileImage, doc.studentName),
        studentName: doc.studentName,
        achievement: doc.achievement,
        caption: doc.caption,
      },
    ];
  });

  return (
    <>
      <JsonLd data={organizationJsonLd({ name: "extopr", url: env.NEXT_PUBLIC_SITE_URL })} />
      <Header locale={locale} />
      <main id="main">
        <Hero
          slides={slides}
          labels={{
            previous: t("hero.previous"),
            next: t("hero.next"),
            goToSlide: t("hero.goToSlide"),
          }}
        />
        <ExamStrip locale={locale} />
        <Why
          eyebrow={t("why.eyebrow")}
          heading={t("why.heading")}
          stats={settings.whyStats}
          asPageHeading
        />
        <Courses locale={locale} />
        <Testimonials locale={locale} />
        <LatestPosts locale={locale} />
        <Cta
          copy={{
            heading: settings.cta?.heading || t("cta.heading"),
            accentWord: settings.cta?.accentWord,
            body: settings.cta?.body || t("cta.body"),
          }}
          formLabels={{
            name: t("cta.name"),
            email: t("cta.email"),
            submit: t("cta.submit"),
            note: settings.cta?.note || t("cta.note"),
            errName: t("cta.errName"),
            errEmail: t("cta.errEmail"),
            success: t("cta.success"),
          }}
        />
      </main>
      <Footer locale={locale} />
    </>
  );
}
