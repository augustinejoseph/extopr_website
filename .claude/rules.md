# Rules — extopr-website

Hard rules for this repo. These are not suggestions. If a change cannot satisfy a rule,
stop and raise it rather than working around it.

## Boundaries
- This repo owns **public, SEO-facing surfaces only**. No LMS business logic, no learner
  authentication, no enrollment, no real course data.
- **Never connect to the LMS database.** Any data shared with the LMS travels over HTTP to
  the LMS API. There are no shared tables and no cross-database queries.
- Course/catalog content in this repo is **marketing copy only**. The authoritative course
  data lives in the LMS backend.

## Language and types
- **TypeScript is mandatory.** No untyped JavaScript, no implicit `any`. `strict` mode stays
  on. Prefer precise types over `unknown`/`any`; if you must use `any`, justify it in a
  comment.
- Generate types from Payload collections rather than redeclaring shapes by hand.

## Internationalization
- Supported locales: `en` (default + fallback), `ta` (Tamil), `kn` (Kannada).
- **English is always the fallback.** A missing `ta`/`kn` translation renders the `en` value.
- The supported-locale list lives in **one** config module. Never hard-code locale sets
  inside components or routes.
- Every public page exposes per-locale metadata, canonical URLs, and `hreflang` alternates.

## SEO (the reason this repo exists)
- Every page sets metadata via `generateMetadata` from Payload SEO fields.
- `sitemap.xml` and `robots.txt` are generated from content, never hand-maintained.
- JSON-LD structured data is required on relevant pages (`Organization`, `Course`,
  `BlogPosting`).
- Lighthouse SEO score must stay at or above 95. Treat a regression as a build failure.

## Code quality
- Follow [code_style.md](./code_style.md). Apply the DRY principle: shared logic lives once,
  in the shared `utils/` folder.
- **No emojis and no informal/"silly" wording** in code, comments, identifiers, commit
  messages, or content fixtures.
- Every non-trivial function carries a short comment explaining intent (the "why"), not a
  restatement of the code.
- Code must be readable, debuggable, extensible, and simple. Prefer the obvious solution
  over the clever one.

## Secrets and config
- Secrets come from environment variables and are never committed. `.env*` is git-ignored.
- Configuration is centralized, typed, and validated at startup.

## Testing (test after implementing)
- **Every feature ships with tests.** Implement the feature, then add tests in the same
  change set. A feature is not "done" until it is covered.
- Test the behavior users rely on: page renders, locale fallback to `en`, SEO metadata
  presence, and any data-mapping logic in the CMS/LMS access layers.
- Use Playwright for critical user flows and component/unit tests for utilities and helpers.
- A failing or skipped test is a blocker. Do not merge around it; fix it or remove the cause.
- When you fix a bug, add a regression test that fails before the fix and passes after.

## Performance
- Stay within the Core Web Vitals budget; LCP, CLS, and INP regressions are blockers.
- Prefer Server Components; ship the minimum client JavaScript. Mark Client Components
  deliberately, not by default.
- Use `next/image` for all images, with explicit dimensions to avoid layout shift.
- Cache aggressively: SSG/ISR for content pages; avoid per-request work that can be cached.
- Lazy-load below-the-fold and heavy client components. Avoid large client-side dependencies.
- No unbounded data fetches; paginate and request only the fields a page needs.

## Accessibility (WCAG 2.1 AA)
- All interactive elements are keyboard reachable and operable, with a visible focus state.
- Use semantic HTML (landmarks, headings in order, lists, buttons vs links correctly).
- Every image has meaningful `alt` text (empty `alt=""` for purely decorative images).
- Color contrast meets AA (>= 4.5:1 for text). Never convey meaning by color alone.
- Forms have associated labels and clear, programmatically linked error messages.
- Respect `prefers-reduced-motion`; provide non-animated paths for essential content.
- Set the correct `lang` attribute per locale (`en`/`ta`/`kn`).

## SEO (expanded)
- One `<h1>` per page; headings form a logical outline.
- Descriptive, unique `<title>` and meta description per page and per locale.
- Canonical URLs on every page; `hreflang` alternates across `en`/`ta`/`kn`.
- Crawlable links (real `<a href>`), clean human-readable slugs, no orphan pages.
- Structured data (JSON-LD) validates without errors.
- Maintain 301 redirects via the `Redirects` collection; avoid redirect chains.

## Related docs
- [CLAUDE.md](./CLAUDE.md) — repo overview and boundaries.
- [system-architecture.md](./system-architecture.md) — how the pieces fit together.
- [code_style.md](./code_style.md) — naming, structure, and formatting conventions.
