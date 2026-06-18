---
name: helpdesk-design
description: Use this skill to generate well-branded interfaces and assets for HelpDesk (a support ticketing product — tickets, agents/customers, SLA escalation, comments), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Key facts:
- **Brand**: HelpDesk — a support ticketing tool. Warm, earthy, approachable. Terracotta primary (#C75D4A), soft cream surfaces (#FAF6F0), charcoal text (#221C18). Inter + JetBrains Mono. Rounded corners, soft warm shadows, card-based layouts. No emoji.
- **Tokens**: `styles.css` is the single entry point — link it and use the CSS custom properties (`--brand`, `--surface-card`, `--text-strong`, `--status-*`, `--prio-*`, `--radius-lg`, `--shadow-sm`, `--font-h2`, …). Never hard-code hex.
- **Components**: React primitives on `window.HelpDeskDesignSystem_35c226` — Button, IconButton, Input, Textarea, Select, Checkbox, Switch, Badge, Avatar, Toast, Card, Tabs, and the domain components StatusBadge / PriorityBadge / SlaIndicator. Each has a `.prompt.md` and `.d.ts`.
- **Domain**: tickets have status (Open/InProgress/Resolved/Closed), priority (Low/Medium/High/Urgent), category, an SLA due time (Urgent 1h · High 4h · Medium 24h · Low 72h) that escalates on breach, and comments (public or internal agent-only notes). Source of truth: the HelpDesk API — https://github.com/MohammadAlfalah/helpdesk-api
- **Icons**: Lucide, loaded from CDN, 1.75px stroke, ~18px. Pass a Lucide name to component `icon` props and call `lucide.createIcons()` after render.
- **UI kit**: `ui_kits/agent-console/index.html` is a working interactive recreation of the agent console — read it for layout patterns (sidebar, inbox rows, detail slide-over, composer).
