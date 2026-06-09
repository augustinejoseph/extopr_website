# Design Pattern — extopr-website

Visual language for the public website. Direction: **editorial ivory + cobalt** — warm,
premium, and confident, suited to an academic platform aimed at aspirants. This supersedes the
earlier "trust-blue/Inter" direction. All values are **design tokens**; never hard-code raw hex
or pixel values in components. Expose tokens via the Tailwind theme / CSS variables and
reference them by name.

> Source of truth: the Claude Design handoff under `.claude/claude_design/` (`project/xtopr.html`
> + `project/pages/page.css`). The mock uses the wordmark "xtopr"; the **product name stays
> "extopr"** — adopt the mock's visual style, not its brand name.

## Principles
- Token-driven: colors, spacing, radius, and type come from the theme, not inline literals.
- Accessible by default: every combination meets WCAG 2.1 AA contrast (see rules.md). Never
  signal state by color alone (e.g. the "LIVE" pulse needs a text label; form errors need text).
- Consistent: the same component looks and behaves the same everywhere.
- Localized: layouts must accommodate `en` / `ta` / `kn` text lengths without breaking.
- **Light-only.** This design defines a single ivory theme; there is no dark variant. Tokens are
  still semantic so a dark theme could be remapped later, but none ships now.

## Color palette
Warm ivory surfaces with a single cobalt accent and warm-black ink. Define semantic tokens (not
raw scales) so themes can change centrally.

| Token | Value | Use |
|-------|-------|-----|
| `background` (ivory) | `#FAFAF7` | Page background |
| `ivory-2` | `#F3F2EC` | Alternating section bands |
| `surface` / paper | `#FFFFFF` | Cards, raised sections, inputs |
| `foreground` (ink) | `#16150F` | Primary text, headings |
| `ink-2` | `#3B3A33` | Body copy |
| `muted-foreground` (ink-3) | `#76746A` | Secondary/meta text |
| `border` (line) | `#E7E5DC` | Dividers, card borders |
| `line-2` | `#DDDBD0` | Stronger borders, ghost-button outline |
| `primary` (cobalt) | `#2C4BFF` | Primary actions, links, accents, focus |
| `primary-hover` (cobalt-700) | `#1E36CC` | Hover/active for primary |
| `primary-foreground` | `#FFFFFF` | Text/icons on cobalt |
| `cobalt-tint` | `#EBEEFF` | Icon chips, badges, tag backgrounds |
| `cobalt-tint-2` | `#DEE3FF` | Quote marks, soft accents |
| `success` | `#1F8A5B` | Success states (e.g. form confirmation) |
| `destructive` | `#E0533A` | Errors, invalid inputs |

- Text on any background must meet AA contrast (>= 4.5:1).
- Faculty/avatar accent colors in mock data (`#1F8A5B`, `#E8743B`, `#9B4DE0`, cobalt) are
  decorative data attributes, not new theme tokens — keep them out of the global palette.

## Typography
Two-family pairing: a display serif for headings + a geometric sans for everything else.

- **Display serif:** **DM Serif Display** (400, supports italic). Used for `h1`–`h3`, stat
  numbers, prices, and pull-quotes. Italic + cobalt is the signature "accent word" treatment
  (e.g. _to topper._).
- **Body sans:** **Plus Jakarta Sans** (400/500/600/700/800). Body, UI, eyebrows, and the
  bold "card titles" that intentionally use the sans at weight 800 instead of the serif.
- **Locale coverage:** DM Serif Display / Plus Jakarta Sans cover Latin only. Keep the tested
  Tamil/Kannada font fallback in the stack for `ta`/`kn`; serif headings fall back to the
  per-locale sans where the serif lacks glyphs.
- **Eyebrow:** 12px, weight 700, `letter-spacing .16em`, uppercase, cobalt, with a short leading
  rule (`::before`).
- **Display sizes** are fluid: hero `clamp(44px,12.5vw,72px)`, section `h2`
  `clamp(32px,8vw,46px)`, CTA `clamp(34px,8vw,56px)`. Heading line-height ~1.04–1.06,
  letter-spacing `-.01em`. Body line-height ~1.55–1.6.
- One `<h1>` per page; headings in document order. **The homepage hero is an image-only banner
  with no copy, so the single `<h1>` lives on the first content section ("Why") instead** — see
  Section rhythm. Other pages keep their `<h1>` in their hero/title.

## Spacing
4px base unit. Named scale from the mock: `1=4 / 2=8 / 3=12 / 4=16 / 5=24 / 6=32 / 7=48 /
8=64 / 9=96 / 10=128`. Section vertical padding is `--sp-9` (96px) mobile, `--sp-10` (128px)
from `md`. Content max-width `1200px` (home) / `1100px` (sub-pages); gutter 22px mobile, 40px
from `md`.

