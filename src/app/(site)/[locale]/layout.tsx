import {
  DM_Serif_Display,
  Noto_Sans_Kannada,
  Noto_Sans_Tamil,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { notFound } from "next/navigation";

import { isLocale, type Locale, locales } from "@/lib/i18n/config";

import "@/app/globals.css";

/**
 * Font stacks for the editorial ivory/cobalt design (design_pattern.md).
 *
 * Latin: Plus Jakarta Sans (body/UI) + DM Serif Display (headings). The display serif covers
 * Latin only, so for ta/kn we expose the locale's Noto Sans face as BOTH --font-sans and
 * --font-serif — headings fall back to the regional sans rather than tofu. en keeps the serif.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const notoTamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-sans",
  display: "swap",
});
const notoTamilSerif = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-serif",
  display: "swap",
});
const notoKannada = Noto_Sans_Kannada({
  subsets: ["kannada"],
  variable: "--font-sans",
  display: "swap",
});
const notoKannadaSerif = Noto_Sans_Kannada({
  subsets: ["kannada"],
  variable: "--font-serif",
  display: "swap",
});

/** Pre-render a static segment per supported locale. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** Combined sans + serif variable classes per locale. en uses DM Serif for headings. */
const fontClassForLocale: Record<Locale, string> = {
  en: `${jakarta.variable} ${dmSerif.variable}`,
  ta: `${notoTamil.variable} ${notoTamilSerif.variable}`,
  kn: `${notoKannada.variable} ${notoKannadaSerif.variable}`,
};

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Guard against unknown locale segments reaching the layout.
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={fontClassForLocale[locale]}>
      <body className="bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
