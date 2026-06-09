# extopr-website

The public marketing website and content CMS for the **extopr** learning platform.

This is the SEO-facing front door: marketing pages, blog, pricing, contact, and course
**catalog landing** teasers. It does **not** contain LMS business logic, learner auth, or
enrollment — the real course/learner data lives in the separate LMS backend and is only ever
reached over HTTP, never via a shared database.

> **Phase 1.** The homepage and CMS are built; most sub-pages (about, blog, pricing, etc.) are
> still being built out. See [`.claude/project_status.md`](.claude/project_status.md) for what
> currently ships.

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 15](https://nextjs.org) (App Router, React Server Components) |
| Language | TypeScript (mandatory — no untyped JS) |
| CMS | [Payload CMS 3](https://payloadcms.com) (self-hosted, runs inside the Next.js app) |
| Database | PostgreSQL (the website's **own** database — never the LMS database) |
| Styling | [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) |
| Rich text | Lexical (`@payloadcms/richtext-lexical`) |
| Images | `sharp` (upload resizing) + `next/image` (delivery) |
| i18n | English (`en`, default + fallback), Tamil (`ta`), Kannada (`kn`) |
| Tests | Vitest (unit) + Playwright (e2e) |
| Hosting | Next.js → Vercel · Postgres → Neon · Media → local now, Cloudflare R2 later |

**Requirements:** Node `>=20.9.0` and a reachable PostgreSQL instance.

### Where things live

```
cms/                     Payload config, collections, globals, generated payload-types.ts
src/app/(site)/[locale]/ Public, locale-prefixed marketing pages
src/app/(payload)/       Payload admin panel + REST/GraphQL API routes
src/features/            Page sections (home hero, footer, exam strip, …)
src/lib/cms/             Typed query helpers over the Payload Local API
src/lib/i18n/            Locale config + UI string messages (en/ta/kn)
src/config/env.ts        Zod-validated environment access (import `env`, never process.env)
scripts/                 push-schema.ts (dev), seed.ts (sample content)
.claude/                 Project docs: architecture, design system, rules, status
```

Path aliases: `@/` → `src/`, `@cms/` → `cms/`.

---

## Running locally

### 1. Prerequisites

- Node `>=20.9.0`
- A local PostgreSQL server with an empty database, e.g.:

  ```bash
  createdb extopr_website
  ```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the template and fill it in:

```bash
cp .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `DATABASE_URI` | Postgres connection string for the website's own DB |
| `PAYLOAD_SECRET` | Secret Payload uses to sign/encrypt — use a strong value outside local |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin (canonical URLs, hreflang, sitemap, OG) |
| `LMS_API_BASE_URL` | Outbound LMS API base for Enroll/Login deep links (empty until the LMS client lands) |
| `REVALIDATE_SECRET` | Shared secret guarding the Payload-publish → ISR revalidation webhook |

### 4. Create the database schema

In development the Postgres adapter uses **push mode** — it syncs tables from the Payload
config on boot. Run this once (and after schema-affecting changes) so queries have tables to
read:

```bash
npm run db:push
```

### 5. Seed sample content (optional but recommended)

Populates the homepage and admin with realistic localized content (hero, footer nav columns,
**footer social links**, testimonials, posts, etc.). It demonstrates the en→ta/kn fallback by
intentionally leaving some regional translations blank.

```bash
npm run db:seed
```

The seed is **guarded**: the bulk content seed runs only on a fresh DB (no users yet), but the
site-settings global and footer navigation are re-applied on every run so new fields land on an
already-populated database.

Seeded admin login: **`admin@extopr.test`** / **`Admin12345!`**

> **Note:** the standalone `scripts/` (`db:push`, `db:seed`) do not auto-load `.env` the way
> Next.js does. If you hit `DATABASE_URI: Required`, run them with the env file loaded, e.g.
> `node --env-file=.env ./node_modules/.bin/tsx scripts/seed.ts`.

### 6. Start the dev server

```bash
npm run dev
```

There is **no separate Payload server** — the CMS runs inside the same Next.js app:

| Surface | URL |
|---------|-----|
| Public site | http://localhost:3000 |
| Payload admin | http://localhost:3000/admin |
| REST API | http://localhost:3000/api (e.g. `/api/globals/site-settings`) |
| GraphQL playground | http://localhost:3000/api/graphql-playground |

---

## Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start Next.js (site + Payload admin) in development |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` / `format:check` | Prettier write / check |
| `npm run db:push` | Sync the Postgres schema from the Payload config (dev push mode) |
| `npm run db:seed` | Seed sample localized content (idempotent for settings/footer) |
| `npm run generate:types` | Regenerate `cms/payload-types.ts` from the config |
| `npm run generate:importmap` | Regenerate the Payload admin import map |
| `npm run test` / `test:watch` | Vitest unit tests |
| `npm run test:e2e` | Playwright e2e (start `npm run start` first, or let Playwright manage it) |

> **Payload CLI quirk:** the `payload`, `generate:types`, and `generate:importmap` scripts set
> `PAYLOAD_CONFIG_PATH=cms/payload.config.ts` via `cross-env`. Invoking the Payload CLI directly
> without that env var set will silently no-op.

---

## Database migrations

Two different workflows by environment — **never run dev push mode against production.**

### Development

Push mode keeps your local schema in sync without writing migration files:

```bash
npm run db:push
```

### Production (recommended workflow)

Production must use **versioned SQL migrations**, not push. Payload's CLI generates and applies
them from the Postgres adapter:

```bash
# Generate a migration from the current config vs. the DB
npm run payload migrate:create

# Apply pending migrations (run during deploy, before the app starts)
npm run payload migrate

# Inspect / roll back
npm run payload migrate:status
npm run payload migrate:down
```

Commit the generated migration files and run `migrate` as a deploy step (e.g. a Vercel build/
release command) so the schema is updated deterministically across environments.

> ⚠️ **Not yet wired up.** The Postgres adapter in [`cms/payload.config.ts`](cms/payload.config.ts)
> does not yet configure a `migrationDir` / `prodMigrations`, and there is no `migrations/`
> directory or `db:migrate` npm script. Before the first production deploy, set up the migration
> directory in the adapter and add wrapper scripts. Until then, treat the commands above as the
> target setup.

---

## Production setup

1. **Provision Postgres** (Neon) and set `DATABASE_URI` to its connection string. This must be a
   dedicated database for the website — it must **never** point at the LMS database.
2. **Set environment variables** on the host (Vercel project settings):
   `DATABASE_URI`, `PAYLOAD_SECRET` (strong, unique), `NEXT_PUBLIC_SITE_URL` (the real origin),
   `LMS_API_BASE_URL` (when the LMS client lands), `REVALIDATE_SECRET`.
3. **Apply migrations** as a deploy step (see [Database migrations](#database-migrations)) — do
   not rely on dev push mode in production.
4. **Build & deploy** to Vercel (`npm run build`; Vercel runs this automatically on push).
5. **Media storage:** local disk for now; migrate to Cloudflare R2 before scaling.
6. **ISR revalidation:** content edits in Payload trigger ISR revalidation via a publish webhook
   guarded by `REVALIDATE_SECRET`.

---

## Hard rules

- **TypeScript everywhere.** No untyped JS.
- **Never** connect to the LMS database. Website ↔ LMS communication is **HTTP only**.
- Keep real course/learner data out of this repo — catalog content here is marketing copy.
- Drive supported languages from the single i18n config; never hard-code a fixed locale set in
  component logic. English is always the fallback for missing `ta`/`kn` values.
- SEO is the reason this repo exists: every page sets metadata, and the site emits a dynamic
  `sitemap.xml`, `robots.txt`, JSON-LD, canonical URLs, and per-locale `hreflang`.

---

## Further documentation

Project docs live under [`.claude/`](.claude/):

- [`CLAUDE.md`](.claude/CLAUDE.md) — concern boundary, stack, collections, i18n & SEO rules
- [`system-architecture.md`](.claude/system-architecture.md) — how the layers fit together
- [`design_pattern.md`](.claude/design_pattern.md) — palette, typography, components (the Claude design)
- [`code_style.md`](.claude/code_style.md) — naming, imports, structure, formatting
- [`rules.md`](.claude/rules.md) — boundaries, accessibility, performance, testing
- [`project_status.md`](.claude/project_status.md) — current build status and what's next
