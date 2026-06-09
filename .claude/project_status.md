# Project Status — extopr-website

_Last updated: 2026-06-09_

## Phase
**Phase 1 — Marketing website + CMS (SEO/SSR).** Foundations complete; **homepage redesign +
redesign CMS schema built** (Claude Design handoff). Static sub-pages still pending.

## Active work: redesign to the ivory/cobalt direction
A Claude Design handoff bundle (`.claude/claude_design/`) replaces the original trust-blue look
with an **editorial ivory + cobalt** system (DM Serif Display + Plus Jakarta Sans). See the
rewritten [design_pattern.md](./design_pattern.md).

Decisions locked for the redesign:
- **Brand name stays "extopr"** — the mock's "xtopr" wordmark is style reference only.
- **Light-only theme** — drop the dark variant; remap the same semantic tokens to ivory/cobalt.
- **Full homepage redesign** — all mock sections (hero, exam strip, why/stats, tabbed courses,
  testimonial carousel, blog, email-capture CTA, multi-column footer), plus the 10 static
  sub-pages (about, careers, contact, faculty, free-resources, help, mock-tests, privacy, terms,
  refunds).
- **Hero is an image-only full-width banner** (no overlaid copy) using `HeroCarousel`. Because the
  hero carries no text, the page's single `<h1>` lives on the "Why" section. Testimonials show the
  previous/next quotes peeking beside the active one (`md`+).
- SEO/a11y rules are non-negotiable and override literal mock fidelity where they conflict
  (Lighthouse SEO ≥ 95, AA contrast, labeled icons, non-color state cues).

### CMS changes the redesign requires
(Full rationale in the analysis handed to the team; summary:)
- **Create `Faculty`**, **`ExamCategories`**, and a **`SiteSettings` global**.
- **Extend `CourseLanding`** (exam, faculty, tag, rating, marketing price labels, meta rows),
  **`Posts`** (category, readTime), **`Navigation`** (column groups + social links).
- **`HeroCarousel`**: **kept as-is.** The new hero's right-side visual is the existing
  `HeroCarousel` (student-outcome images), not the mock's static phone mockup. **`Videos`**: keep
  the collection but drop the section from the new homepage.
- `CourseLanding.priceLabel` is **optional** free-text marketing display (not authoritative
  pricing).
- No change: `Media`, `Pages`, `Redirects`, `Users`, `SEO` group.

### Redesign — built so far
- **Design foundation:** ivory/cobalt tokens (light-only) in `globals.css` + Tailwind theme;
  DM Serif Display + Plus Jakarta Sans wired per locale (ta/kn map their Noto face to the serif
  var); pill-shaped `Button` (primary/ghost/link/destructive/icon) + `ButtonArrow`.
- **CMS schema:** `ExamCategories`, `Faculty` collections + `SiteSettings` global created;
  `CourseLanding`/`Posts`/`Navigation` extended; `Posts.author` now → `Faculty`; typed queries
  added (`getExamCategories`/`getFaculty`/`getSiteSettings`); schema pushed to Postgres.
- **Homepage components** (`src/features/home`): `Header` (fixed scroll-blur `NavShell`,
  `BrandLogo`, login/register), image-only `Hero` + `HeroCarousel`, `ExamStrip`, `Why` (carries
  `<h1>`), `Courses` + `CoursesGrid` (tabbed), `Testimonials` + `TestimonialsCarousel` (peek),
  `LatestPosts` (new cards), `Cta` + `CtaForm` (validated email capture), multi-column `Footer`,
  shared `SectionHead`/`Eyebrow`. `Videos` kept but no longer on the homepage.
- **i18n:** all UI strings translated in `en`/`ta`/`kn` (no longer partial); fallback test now
  asserts every key resolves non-empty in every locale.
- Verified: `typecheck`, `lint`, unit tests (15), and `next build` (en/ta/kn) all pass.

### Redesign — still pending
- The 10 static sub-pages — footer links to them 404 until built.
- Seeding CMS content: `SiteSettings`, `ExamCategories`, `Faculty`, `CourseLanding`, and
  `Testimonials` are empty, so those sections render nothing until populated in `/admin`.
