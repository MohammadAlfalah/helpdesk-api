/* Agents page: the support team with each agent's live workload, derived from
   the loaded tickets. */
function AgentsPage({ agents = [], tickets = [], onOpenAgent }) {
  const { Card, Avatar, Badge } = window.DS;
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  function statsFor(agentId) {
    const mine = tickets.filter((t) => t.assignedAgent && t.assignedAgent.id === agentId);
    return {
      open: mine.filter((t) => t.status === 'Open' || t.status === 'InProgress').length,
      resolved: mine.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
      total: mine.length,
    };
  }
  const unassigned = tickets.filter((t) => !t.assignedAgent && (t.status === 'Open' || t.status === 'InProgress')).length;

  function Stat({ value, label, tone }) {
    return (
      <div style={{ flex: 1, textAlign: 'center' }}>
        <div style={{ font: 'var(--weight-bold) var(--text-xl)/1 var(--font-sans)', color: tone || 'var(--text-strong)' }}>{value}</div>
        <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', marginTop: 3 }}>{label}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 28, overflow: 'auto', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {unassigned > 0 && (
        <Card padding="md" style={{ display: 'flex', alignItems: 'center', gap: 12, borderLeft: '3px solid var(--terracotta-500, #C75D4A)' }}>
          <span style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--terracotta-50)', color: 'var(--terracotta-600)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="user-plus" size={19} color="var(--terracotta-600)" />
          </span>
          <div>
            <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{unassigned} unassigned open {unassigned === 1 ? 'ticket' : 'tickets'}</div>
            <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)' }}>Assign these to balance the team's load.</div>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {agents.map((a) => {
          const s = statsFor(a.id);
          return (
            <Card key={a.id} interactive={!!onOpenAgent} padding="md" onClick={onOpenAgent ? () => onOpenAgent(a) : undefined}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <Avatar name={a.fullName} role="Agent" size="md" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.fullName}</div>
                  <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', borderTop: '1px solid var(--border-subtle)', paddingTop: 12 }}>
                <Stat value={s.open} label="Open" tone={s.open ? 'var(--terracotta-600)' : undefined} />
                <Stat value={s.resolved} label="Resolved" />
                <Stat value={s.total} label="Total" />
              </div>
            </Card>
          );
        })}
        {agents.length === 0 && (
          <div style={{ font: 'var(--font-small)', color: 'var(--text-faint)' }}>No agents found.</div>
        )}
      </div>
    </div>
  );
}
Object.assign(window, { AgentsPage });
