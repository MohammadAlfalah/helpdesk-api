/* Ticket inbox: filter chips, stat tiles, and the ticket list. */
function StatTile({ icon, label, value, tone }) {
  const { Card } = window.DS;
  return (
    <Card padding="sm" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{
        width: 38, height: 38, borderRadius: 'var(--radius-md)', flexShrink: 0,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: tone.bg, color: tone.fg,
      }}>
        <Icon name={icon} size={19} color={tone.fg} />
      </span>
      <div>
        <div style={{ font: 'var(--weight-bold) var(--text-xl)/1 var(--font-sans)', color: 'var(--text-strong)' }}>{value}</div>
        <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
      </div>
    </Card>
  );
}

function TicketRow({ t, onOpen }) {
  const { Card, StatusBadge, PriorityBadge, SlaIndicator, Avatar, Badge } = window.DS;
  const by = t.createdBy || { fullName: 'Unknown' };
  return (
    <Card interactive padding="none" onClick={() => onOpen(t)} style={{ padding: '14px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-faint)' }}>#TK-{t.id}</span>
            <span style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: 'var(--font-small)', color: 'var(--text-muted)' }}>
            <Avatar name={by.fullName} size="xs" />
            <span>{by.fullName}</span>
            <span>·</span>
            <Badge tone="neutral" size="sm">{t.category}</Badge>
            <span>·</span>
            <span>{timeAgo(t.createdAt)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <SlaIndicator dueAt={t.slaDueAt} breached={t.isSlaBreached} escalated={t.isEscalated} now={Date.now()} size="sm" />
          <PriorityBadge priority={t.priority} size="sm" />
          <StatusBadge status={t.status} size="sm" />
          <div style={{ width: 34, display: 'flex', justifyContent: 'flex-end' }}>
            {t.assignedAgent
              ? <Avatar name={t.assignedAgent.fullName} role="Agent" size="sm" />
              : <span title="Unassigned" style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px dashed var(--border-strong)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="user-plus" size={15} color="var(--text-faint)" /></span>}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TicketInbox({ tickets, counts, onOpen, sort, onSort, mineOnly, onMineOnly, canMine, searching, query }) {
  const { Select } = window.DS;
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Open', 'In progress', 'Escalated', 'Resolved'];
  const shown = tickets.filter((t) => {
    if (filter === 'All') return true;
    if (filter === 'Open') return t.status === 'Open';
    if (filter === 'In progress') return t.status === 'InProgress';
    if (filter === 'Escalated') return t.isEscalated;
    if (filter === 'Resolved') return t.status === 'Resolved' || t.status === 'Closed';
    return true;
  });

  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 22, overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <div className="stat-row" style={{ display: 'flex', gap: 14 }}>
        <StatTile icon="inbox" label="Open tickets" value={counts.open} tone={{ bg: 'var(--terracotta-50)', fg: 'var(--terracotta-600)' }} />
        <StatTile icon="loader" label="In progress" value={counts.inprogress} tone={{ bg: 'var(--blue-100)', fg: 'var(--blue-600)' }} />
        <StatTile icon="alert-triangle" label="Escalated" value={counts.escalated} tone={{ bg: 'var(--red-100)', fg: 'var(--red-500)' }} />
        <StatTile icon="check-circle-2" label="Resolved" value={counts.resolved} tone={{ bg: 'var(--green-100)', fg: 'var(--green-600)' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {filters.map((f) => {
          const on = filter === f;
          return (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
              border: `1px solid ${on ? 'transparent' : 'var(--border)'}`,
              background: on ? 'var(--charcoal-900)' : 'var(--surface-card)',
              color: on ? 'var(--cream-50)' : 'var(--text-body)',
              font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
              transition: 'all 120ms ease',
            }}>{f}</button>
          );
        })}
        <div style={{ flex: 1 }} />
        {canMine && (
          <button onClick={onMineOnly} title="Show only tickets assigned to me" style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, padding: '7px 13px', borderRadius: 'var(--radius-full)', cursor: 'pointer',
            border: `1px solid ${mineOnly ? 'transparent' : 'var(--border)'}`,
            background: mineOnly ? 'var(--brand-soft)' : 'var(--surface-card)',
            color: mineOnly ? 'var(--brand-soft-fg)' : 'var(--text-body)',
            font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)', transition: 'all 120ms ease',
          }}>
            <Icon name="user-round" size={15} color={mineOnly ? 'var(--brand)' : 'var(--text-muted)'} /> Assigned to me
          </button>
        )}
        {onSort && (
          <Select size="sm" containerStyle={{ width: 150 }} value={sort} onChange={(e) => onSort(e.target.value)}
            options={[{ value: 'newest', label: 'Sort: Newest' }, { value: 'oldest', label: 'Sort: Oldest' }, { value: 'sla', label: 'Sort: SLA due' }, { value: 'priority', label: 'Sort: Priority' }]} />
        )}
      </div>

      {shown.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shown.map((t) => <TicketRow key={t.id} t={t} onOpen={onOpen} />)}
        </div>
      ) : (
        <EmptyState icon={searching ? 'search-x' : 'inbox'}
          title={searching ? 'No tickets match your search' : 'Nothing here'}
          subtitle={searching ? (query ? `No results for “${query}”.` : 'Try a different search or filter.') : 'No tickets in this view yet.'} />
      )}
    </div>
  );
}
Object.assign(window, { TicketInbox, TicketRow });