- Playwright smoke test still asserts the old hero `<h1>`; update it for the new structure.
- `db:push` requires `.env` sourced manually for the standalone `tsx scripts/push-schema.ts`
  (Next auto-loads it, the script does not): `set -a && . ./.env && set +a && npm run db:push`.

## Current status: Foundations + landing page built
The Next.js + Payload application is scaffolded, runs against local Postgres, and the
homepage renders. `build`, `lint`, `typecheck`, unit tests, and Playwright smoke tests all
pass.

### Done
- Git repository + `.claude/` documentation set.
- Decisions locked: Next.js (App Router) + Payload CMS, TypeScript strict, own Postgres,
  i18n (`en` default/fallback, `ta`, `kn`), SEO/accessibility/performance rules,
  trust-blue design tokens.
- **Scaffold:** Next.js 15 (App Router) + TypeScript strict, Tailwind, ESLint
  (`import/order` + `simple-import-sort`) + Prettier, `@/` and `@cms/` path aliases, typed
  zod-validated config in `src/config/env.ts` (no inline `process.env`).
- **Design tokens:** `design_pattern.md` tokens mapped to CSS variables + Tailwind theme;
  shadcn-style `Button`. _(Being reworked to the ivory/cobalt, light-only system — see Active
  work above.)_
- **Payload CMS on Postgres** (`extopr_website` db): shared base via `buildCollection`
  (order/active/soft-delete `deletedAt`/`deletedBy` + public read), reusable `SEO` field
  group, localization (`en`/`ta`/`kn`, English fallback), generated types, schema pushed.
  Collections: `Pages`, `Posts`, `Media`, `Navigation`, `Redirects`, `CourseLanding`,
  `HeroCarousel`, `Testimonials`, `Videos` (+ `Users`).
- **CMS access layer** (`src/lib/cms`): typed queries that filter active/soft-deleted and
  sort by `order`.
- **i18n:** single locale config, locale-routing middleware (en unprefixed), en-fallback
  helpers for CMS fields and UI strings, Tamil/Kannada fonts.
- **SEO:** `buildMetadata` (per-locale title/description/canonical/hreflang/OG), JSON-LD
  builders (`Organization`/`Course`/`BlogPosting`/`VideoObject`), generated `sitemap.xml`
  + `robots.txt`, ISR revalidate webhook, CMS-driven 301/302 redirects via middleware,
  Lighthouse CI config (SEO ≥ 95).
- **Landing page** as separate components: `Header`, `Hero` (auto-play carousel,
  reduced-motion aware), `LatestPosts`, `Testimonials`, `Videos` (lite YouTube facade +
  VideoObject JSON-LD), `Footer`; page-level `generateMetadata` + Organization JSON-LD.
- **Tests:** unit (i18n fallback, SEO mapping, JSON-LD, URL helpers) + Playwright smoke
  (render, single h1, canonical/hreflang, Organization JSON-LD, locale routing).

### Not started (later passes)
- Remaining marketing pages (about, pricing, contact, catalog landing, blog list+post).
- Typed LMS API client (`src/lib/lms-api`) for Enroll/Login deep links (LMS base URL empty
  for now).
- Full Playwright flow coverage + per-page Lighthouse runs in CI.
- Production migrations (replace dev schema push), deploy to Vercel + Neon, media → R2.

## Next steps
1. Build the remaining marketing pages (each with `generateMetadata` + tests).
2. Add the LMS API client once the LMS base URL is available.
3. Replace dev schema push with Payload migrations; set up CI + Vercel/Neon deploy.

## Local development
- Env vars live in `.env` (git-ignored); template in `.env.example`.
- `npm run db:push` syncs the Postgres schema (dev). `npm run generate:types` /
  `generate:importmap` regenerate Payload artifacts. `npm run dev` serves the site +
  `/admin`.

## Notes
- This repo shares no database with the LMS; cross-system links are HTTP only.
- Update this file as milestones complete so status stays accurate.
