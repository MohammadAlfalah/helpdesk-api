One-liner: the canonical pill for a ticket's priority, with a signal-strength bar glyph — use everywhere priority appears so the Low→Urgent ramp reads consistently.

```jsx
<PriorityBadge priority="Urgent" />
<PriorityBadge priority="High" />
<PriorityBadge priority="Low" size="sm" />
```

Priority values match the API enum: `Low`, `Medium`, `High`, `Urgent`. Bars fill 1→4.
