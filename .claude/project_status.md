# Project Status — extopr-website

_Last updated: 2026-06-08_

## Phase
**Phase 1 — Marketing website + CMS (SEO/SSR).** Currently at the scaffolding stage.

## Current status: Scaffolding
The repository foundation is in place; **no application code exists yet**.

### Done
- Git repository initialized with a TypeScript/Next.js `.gitignore`.
- `.claude/` documentation set: `CLAUDE.md`, `rules.md`, `system-architecture.md`,
  `code_style.md`, `design_pattern.md`, and a `memory/` index.
- Decisions locked: Next.js (App Router) + Payload CMS, TypeScript mandatory, own Neon
  Postgres, i18n (`en` default/fallback, `ta`, `kn`), SEO/accessibility/performance rules,
  trust-blue design tokens.

### Not started
- Next.js app scaffold and Payload CMS setup.
- Payload collections: `Pages`, `Posts`, `Media`, `Navigation`, `SEO` group, `Redirects`,
  `CourseLanding`.
- i18n wiring (locale routing + Payload localization + English fallback).
- SEO plumbing: `generateMetadata`, `sitemap.xml`, `robots.txt`, JSON-LD, `hreflang`.
- Marketing pages (home, about, pricing, contact, catalog landing, blog).
- Tailwind + shadcn/ui theme wired to the design tokens.
- Tests (Playwright + unit) and Lighthouse CI.
- Deploy to Vercel + Neon.

## Next steps
1. Scaffold Next.js (App Router, TypeScript) + Payload CMS, wired to a Neon database.
2. Define Payload collections and the localization configuration.
3. Implement SEO and i18n foundations before building pages.
4. Build marketing pages with tests added alongside each feature.

## Notes
- This repo shares no database with the LMS; cross-system links are HTTP only.
- Update this file as milestones complete so status stays accurate.
