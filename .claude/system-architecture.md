# System Architecture — extopr-website

## Role in the platform
extopr is a three-repo platform: this website (public/SEO), the LMS backend (Django API),
and the LMS frontend (Vite SPA). This repo is the **public face**. It shares **no database**
with the LMS; the only permitted coupling is an outbound HTTP call to the LMS API (for
example, an "Enroll" or "Login" link that deep-links into the LMS app).

```
            public visitors / search crawlers
                          │
                          ▼
        ┌───────────────────────────────────┐
        │  extopr-website (Next.js App Router)│
        │  - Marketing, blog, pricing, contact│
        │  - Course catalog landing (teasers) │
        │  - i18n: en (fallback) / ta / kn    │
        └───────┬───────────────────┬─────────┘
                │                   │
        content │                   │ (optional, HTTP only)
                ▼                   ▼
        ┌──────────────┐    ┌──────────────────────┐
        │ Payload CMS  │    │  LMS API (HTTP)       │
        │ (Node/TS)    │    │  cross-system links   │
        └──────┬───────┘    └──────────────────────┘
               │
               ▼
        ┌──────────────┐
        │ Postgres     │  (website's own database — not shared with the LMS)
        └──────────────┘
```

## Layers
- **Presentation (Next.js App Router):** Server Components render pages with SSR/SSG/ISR.
  Routes are locale-aware. Client Components are used only where interactivity requires them.
- **Content (Payload CMS):** authoring and storage of pages, posts, media, navigation, SEO
  fields, redirects, and catalog-landing content. Localization is handled per field.
- **Data access:** a thin, typed CMS client wraps Payload queries. Components never query
  Payload directly; they call typed functions in the CMS access layer.
- **Cross-system:** a typed LMS API client handles the rare outbound HTTP calls to the LMS.

## Suggested folder layout
```
src/
  app/                 # Next.js App Router routes (locale-aware: [locale]/...)
  components/          # Reusable presentational + UI components
  features/            # Feature-scoped UI (blog, catalog, marketing sections)
  lib/
    cms/               # Typed Payload client + queries
    lms-api/           # Typed outbound LMS HTTP client
    seo/               # generateMetadata helpers, JSON-LD builders
    i18n/              # Locale config (single source), translation loading, fallback
  utils/               # ALL shared, framework-agnostic helpers live here (DRY)
  config/              # Centralized, validated configuration
cms/                   # Payload config + collections
```

## Key flows
- **Page render:** route → CMS access layer → Payload → typed content → Server Component →
  `generateMetadata` builds per-locale SEO → HTML with JSON-LD.
- **Localization:** request locale → load translations → fall back to `en` for any missing
  field before rendering.
- **Publish:** editor publishes in Payload → webhook triggers ISR revalidation → fresh page
  is cached and served.

## Boundaries (must hold)
- No direct access to the LMS database from anywhere in this repo.
- All shared helpers live in a single `utils/` folder (see [code_style.md](./code_style.md)).
- Locale set is defined once in `lib/i18n` and imported everywhere.

## Related docs
- [CLAUDE.md](./CLAUDE.md) · [rules.md](./rules.md) · [code_style.md](./code_style.md)
