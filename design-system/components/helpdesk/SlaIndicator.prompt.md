One-liner: shows a ticket's SLA health as a colored countdown pill — green within SLA, amber when under an hour, red when breached or escalated. Mirrors the API's `slaDueAt` / `isSlaBreached` / `isEscalated`.

```jsx
<SlaIndicator dueAt="2026-06-18T14:00:00Z" />
<SlaIndicator dueAt={pastDate} breached />
<SlaIndicator escalated />
```

Props: `dueAt`, `breached`, `escalated`, `now` (countdown reference), `size`.
