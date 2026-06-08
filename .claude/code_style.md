# Code Style — extopr-website

The goal of every line: **readable, debuggable, extensible, simple.** Prefer the obvious
solution over the clever one. When in doubt, optimize for the next person reading the code.

## Language
- **TypeScript only.** `strict` mode on. No implicit `any`; avoid `any` entirely unless
  justified in a comment. Prefer precise unions and generics over loose types.
- Use ES modules. No default exports for shared utilities (named exports aid discoverability
  and refactoring).

## Naming
- **Files:** `kebab-case` for files and folders (`course-card.tsx`, `seo/json-ld.ts`).
- **React components:** `PascalCase` for the component and its file's exported symbol.
- **Variables / functions:** `camelCase`. Booleans read as predicates (`isLoading`,
  `hasTranslation`).
- **Types / interfaces:** `PascalCase`. No `I`-prefix on interfaces.
- **Constants:** `UPPER_SNAKE_CASE` for true module-level constants.
- Names describe intent, not implementation. No abbreviations that aren't industry-standard.
- **No emojis and no informal or "silly" words** anywhere — identifiers, comments, strings.

## Functions
- Keep functions small and single-purpose. If a function needs a paragraph to explain, split
  it.
- **Every non-trivial function has a short comment** describing its intent — the "why" and
  the contract (inputs, outputs, side effects), not a line-by-line narration.
- Prefer pure functions. Isolate side effects (network, filesystem, env) behind named
  helpers so the rest of the code stays testable.
- Return early to avoid deep nesting. Handle the error/edge case first.

## DRY and shared code
- **All shared, reusable helpers live in a single top-level `src/utils/` folder.** Do not
  scatter "helpers" files across features.
- Before writing a new helper, search `utils/` for an existing one. Extend, don't duplicate.
- A `utils/` module is framework-agnostic where possible (no React/Next imports) so it stays
  unit-testable and portable.

## Structure
- One responsibility per file. Co-locate a component with its styles/tests; put cross-cutting
  logic in `lib/` (domain-specific) or `utils/` (generic).
- Centralize configuration in `config/`, validated at startup. Never read `process.env`
  inline throughout the codebase.

## Comments
- Comment **intent and rationale**, not syntax. Explain why a non-obvious choice was made.
- Use `TODO(name): reason` for deferred work; do not leave bare `TODO`s.
- Remove dead code rather than commenting it out.

## Errors and debugging
- Fail loudly in development; surface actionable messages. Never swallow errors silently.
- Use structured logging with enough context to debug (route, locale, identifiers).
- Validate external data (CMS responses, API responses) at the boundary before use.

## Imports (consistent ordering — enforced)
Use a single, consistent import order in every file, enforced by ESLint
(`import/order` + `simple-import-sort`). Groups, in order, separated by a blank line:

1. Node/builtin and external packages (`react`, `next`, third-party).
2. Internal absolute imports via the path alias (`@/lib`, `@/components`, `@/utils`).
3. Relative imports (`../`, then `./`).
4. Type-only imports (`import type { ... }`) grouped and, where possible, last.
5. Side-effect/style imports last (`import "./styles.css"`).

Rules:
- **Always use the `@/` path alias** for internal modules; avoid deep relative chains like
  `../../../utils`.
- Sort alphabetically within each group. Let the linter autofix; do not order by hand.
- No unused imports (lint blocks them).

## Formatting
- Prettier + ESLint enforce formatting and lint rules; do not hand-fight the formatter.
- Run lint and type-check before considering work complete. A type error is a blocker.

## Don'ts (anti-patterns — do not do these)
- **Don't** use `any` or disable type-checking to silence an error. Type it correctly.
- **Don't** add emojis or informal/"silly" wording anywhere in code, comments, or strings.
- **Don't** duplicate logic — reuse or extract into `src/utils/` (DRY).
- **Don't** scatter helper files across features; shared helpers live only in `src/utils/`.
- **Don't** hard-code the locale set in components; read it from the single i18n config.
- **Don't** hard-code secrets, URLs, or environment values inline; use the typed `config/`.
- **Don't** connect to or assume access to the LMS database; cross-system calls are HTTP only.
- **Don't** mark a component a Client Component unless it genuinely needs interactivity.
- **Don't** ship images without dimensions or `alt` text (layout shift + accessibility).
- **Don't** swallow errors with empty `catch` blocks; handle or surface them.
- **Don't** leave dead/commented-out code or bare `TODO`s.
- **Don't** merge with failing or skipped tests, lint errors, or type errors.
- **Don't** introduce deep relative import chains; use the `@/` alias.

## Related docs
- [CLAUDE.md](./CLAUDE.md) · [rules.md](./rules.md) · [system-architecture.md](./system-architecture.md)
