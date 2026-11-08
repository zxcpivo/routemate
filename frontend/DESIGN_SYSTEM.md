# Routemate design system

_Version 0.2 · 2026-11-07 · for the clickable prototype_

Routemate helps people with fixed start times get there on time with someone they know. The interface should feel **trustworthy, calm and punctual**: plain language, clear times, no surprises.

Tokens live in [`src/styles/tokens.css`](src/styles/tokens.css). Components live in [`src/components/`](src/components/) and their styles in [`src/styles/components.css`](src/styles/components.css). Don't hard-code colours, sizes or shadows in screens; use a token or a component.

## Principles

1. **Time first.** Times are the most important content. Show them large, in tabular figures, and always say "by" or "at".
2. **Say who.** Show a name, initials and a one-line description wherever a person appears. Trust comes from knowing who is picking you up.
3. **Private by default.** Show an approximate area until both people accept. Exact meeting points appear only after that.
4. **Honest demo.** Every screen with people or trips shows the prototype banner: the people and trips are made up.
5. **Mobile first.** Built for a 375px phone and centred at a max width of 560px on larger screens. Touch targets are at least 44px.

## Tokens

### Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | `#f6f8f7` | `#0c1412` | Page background |
| `--color-surface` | `#ffffff` | `#131e1b` | Cards, inputs, header |
| `--color-surface-sunken` | `#eef2f1` | `#0f1816` | Grouped areas, segmented track |
| `--color-border` | `#dbe3e1` | `#26332f` | Card and input borders |
| `--color-text` | `#13201d` | `#e7efec` | Body text |
| `--color-text-muted` | `#55635f` | `#9aaba6` | Secondary text, hints |
| `--color-primary` | `#0f766e` | `#2dd4bf` | Brand ("Route teal"), primary actions, selected state |
| `--color-primary-hover` | `#115e59` | `#5eead4` | Primary hover |
| `--color-primary-soft` | `#e0f5f1` | `#12332e` | Selected chip, soft highlight |
| `--color-on-primary` | `#ffffff` | `#04211d` | Text on primary |
| `--color-accent` | `#f59e0b` | `#fbbf24` | Pickup pin, "you" marker. Decoration only, never text on white |
| `--color-success` / `-soft` | `#15803d` / `#e3f4e8` | `#4ade80` / `#123020` | On time, checked in |
| `--color-warning` / `-soft` | `#b45309` / `#fdf0dc` | `#fbbf24` / `#352a10` | Tight timing, driver away |
| `--color-danger` / `-soft` | `#b91c1c` / `#fbe5e5` | `#f87171` / `#3a1717` | Rule failed, destructive |
| `--color-info` / `-soft` | `#1d4ed8` / `#e4ecfb` | `#93b4fb` / `#16223f` | Prototype banner, tips |

All text pairs meet WCAG AA (4.5:1) against their background. Status colours always appear with an icon or label, never colour alone.

### Typography

Font: **Inter** (Google Fonts) with the system UI stack as fallback. Times and money use `font-variant-numeric: tabular-nums`.

The [Routemate logo](../assets/brand/routemate-logo.svg) pairs a smiling car on a mint tile with a Manrope ExtraBold wordmark. `Brand` inlines the SVG so `--color-brand-ink` colours the lettering in both themes.

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `--text-xs` | 12 / 16 | 500 | Badges, captions |
| `--text-sm` | 14 / 20 | 400–500 | Hints, secondary lines |
| `--text-md` | 16 / 24 | 400 | Body, inputs |
| `--text-lg` | 18 / 26 | 600 | Card titles |
| `--text-xl` | 22 / 28 | 700 | Screen titles |
| `--text-2xl` | 28 / 34 | 700 | Key times on ride card |
| `--text-3xl` | 36 / 42 | 800 | Landing headline |

### Spacing, radius, elevation, motion

- **Spacing** (4px base): `--space-1` 4 · `--space-2` 8 · `--space-3` 12 · `--space-4` 16 · `--space-5` 20 · `--space-6` 24 · `--space-8` 32 · `--space-10` 40 · `--space-12` 48. Screen gutter is `--space-4`.
- **Radius:** `--radius-sm` 8 (chips, inputs) · `--radius-md` 12 (buttons) · `--radius-lg` 16 (cards) · `--radius-pill` 999.
- **Elevation:** `--shadow-1` resting card · `--shadow-2` raised or hovered card · `--shadow-3` sticky bottom bar.
- **Motion:** `--duration-fast` 120ms (hover, press) · `--duration-base` 200ms (expand, fade) · `--ease-out` `cubic-bezier(.2,.8,.2,1)`. Respect `prefers-reduced-motion`.
- **Focus:** 3px `--color-primary` ring with a 2px offset on every interactive element (`:focus-visible`).

