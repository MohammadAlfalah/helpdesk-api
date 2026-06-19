/* Reports: an SLA + volume dashboard computed client-side from the loaded
   tickets. Simple CSS bar charts — no chart library. */
function ReportsPage({ tickets = [], agents = [] }) {
  const { Card } = window.DS;
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const total = tickets.length;
  const by = (pred) => tickets.filter(pred).length;
  const open = by((t) => t.status === 'Open');
  const inprogress = by((t) => t.status === 'InProgress');
  const resolved = by((t) => t.status === 'Resolved');
  const closed = by((t) => t.status === 'Closed');
  const breached = by((t) => t.isSlaBreached);
  const escalated = by((t) => t.isEscalated);
  const compliance = total ? Math.round(((total - breached) / total) * 100) : 100;

  const C = {
    blue: '#5B7B9A', gold: '#C9921F', green: '#6E8B5B', stone: '#9B8E82',
    orange: '#C75D4A', rust: '#A8432F', terracotta: '#C75D4A',
  };

  const statusRows = [
    { label: 'Open', value: open, color: C.blue },
    { label: 'In progress', value: inprogress, color: C.gold },
    { label: 'Resolved', value: resolved, color: C.green },
    { label: 'Closed', value: closed, color: C.stone },
  ];
  const priorityRows = [
    { label: 'Urgent', value: by((t) => t.priority === 'Urgent'), color: C.rust },
    { label: 'High', value: by((t) => t.priority === 'High'), color: C.orange },
    { label: 'Medium', value: by((t) => t.priority === 'Medium'), color: C.gold },
    { label: 'Low', value: by((t) => t.priority === 'Low'), color: C.green },
  ];
  const cats = {};
  tickets.forEach((t) => { cats[t.category] = (cats[t.category] || 0) + 1; });
  const categoryRows = Object.keys(cats).sort((a, b) => cats[b] - cats[a])
    .map((k) => ({ label: k, value: cats[k], color: C.terracotta }));
  const agentRows = agents.map((a) => ({
    label: a.fullName.split(' ')[0],
    value: tickets.filter((t) => t.assignedAgent && t.assignedAgent.id === a.id && (t.status === 'Resolved' || t.status === 'Closed')).length,
    color: C.green,
  })).sort((x, y) => y.value - x.value);

  function Bar({ label, value, max, color }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 96, font: 'var(--font-small)', color: 'var(--text-body)', textAlign: 'right', flexShrink: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
        <div style={{ flex: 1, height: 10, background: 'var(--surface-sunken, #F1EAE0)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 999, transition: 'width 320ms cubic-bezier(0.22,0.61,0.36,1)' }} />
        </div>
        <div style={{ width: 28, font: 'var(--weight-semibold) var(--text-sm)/1 var(--font-mono)', color: 'var(--text-strong)', textAlign: 'right', flexShrink: 0 }}>{value}</div>
      </div>
    );
  }
  function Chart({ title, rows }) {
    const max = Math.max(1, ...rows.map((r) => r.value));
    return (
      <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ font: 'var(--font-label)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', fontSize: 11 }}>{title}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.length ? rows.map((r) => <Bar key={r.label} {...r} max={max} />)
            : <div style={{ font: 'var(--font-small)', color: 'var(--text-faint)' }}>No data.</div>}
        </div>
      </Card>
    );
  }
  function Tile({ value, label, accent, hint }) {
    return (
      <Card padding="md" style={{ flex: 1, minWidth: 150 }}>
        <div style={{ font: 'var(--weight-bold) var(--text-3xl, 28px)/1 var(--font-sans)', color: accent || 'var(--text-strong)' }}>{value}</div>
        <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
        {hint && <div style={{ font: 'var(--font-xs, 11px)', color: 'var(--text-faint)', marginTop: 2 }}>{hint}</div>}
      </Card>
    );
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <Tile value={total} label="Total tickets" />
        <Tile value={open + inprogress} label="Currently active" />
        <Tile value={resolved + closed} label="Resolved / closed" accent={C.green} />
        <Tile value={compliance + '%'} label="SLA compliance" accent={compliance >= 80 ? C.green : C.rust} hint={breached + ' breached'} />
        <Tile value={escalated} label="Escalated" accent={escalated ? C.rust : undefined} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <Chart title="Tickets by status" rows={statusRows} />
        <Chart title="Tickets by priority" rows={priorityRows} />
        <Chart title="Tickets by category" rows={categoryRows} />
        <Chart title="Resolved by agent" rows={agentRows} />
      </div>
    </div>
  );
}
Object.assign(window, { ReportsPage });
