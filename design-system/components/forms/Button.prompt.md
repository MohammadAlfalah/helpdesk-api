Primary action button — use for the single most important action in a view; pair with `secondary`/`ghost` for supporting actions.

```jsx
<Button variant="primary" icon="plus">New ticket</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="danger" icon="trash-2">Delete</Button>
```

Variants: `primary` (terracotta), `secondary` (outlined), `ghost` (text-only), `danger` (rust), `soft` (tinted terracotta). Sizes: `sm` / `md` / `lg`. Pass `icon` / `iconRight` as Lucide names; the host must call `lucide.createIcons()` after render.
