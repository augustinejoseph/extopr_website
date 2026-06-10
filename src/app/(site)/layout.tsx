import { DM_Serif_Display, Plus_Jakarta_Sans } from "next/font/google";

import "@/app/globals.css";

/**
 * Font stacks for the editorial ivory/cobalt design (design_pattern.md).
 *
 * Plus Jakarta Sans (body/UI) + DM Serif Display (headings). The site is English-only.
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

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${dmSerif.variable}`}>
      <body className="bg-background font-sans text-foreground antialiased">{children}</body>
    </html>
  );
}