## Components

| Component | Variants / props | States | Accessibility |
|---|---|---|---|
| **AppHeader** | Logo, nav links, role badge | Active link | `<header>`, `<nav aria-label="Main">`, `aria-current="page"` |
| **PrototypeBanner** | — | — | `role="note"` |
| **Button** | `primary` · `secondary` · `ghost` · `danger`; `sm` · `md` · `lg`; `block`; `loading` | hover, active, disabled, loading (spinner, label kept) | Native `<button>`; `aria-busy` while loading |
| **SegmentedControl** | Options list | selected, focus | `role="radiogroup"`, each option `role="radio"`, arrow keys move selection |
| **Field** | label, hint, error | error (border + message) | Label tied with `htmlFor`; hint and error via `aria-describedby` |
| **Select / TimeInput** | Native controls styled to match | disabled, error | Native semantics |
| **DayChips** | Days, selected | selected, focus | `role="group"` + toggle buttons with `aria-pressed` |
| **Stepper** | min, max, step, format; `editable` + `unit` to type a value | at min / max disables − / + | Buttons labelled "Decrease …" / "Increase …"; value in `aria-live="polite"` |
| **Avatar** | initials, tone | — | `aria-hidden`, name always shown as text next to it |
| **Badge** | `neutral` · `success` · `warning` · `danger` · `info` | — | Text label always present |
| **Stat** | label, value, tone | — | Rendered as `<dl>` pair |
| **MatchCard** | person, area, stats, shared days, failure reasons | default, hover (link), near miss (muted + reasons) | Whole card is one link; reasons listed as text |
| **WeekStrip** | days, shared days, today, away day | shared, today, away, checked in | List of days with text labels for each state |
| **CheckInButton** | — | ready, done | Changes to a success message with time; announced via `aria-live` |
| **EmptyState** | icon, title, body, actions | — | Heading level fits the page |

### Guided demo components

Styles in [`src/styles/demo.css`](src/styles/demo.css), code in [`src/demo/`](src/demo/).

| Component | Variants / props | States | Accessibility |
|---|---|---|---|
| **ThemeSwitch** | — | shows the mode it switches to (Dark mode / Light mode) | Native button; choice saved as `routemate-theme` |
| **PhoneFrame + PresenterPanel** | Frame and side panel from 900px up; full screen below | Current / done step in the panel | Panel is an `<aside>`; current step has `aria-current="step"` |
| **StepLayout** | title, lede, primary CTA, secondary action | CTA disabled, loading | Each step is a `<form>`, so Enter continues; heading gets focus on each new step |
| **ProgressBar** | step / total | — | `role="progressbar"` with "Step n of 7: name" |
| **Tile** | `radio` · `checkbox`; `sm` · `md` · `lg` | selected (primary border + soft fill + check), disabled, focus | Native radio / checkbox inside a `<label>` |
| **Pitch** | big number, label above and below | — | Plain text; the number is never the only label |
| **LiveSummary** | detour + savings | over limit (warning tone, CTA blocked, “Raise my limit to … min” button) | `aria-live="polite"` |
| **PlaceSearch** | label or `labelledBy`, places, icon | open list, active option, no results | ARIA combobox: arrow keys move, Enter picks without submitting the step, Escape closes |
| **TripMap** | start, destination, move handlers | dragging (dashed straight line), road route | Region with a label; pins are focusable and the search boxes are the keyboard alternative to dragging. Uses OpenStreetMap tiles (inverted in dark mode) |
| **RouteMap** | stops | — | `role="img"` with every stop and time in the label; drawn in SVG, no map tiles or network |
| **Timeline** | stops with times | start, pickup (accent), end (filled) | Ordered list |

**Demo rules:** one question per screen (Starting point & Destination pairs two closely linked ones), always a sensible answer filled in, one primary button at the bottom, and a visible "made up / simulated" note wherever people or accounts appear.

### Do and don't

| Do | Don't |
|---|---|
| "Pickup at 7:58 · arrive by 8:45" | "ETA ~8:45ish" |
| Show the approximate area before a match is accepted | Show an exact address or meeting point before both accept |
| Explain why someone isn't a match ("Detour is 17 min, over their 10 min limit") | Hide near misses or say only "No results" |
| Label demo data as made up | Show simulated interview numbers as real |

## Open questions

- Whether to show the contribution comparison (TTC fare, Uber) on the match screen depends on the service-fee decision in `approach.md`.
