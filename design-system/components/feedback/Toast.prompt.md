Toast / inline notification — confirmations, SLA escalation alerts, errors.

```jsx
<Toast kind="success" title="Ticket resolved" onDismiss={() => {}}>
  Ticket #1042 was marked resolved.
</Toast>
<Toast kind="danger" title="SLA breached">Ticket #1009 is past its due time.</Toast>
```

Kinds: `info` / `success` / `warning` / `danger`.
