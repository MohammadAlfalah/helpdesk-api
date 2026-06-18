# HelpDesk Design System

A warm, approachable design system for **HelpDesk** — a support ticketing product where
customers raise tickets and agents triage, assign, comment on, and resolve them, with an
SLA engine that escalates anything that breaches its due time.

> **There is no existing HelpDesk front-end.** This system is built on top of the
> **HelpDesk API** — a backend-only ASP.NET Core ticketing service — using its domain model
> (tickets, statuses, priorities, comments, SLA) as the source of truth, paired with a
> warm earthy visual direction (terracotta primary, cream surfaces, charcoal text).
> The screens here are an original, faithful interpretation of that domain, not a copy of
> a shipped UI.

## Sources

- **GitHub — API & domain model:** <https://github.com/MohammadAlfalah/helpdesk-api>
  (read `HelpDesk.Api/Models`, `HelpDesk.Api/Dtos`, and the README for the ticket/SLA model).
  Explore this repo further to design new HelpDesk surfaces accurately — every status,
  priority, SLA target and comment rule in this system is lifted from it.
- **Visual direction:** provided by the project owner — terracotta primary, soft cream
  background, dark charcoal text, rounded corners throughout, Inter typography, professional
  but approachable tone, spacious card-based layouts, subtle warm shadows.

### Domain model (from the API)

```
User (Customer | Agent)
  └─ raises ─▶ Ticket ──── assigned to ───▶ User (Agent)
                 │  title, description, category
                 │  status:   Open · InProgress · Resolved · Closed
                 │  priority: Low · Medium · High · Urgent
                 │  SLA:      slaDueAt · isSlaBreached · isEscalated
                 └─ has ─▶ Comment (public | internal agent-only note)
```

SLA resolution targets by priority: **Urgent 1h · High 4h · Medium 24h · Low 72h.**
When a ticket passes `slaDueAt` while still open it is flagged breached; a background job
escalates it and bumps its priority one level (capped at Urgent).

---

## Content fundamentals

How HelpDesk writes copy:

- **Voice:** professional but warm and plain-spoken. Calm and reassuring — this is software
  people reach for when something is broken. Never cute, never jargon-heavy.
