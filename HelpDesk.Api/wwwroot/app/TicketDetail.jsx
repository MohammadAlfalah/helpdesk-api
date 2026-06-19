/* Ticket detail slide-over: meta, description, comment thread, reply composer.
   Role-aware: agents (canManage) get assignment/status/priority/category controls,
   quick actions, and delete; customers get a clean read-only view + public reply. */
const TICKET_CATEGORIES = ['Network', 'Hardware', 'Account', 'Billing', 'General'];

function TicketDetail({ ticket, comments, agents = [], canManage = true,
  onClose, onReply, onAssign, onStatus, onPriority, onCategory, onDelete }) {
  const { Card, StatusBadge, PriorityBadge, SlaIndicator, Avatar, Badge, Button, Textarea, Select, IconButton, Checkbox } = window.DS;
  const [draft, setDraft] = React.useState('');
  const [internal, setInternal] = React.useState(false);
  const dialogRef = window.useDialog(onClose);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  if (!ticket) return null;
  const list = comments[ticket.id] || [];
  const closed = ticket.status === 'Resolved' || ticket.status === 'Closed';
  const creator = ticket.createdBy || { fullName: 'Unknown', email: '' };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="td-title" tabIndex={-1}
      style={{ position: 'absolute', inset: 0, zIndex: 30, display: 'flex', justifyContent: 'flex-end', outline: 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(34,28,24,0.32)' }} />
      <aside style={{
        position: 'relative', width: 540, maxWidth: '94%', height: '100%', background: 'var(--bg)',
        boxShadow: 'var(--shadow-xl)', display: 'flex', flexDirection: 'column',
        animation: 'slideIn 220ms cubic-bezier(0.22,0.61,0.36,1)',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }`}</style>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '20px 22px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-faint)', marginBottom: 7 }}>#TK-{ticket.id}</div>
            <h2 id="td-title" style={{ font: 'var(--font-h2)', color: 'var(--text-strong)', margin: 0 }}>{ticket.title}</h2>
          </div>
          <IconButton icon="x" label="Close" onClick={onClose} />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <SlaIndicator dueAt={ticket.slaDueAt} breached={ticket.isSlaBreached} escalated={ticket.isEscalated} now={Date.now()} />
            <Badge tone="neutral">{ticket.category}</Badge>
          </div>

          <Card padding="md">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Avatar name={creator.fullName} size="sm" />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{creator.fullName}</div>
                <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)' }}>{creator.email ? creator.email + ' · ' : ''}{timeAgo(ticket.createdAt)}</div>
              </div>
            </div>
            <p style={{ font: 'var(--font-body)', color: 'var(--text-body)', margin: 0, whiteSpace: 'pre-wrap' }}>{ticket.description}</p>
          </Card>

          {/* ---- Agent management controls ---- */}
          {canManage && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <Select label="Assignee" containerStyle={{ flex: 1 }}
                  options={[{ value: '', label: 'Unassigned' }, ...agents.map((a) => ({ value: String(a.id), label: a.fullName }))]}
                  defaultValue={ticket.assignedAgent ? String(ticket.assignedAgent.id) : ''}
                  onChange={(e) => onAssign && onAssign(ticket.id, e.target.value)} />
                <Select label="Status" containerStyle={{ flex: 1 }}
                  options={['Open', 'InProgress', 'Resolved', 'Closed']} defaultValue={ticket.status}
                  onChange={(e) => onStatus && onStatus(ticket.id, e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Select label="Priority" containerStyle={{ flex: 1 }}
                  options={['Low', 'Medium', 'High', 'Urgent']} defaultValue={ticket.priority}
                  onChange={(e) => onPriority && onPriority(ticket.id, e.target.value)} />
                <Select label="Category" containerStyle={{ flex: 1 }}
                  options={TICKET_CATEGORIES} defaultValue={ticket.category}
                  onChange={(e) => onCategory && onCategory(ticket.id, e.target.value)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {!closed ? (
                  <>
                    <Button size="sm" variant="soft" icon="check-circle-2" onClick={() => onStatus && onStatus(ticket.id, 'Resolved')}>Mark resolved</Button>
                    <Button size="sm" variant="secondary" icon="archive" onClick={() => onStatus && onStatus(ticket.id, 'Closed')}>Close</Button>
                  </>
                ) : (
                  <Button size="sm" variant="secondary" icon="rotate-ccw" onClick={() => onStatus && onStatus(ticket.id, 'InProgress')}>Reopen</Button>
                )}
                <div style={{ flex: 1 }} />
                <Button size="sm" variant="ghost" icon="trash-2"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => { if (window.confirm('Delete ticket #TK-' + ticket.id + '? This cannot be undone.')) onDelete && onDelete(ticket.id); }}>
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* ---- Conversation ---- */}
          <div>
            <div style={{ font: 'var(--font-label)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-caps)', fontSize: 11, marginBottom: 12 }}>
              {canManage ? 'Activity' : 'Conversation'} · {list.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {list.map((c) => {
                const a = c.author || { fullName: 'Unknown', role: 'Customer' };
                return (
                <div key={c.id} style={{ display: 'flex', gap: 10 }}>
                  <Avatar name={a.fullName} role={a.role} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{a.fullName}</span>
                      {a.role === 'Agent' && <Badge tone="info" size="sm">Agent</Badge>}
                      {c.isInternal && <Badge tone="warning" size="sm" icon="lock">Internal</Badge>}
                      <span style={{ font: 'var(--font-small)', color: 'var(--text-faint)' }}>{timeAgo(c.createdAt)}</span>
                    </div>
                    <div style={{
                      font: 'var(--font-body)', color: 'var(--text-body)', whiteSpace: 'pre-wrap',
                      background: c.isInternal ? 'var(--amber-100)' : 'var(--surface-card)',
                      border: `1px solid ${c.isInternal ? 'transparent' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-md)', padding: '10px 13px',
                    }}>{c.body}</div>
                  </div>
                </div>
                );
              })}
              {list.length === 0 && (
                <div style={{ font: 'var(--font-small)', color: 'var(--text-faint)', padding: '8px 0' }}>No activity yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Composer */}
        <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)', background: 'var(--surface-card)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Textarea rows={2}
            placeholder={internal ? 'Add an internal note (agents only)…' : (canManage ? 'Reply to the customer…' : 'Add a reply…')}
            value={draft} onChange={(e) => setDraft(e.target.value)}
            style={internal ? { background: 'var(--amber-100)', border: '1px solid transparent' } : undefined} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {canManage && (
              // Custom toggle (not the DS Checkbox): its checkmark is an inline <svg>
              // React owns, so lucide.createIcons() never swaps the node out from under
              // React — toggling off no longer crashes the render.
              <span role="checkbox" tabIndex={0} aria-checked={internal} aria-label="Internal note"
                onClick={() => setInternal((v) => !v)}
                onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setInternal((v) => !v); } }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 9, cursor: 'pointer', userSelect: 'none', fontSize: 'var(--text-base)', color: 'var(--text-body)', outline: 'none' }}>
                <span style={{
                  width: 19, height: 19, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 'var(--radius-xs, 5px)', transition: 'background 120ms ease, border-color 120ms ease',
                  background: internal ? 'var(--brand)' : 'var(--surface-card)',
                  border: `1px solid ${internal ? 'var(--brand)' : 'var(--border-strong)'}`,
                }}>
                  {internal && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </span>
                Internal note
              </span>
            )}
            <div style={{ flex: 1 }} />
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="primary" icon="send" disabled={!draft.trim()}
              onClick={() => { onReply(ticket.id, draft, internal); setDraft(''); setInternal(false); }}>
              {internal ? 'Add note' : (canManage ? 'Send reply' : 'Send')}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
Object.assign(window, { TicketDetail, TICKET_CATEGORIES });
