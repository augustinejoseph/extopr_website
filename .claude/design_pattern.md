# Design Pattern — extopr-website

Visual language for the public website. Direction: **trust-blue, professional** — credible
and calm, suited to an academic platform. All values are **design tokens**; never hard-code
raw hex or pixel values in components. Expose tokens via the Tailwind theme / CSS variables
and reference them by name.

## Principles
- Token-driven: colors, spacing, radius, and type come from the theme, not inline literals.
- Accessible by default: every combination meets WCAG 2.1 AA contrast (see rules.md).
- Consistent: the same component looks and behaves the same everywhere.
- Localized: layouts must accommodate `en` / `ta` / `kn` text lengths without breaking.

## Color palette
Primary is a trust-blue/indigo. Define semantic tokens (not raw scales) so themes can change
centrally.

| Token | Light value | Use |
|-------|-------------|-----|
| `primary` | `#2563EB` (blue-600) | Primary actions, links, focus |
| `primary-hover` | `#1D4ED8` (blue-700) | Hover/active for primary |
| `primary-foreground` | `#FFFFFF` | Text/icons on primary |
| `secondary` | `#475569` (slate-600) | Secondary actions, muted accents |
| `accent` | `#0EA5E9` (sky-500) | Highlights, badges |
| `background` | `#FFFFFF` | Page background |
| `surface` | `#F8FAFC` (slate-50) | Cards, raised sections |
| `border` | `#E2E8F0` (slate-200) | Dividers, input borders |
| `foreground` | `#0F172A` (slate-900) | Primary text |
| `muted-foreground` | `#64748B` (slate-500) | Secondary text |
| `success` | `#16A34A` | Success states |
| `warning` | `#D97706` | Warnings |
| `destructive` | `#DC2626` | Errors, destructive actions |

- Provide a **dark theme** by remapping the same semantic tokens; components never branch on
  theme themselves.
- Text on any background must meet AA contrast (>= 4.5:1). Never signal state by color alone.

## Typography
- **Font:** a clean, highly legible sans-serif (e.g. Inter) for Latin; ensure the chosen
  stack includes Tamil and Kannada glyph coverage, with a tested fallback per locale.
- **Scale (rem):** `xs 0.75 / sm 0.875 / base 1 / lg 1.125 / xl 1.25 / 2xl 1.5 / 3xl 1.875 /
  4xl 2.25`.
- **Weights:** 400 body, 500 medium, 600 semibold, 700 headings.
- **Line height:** 1.5 for body, 1.2 for headings. One `<h1>` per page; headings in order.

## Spacing
- 4px base unit; use the scale `0,1,2,3,4,6,8,12,16,24` (× 4px). Never use arbitrary pixels.

## Border radius
| Token | Value | Use |
|-------|-------|-----|
| `radius-sm` | `4px` | Inputs, small chips |
| `radius-md` | `8px` | **Default** — buttons, inputs, cards |
| `radius-lg` | `12px` | Large cards, modals |
| `radius-full` | `9999px` | Pills, avatars |

Default radius is **8px** (`radius-md`).

## Elevation
- `shadow-sm` for cards, `shadow-md` for popovers/menus, `shadow-lg` for modals. Keep
  shadows subtle; rely on spacing and borders before reaching for elevation.

## Buttons
Built on shadcn/ui `Button`. Variants and consistent rules:

| Variant | Look | Use |
|---------|------|-----|
| `primary` | Filled `primary`, white text | Main call to action (one per view) |
| `secondary` | `surface` bg, `border`, `foreground` text | Secondary actions |
| `outline` | Transparent, `border`, `primary` text | Tertiary / low emphasis |
| `ghost` | Transparent, hover `surface` | Toolbar / inline actions |
| `destructive` | Filled `destructive` | Irreversible actions |
| `link` | Text only, underlined on hover | Inline navigation |

- **Sizes:** `sm` (h-8), `md`/default (h-10), `lg` (h-12). Comfortable tap targets (>= 44px
  effective for touch).
- **States:** default, hover, active, focus-visible (visible ring using `primary`),
  disabled (reduced opacity, no pointer events), loading (spinner, disabled, preserves width).
- Always pair icon-only buttons with an accessible label (`aria-label`).

## Forms and inputs
- Inputs use `radius-md`, `border`, clear focus ring, and an associated `<label>`.
- Error state: `destructive` border + a programmatically linked message. Never rely on color
  alone — include text.

## Focus and motion
- Visible `focus-visible` ring on all interactive elements (keyboard accessibility).
- Transitions 150–200ms ease for hover/press. Respect `prefers-reduced-motion`.

## Component conventions
- Compose from shadcn/ui primitives; do not fork them per page.
- A component reads only theme tokens — no inline hex/pixels. Shared variants live once and
  are reused (DRY).

## Related docs
- [CLAUDE.md](./CLAUDE.md) · [rules.md](./rules.md) · [code_style.md](./code_style.md) ·
  [system-architecture.md](./system-architecture.md)
