import typography from "@tailwindcss/typography";

import type { Config } from "tailwindcss";

/**
 * Tailwind theme wired to the semantic design tokens defined as CSS variables in globals.css.
 * Why: design_pattern.md requires token-driven styling — components reference these names, never
 * raw hex/pixel literals. Direction is editorial ivory + cobalt, light-only (no dark remap).
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./cms/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "ivory-2": "var(--ivory-2)",
        foreground: "var(--foreground)",
        "ink-2": "var(--ink-2)",
        surface: "var(--surface)",
        border: "var(--border)",
        "line-2": "var(--line-2)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
          tint: "var(--cobalt-tint)",
          "tint-2": "var(--cobalt-tint-2)",
        },
        muted: {
          foreground: "var(--muted-foreground)",
        },
        success: "var(--success)",
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        lg: "var(--shadow-lg)",
        cobalt: "var(--shadow-cobalt)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      maxWidth: {
        wrap: "var(--maxw)",
      },
      fontSize: {
        // Type scale (rem) from design_pattern.md, plus fluid editorial display sizes.
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.55" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.3" }],
        "2xl": ["1.5rem", { lineHeight: "1.2" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "display-hero": ["clamp(2.75rem, 12.5vw, 4.5rem)", { lineHeight: "1.04" }],
        "display-section": ["clamp(2rem, 8vw, 2.875rem)", { lineHeight: "1.06" }],
        "display-cta": ["clamp(2.125rem, 8vw, 3.5rem)", { lineHeight: "1.04" }],
      },
      ringColor: {
        DEFAULT: "var(--ring)",
      },
    },
  },
  plugins: [typography],
};

export default config;