- **Person:** address the agent as **you** ("Assigned to you", "Your open tickets"). Refer to
  customers by name ("Reported by Sam Liu"). System actions are stated plainly ("Ticket #2044
  was marked resolved").
- **Casing:** **Sentence case** everywhere — buttons, labels, headings, menu items.
  ("New ticket", not "New Ticket".) The product name is **HelpDesk** (one word, camel-cased D).
- **Status & priority** are Title-case domain nouns shown as pills: *Open, In progress,
  Resolved, Closed* / *Low, Medium, High, Urgent*. Note the display label "In progress" for the
  `InProgress` enum.
- **Ticket references** use a mono `#TK-####` form (e.g. `#TK-2048`).
- **Buttons** are short verb phrases: *New ticket, Assign, Resolve, Send reply, Add note*.
- **Tone in SLA/escalation language** is factual, not alarmist: "Due in 2h", "Breached 2h ago",
  "Escalated" — short, scannable, never exclamatory.
- **No emoji.** Meaning is carried by Lucide icons and the status/priority color system.
- **Empty & helpful:** prefer specific, low-drama microcopy ("No activity yet.",
  "Unassigned") over generic filler.

---

## Visual foundations

**Palette — warm & earthy.** Terracotta (`--terracotta-500` `#C75D4A`) is the single brand
color: primary buttons, active nav, focus rings, links, the logo mark. Surfaces are a soft
cream (`--bg` `#FAF6F0`) with pure-white cards floating on top. Text is a warm near-black
charcoal (`#221C18`) softening to taupe for secondary copy. Status and feedback hues are
deliberately **muted and earthy** rather than saturated: dusty blue (Open), gold/amber
(In progress, Medium), sage green (Resolved, Low), warm stone (Closed), burnt orange (High),
and rust (Urgent / breached / danger). Every status & priority has a paired tint + readable
foreground token (`--status-*`, `--prio-*`).

**Typography.** Inter for everything UI, JetBrains Mono for ticket IDs, SLA timers and emails.
A role-based scale exposed both as raw tokens (`--text-xs … --text-4xl`, `--weight-*`) and as
composite `font:` shorthands (`--font-h1/h2/h3/body/label/small`). Display headings use a
slightly tight tracking (`-0.02em`); body runs at a comfortable 1.55 line-height.

**Spacing & layout.** 4px base scale (`--space-1 … --space-20`). Generous, card-based layouts —
content breathes. Standard rail width `--sidebar-width` (256px), content max `--content-max`.
Lists are rows of interactive cards, not dense table grids.

**Corners.** Rounded throughout. Inputs & buttons `--radius-md` (10px), cards `--radius-lg`
(14px), pills/avatars `--radius-full`. Nothing is sharp-cornered.

**Elevation — soft & warm.** Shadows are brown-tinted (`rgba(74,52,33,…)`), never gray/black,
at low opacity. Five steps `--shadow-xs … --shadow-xl` plus `--shadow-focus` (terracotta ring)
and `--shadow-inset`. Cards default to `--shadow-sm`; hovering an interactive card lifts it to
`--shadow-md` with a 1px translate.

**Borders.** Hairline `--border-subtle` (cream) for dividers inside white; `--border-default`
(sand) for input outlines; `--border-strong` (taupe) for emphasis. 1px throughout.

**Motion.** Quiet and quick. `--duration-fast` (120ms) for hovers/colors, `--duration-normal`
(200ms) for elevation, `--ease-out` for most things. The detail panel slides in over 220ms; the
switch knob uses a gentle overshoot. No bounces on content, no infinite/decorative loops, fades
and short translates only. Respect `prefers-reduced-motion`.

**Interaction states.** Hover = darker brand (`--brand-hover`) or a cream wash on ghost
elements; active/press = darkest brand (`--brand-active`). Focus = the terracotta ring
(`--ring` / `--shadow-focus`). Disabled = ~45–50% opacity, no pointer.

**Imagery.** The product is data, not photography — there are no hero photos or illustrations.
Identity is carried by avatars (deterministic warm initials, terracotta presence dot for agents),
the status/priority color system, and Lucide icons. No gradients, no glassmorphism, no blur
washes, no textures.

---

## Iconography

- **Lucide** (<https://lucide.dev>) is the icon set, loaded from CDN
  (`unpkg.com/lucide`). Outline style, **1.75px stroke, rounded line caps** — it matches the
  clean, approachable tone. Sized **16–20px** inline in the UI (18px is the default).
- Icons are tinted with `currentColor` — usually `--text-muted` in neutral chrome, `--brand`
  when active, or a status foreground inside a colored chip.
- In **React components**, pass a Lucide **name** (e.g. `<Button icon="plus">`); the host page
  must run `lucide.createIcons()` after render. Components that render `<i data-lucide>` rely on
  this. The UI kit uses a small `Icon` helper (`ui_kits/agent-console/util.jsx`) that re-runs
  `createIcons` on each render.
- **No emoji**, no unicode-glyph icons (the priority "signal bars" in `PriorityBadge` are drawn
  with styled spans, not glyphs).
- Common icons in-product: `ticket, inbox, alert-triangle, clock, message-square, user-round,
  check-circle-2, search, filter, settings, send, lock, plus, more-horizontal`.

> **Substitution flags (please confirm):**
> - **Fonts** — the API repo ships no font binaries, so **Inter** and **JetBrains Mono** are
>   loaded from Google Fonts (`tokens/fonts.css`). If you have licensed/self-hosted copies,
>   drop them in and swap the `@font-face`/import.
> - **Icons** — there was no icon set in the repo either; **Lucide** is a substitution chosen to
>   fit the clean, rounded, approachable direction. Happy to switch to your preferred set.

---

## What's in here (manifest)

**Root**
- `styles.css` — the global entry point (consumers link this one file). `@import`s only.
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter so this system can be used from Claude Code.

**`tokens/`** — CSS custom properties, each `@import`ed from `styles.css`:
`fonts.css` (webfonts) · `colors.css` (ramps + semantic + status/priority) · `typography.css`
(scale + composite fonts) · `spacing.css` · `effects.css` (radii, shadows, motion) · `base.css`
(light resets).

**`components/`** — reusable React primitives (`window.HelpDeskDesignSystem_35c226.*`):
- `forms/` — **Button, IconButton, Input, Textarea, Select, Checkbox, Switch**
- `feedback/` — **Badge, Avatar, Toast**
- `layout/` — **Card**
- `navigation/` — **Tabs**
- `helpdesk/` — domain components: **StatusBadge, PriorityBadge, SlaIndicator**

**`ui_kits/agent-console/`** — an interactive, click-through recreation of the agent console:
sidebar, top bar, ticket inbox (stat tiles + filters + rows), a ticket detail slide-over with
the comment thread + reply composer, and a new-ticket modal. Open `index.html`.

**`guidelines/`** — foundation specimen cards (Type, Colors, Spacing, Brand) shown in the
Design System tab.

**`assets/`** — `logo-full.svg`, `logo-mark.svg`.

---

## Using the components

```jsx
const { Button, StatusBadge, PriorityBadge, SlaIndicator, Card, Avatar } =
  window.HelpDeskDesignSystem_35c226;

<Card interactive onClick={open}>
  <StatusBadge status="Open" />
  <PriorityBadge priority="High" />
  <SlaIndicator dueAt={ticket.slaDueAt} breached={ticket.isSlaBreached} />
</Card>
```

Each component has a sibling `.prompt.md` with a one-line "what & when" plus a usage snippet,
and a `.d.ts` with its full props contract.
