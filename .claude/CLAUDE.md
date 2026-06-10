# extopr-website

Public marketing website + CMS for the extopr platform. **Phase 1.** Owned by the website team.

## Concern boundary
This repo owns **all public, SEO-facing surfaces**: marketing pages, blog, pricing, contact,
and course **catalog landing** pages (marketing teasers only — the real course data lives in
the LMS backend, never here). It does **not** contain LMS business logic, learner auth, or
enrollment.

## Stack
- **Next.js (App Router)** — SSR/SSG/ISR, React Server Components. **TypeScript mandatory.**
- **Payload CMS** (self-hosted, Node/TS) for content authoring.
- **Tailwind CSS** + shadcn/ui.
- **Database:** its **own Postgres** database. This repo has **no access** to the LMS
  database — any cross-system need goes over HTTP to the LMS API, never via shared tables.

## Payload collections
`Pages`, `Posts` (blog), `Media`, `Navigation`, reusable `SEO` group, `Redirects`,
`CourseLanding` (marketing-only course teasers), `Testimonials`, `Videos`, `Users`.
Redesign adds: `Faculty`, `ExamCategories`, and a `SiteSettings` global (see
[project_status.md](./project_status.md)). `HeroCarousel` stays — it now drives the full-width,
image-only hero banner. **All course/faculty/exam content here is marketing copy — real data is
LMS-owned.**

## Language
The website is **English-only**. There is no Payload localization (each collection is a single
table — no `*_locales`), no locale-prefixed routes, no locale switcher, and no `hreflang`
alternates. UI strings live in the single English dictionary at `src/lib/i18n/messages/en.ts`,
surfaced via the `getTranslator()` helper. (Multi-locale support was removed; re-introducing it
would mean restoring Payload localization plus locale-prefixed routing.)

## SEO rules (non-negotiable — SEO is the reason this repo exists)
- Every page sets metadata via `generateMetadata`, fed from Payload SEO fields.
- Dynamic `sitemap.xml` + `robots.txt` generated from Payload content.
- JSON-LD structured data: `Organization`, `Course`, `BlogPosting`.
- Canonical URLs, OpenGraph/Twitter cards, `next/image` optimization.
- ISR revalidation via Payload publish webhook.
- Maintain a `Redirects` collection for 301s. Lighthouse CI budget: SEO ≥ 95.

## Hosting
Next.js → Vercel. Postgres → Neon. Media → local now, Cloudflare R2 later.

## Hard rules
- **TypeScript everywhere.** No untyped JS.
- **Never** connect to the LMS database. Website ↔ LMS = HTTP only.
- Keep real course/learner data out of this repo — catalog content here is marketing copy.

## Project docs (read before contributing)
- [rules.md](./rules.md) — hard rules: boundaries, SEO, accessibility, performance,
  testing, code quality.
- [system-architecture.md](./system-architecture.md) — how the layers and pieces fit.
- [code_style.md](./code_style.md) — naming, imports, structure, DRY, Don'ts, formatting.
- [design_pattern.md](./design_pattern.md) — palette, typography, buttons, radius, tokens.
- [project_status.md](./project_status.md) — current build status and what's next.