## Border radius
| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | `10px` | Small chips, icon tiles |
| `radius-md` | `16px` | **Default** — inputs, list rows, smaller cards |
| `radius-lg` | `24px` | Cards, feature/course/post cards |
| `radius-xl` | `32px` | Hero quote, CTA box |
| `radius-pill` | `999px` | Buttons, badges, exam chips, avatars |

Buttons and pills are **fully rounded** (`radius-pill`) — this is the defining shape cue.

## Elevation
Soft, warm, long shadows (not flat slate):
- `shadow-sm`: `0 1px 2px rgba(22,21,15,.05)` — subtle borders/inputs.
- `shadow`: `0 14px 40px -18px rgba(22,21,15,.22)` — cards on hover, nav.
- `shadow-lg`: `0 36px 80px -34px rgba(22,21,15,.30)` — hero banner card, modals.
- `shadow-cobalt`: `0 24px 60px -22px rgba(44,75,255,.45)` — primary buttons only.

## Buttons
Built on the shadcn-style `Button`. Pill-shaped, lift on hover.

| Variant | Look | Use |
|---------|------|-----|
| `primary` | Cobalt fill, white text, `shadow-cobalt`; hover lifts `-2px` + `cobalt-700` | Main CTA |
| `ghost` | Paper bg, `1.5px line-2` border; hover lifts, border → ink + `shadow` | Secondary actions |
| `link` | Cobalt text, animated `→` (`btn-arrow`) | Inline navigation / "Read more" |

- **Sizes:** default (`padding:14px 24px`, 15px) and `sm` (`11px 18px`, 14px). Keep effective
  tap target >= 44px for touch.
- **Arrow affordance:** the trailing `→` translates `+3px` on hover (`.btn:hover .btn-arrow`).
- **States:** default, hover, active, `focus-visible` (visible ring using cobalt), disabled
  (reduced opacity, no pointer events), loading (spinner, disabled, preserves width).
- Icon-only buttons (carousel arrows, social) need an `aria-label`.

## Forms and inputs
- Inputs: ivory fill, `1.5px line-2` border, `radius-pill` (CTA email) or `radius-md`
  (contact form), associated `<label>` (sr-only where the design hides it).
- Focus: cobalt border + paper background.
- Error: `destructive` border, a `shake` micro-animation, and a programmatically linked text
  message. Success note turns `success` green. Never rely on color alone.

## Motion
- Standard easing: `cubic-bezier(.22,.61,.36,1)` (`--ease`). Hover/press 250–300ms.
- **Scroll reveal:** elements fade/translate-up in on intersection (`.reveal` → `.in`),
  staggered by a small per-item delay.
- **Carousels (hero + testimonials):** auto-advance, with manual arrows/dots; auto-advance is
  disabled when the user prefers reduced motion. The testimonials track shows the previous/next
  quotes peeking beside the centred active one (dimmed/scaled) from `md` up; full-width below.
- **Nav:** transparent → blurred ivory with bottom border once scrolled past ~16px.
- Respect `prefers-reduced-motion`: disable animation/transition and show content statically.

## Section rhythm (homepage)
Sticky blurred nav → hero (**full-width student-outcome image banner, no copy**) → exam chip
strip → "Why" (3 stat cards; **carries the page `<h1>`**) → courses (tabbed grid, `ivory-2` band)
→ testimonials (serif quote carousel, neighbours peek) → blog (`ivory-2` band) → CTA (email
capture, paper box with cobalt glows) → multi-column footer.

> The hero uses the existing `HeroCarousel` images (not the mock's static phone mockup or the
> earlier two-column copy+visual layout). The exam chips, "Why" stats, and CTA copy come from the
> CMS (`ExamCategories` / `SiteSettings`); the hero badge/headline strings remain in i18n but are
> currently unused since the hero shows no text.
Alternate `background`/`ivory-2` bands to separate sections without heavy dividers.

## Component conventions
- Compose from shared primitives; do not fork them per page. Shared sub-page patterns (prose,
  stats, cards, people, rows, faq, contact form) come from `claude_design/project/pages/page.css`.
- A component reads only theme tokens — no inline hex/pixels.
- Decorative SVG icons are `aria-hidden`; meaningful icons get labels.

## Related docs
- [CLAUDE.md](./CLAUDE.md) · [rules.md](./rules.md) · [code_style.md](./code_style.md) ·
  [system-architecture.md](./system-architecture.md) · [project_status.md](./project_status.md)
