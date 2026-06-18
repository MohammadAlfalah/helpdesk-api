/* Ticket detail slide-over: meta, description, comment thread, reply composer. */
function TicketDetail({ ticket, comments, onClose, onReply }) {
  const { Card, StatusBadge, PriorityBadge, SlaIndicator, Avatar, Badge, Button, Textarea, Select, IconButton, Checkbox } = window.DS;
  const [draft, setDraft] = React.useState('');
  const [internal, setInternal] = React.useState(false);
  if (!ticket) return null;
  const list = comments[ticket.id] || [];

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(34,28,24,0.32)' }} />
      <aside style={{
        position: 'relative', width: 520, maxWidth: '92%', height: '100%', background: 'var(--bg)',
        boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column',
        animation: 'slideIn 220ms cubic-bezier(0.22,0.61,0.36,1)',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 22px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-faint)', marginBottom: 7 }}>#TK-{ticket.id}</div>
            <h2 style={{ font: 'var(--font-h2)', color: 'var(--text-strong)', margin: 0 }}>{ticket.title}</h2>
          </div>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <SlaIndicator dueAt={ticket.slaDueAt} breached={ticket.isSlaBreached} escalated={ticket.isEscalated} now={window.KIT_DATA.now} />
            <Badge tone="neutral">{ticket.category}</Badge>
          </div>

          <Card padding="md">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Avatar name={ticket.createdBy.fullName} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{ticket.createdBy.fullName}</div>
                <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)' }}>{ticket.createdBy.email} · {timeAgo(ticket.createdAt)}</div>
              </div>
            </div>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-body)', margin: 0 }}>{ticket.description}</p>
          </Card>

          {/* Assignment */}
          <div style={{ display: 'flex', gap: 12 }}>
            <Select label="Assignee" containerStyle={{ flex: 1 }}
              options={[{ value: '', label: 'Unassigned' }, ...window.KIT_DATA.agents.map((a) => ({ value: String(a.id), label: a.fullName }))]}
              defaultValue={ticket.assignedAgent ? String(ticket.assignedAgent.id) : ''} />
            <Select label="Status" containerStyle={{ flex: 1 }}
              options={['Open', 'InProgress', 'Resolved', 'Closed']} defaultValue={ticket.status} />
          </div>

          {/* Comments */}
          <div>
            <div style={{ font: 'var(--font-label)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', fontSize: 11, marginBottom: 12 }}>
              Activity · {list.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {list.map((c) => (
                <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                  <Avatar name={c.author.fullName} role={c.author.role} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{c.author.fullName}</span>
                      {c.isInternal && <Badge tone="warning" size="sm" icon="lock">Internal</Badge>}
                      <span style={{ font: 'var(--font-small)', color: 'var(--text-faint)' }}>{timeAgo(c.createdAt)}</span>
                    </div>
                    <div style={{
                      font: 'var(--font-body)', color: 'var(--text-body)',
                      background: c.isInternal ? 'var(--amber-100)' : 'var(--surface-card)',
                      border: `1px solid ${c.isInternal ? 'transparent' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)', padding: '10px 13px',
                    }}>{c.body}</div>
                  </div>
                </div>
              ))}
              {list.length === 0 && (
                <div style={{ font: 'var(--font-small)', color: 'var(--text-faint)', padding: '8px 0' }}>No activity yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Textarea rows={2} placeholder={internal ? 'Add an internal note (agents only)…' : 'Reply to the customer…'}
            value={draft} onChange={(e) => setDraft(e.target.value)}
            style={internal ? { background: 'var(--amber-100)', borderColor: 'transparent' } : undefined} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Checkbox label="Internal note" checked={internal} onChange={() => setInternal(!internal)} />
            <div style={{ flex: 1 }} />
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="primary" icon="send" disabled={!draft.trim()}
              onClick={() => { onReply(ticket.id, draft, internal); setDraft(''); setInternal(false); }}>
              {internal ? 'Add note' : 'Send reply'}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
Object.assign(window, { TicketDetail });
