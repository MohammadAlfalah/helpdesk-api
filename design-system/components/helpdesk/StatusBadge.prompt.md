One-liner: the canonical pill for a ticket's lifecycle status — always use this (not Badge) so status colors stay consistent across the product.

```jsx
<StatusBadge status="Open" />
<StatusBadge status="InProgress" />
<StatusBadge status="Resolved" />
<StatusBadge status="Closed" size="sm" />
```

Status values match the API enum: `Open`, `InProgress`, `Resolved`, `Closed`.
