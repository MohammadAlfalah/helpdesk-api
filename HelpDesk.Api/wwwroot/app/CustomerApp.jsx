/* Customer portal: a focused, friendly view where a customer raises tickets and
   tracks their own — they never see internal notes, other customers' tickets, or
   agent controls (all enforced by the API too). */
function CustomerTicketCard({ t, onOpen }) {
  const { Card, StatusBadge, PriorityBadge, SlaIndicator, Badge } = window.DS;
  return (
    <Card interactive padding="none" onClick={() => onOpen(t)} style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
            <span style={{ font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)', color: 'var(--text-faint)' }}>#TK-{t.id}</span>
            <span style={{ font: 'var(--font-h3)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: 'var(--font-small)', color: 'var(--text-muted)' }}>
            <Badge tone="neutral" size="sm">{t.category}</Badge>
            <span>·</span>
            <span>Updated {timeAgo(t.updatedAt)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <SlaIndicator dueAt={t.slaDueAt} breached={t.isSlaBreached} escalated={t.isEscalated} now={Date.now()} size="sm" />
          <PriorityBadge priority={t.priority} size="sm" />
          <StatusBadge status={t.status} size="sm" />
        </div>
      </div>
    </Card>
  );
}

function CustomerApp({ user, onLogout }) {
  const api = window.HelpDeskApi;
  const { Button, Avatar } = window.DS;
  const [booting, setBooting] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);
  const [tickets, setTickets] = React.useState([]);
  const [commentMap, setCommentMap] = React.useState({});
  const [selected, setSelected] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [flash, setFlash] = React.useState(null);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  const flashTimer = React.useRef(null);
  function notify(msg) { setFlash(msg); clearTimeout(flashTimer.current); flashTimer.current = setTimeout(() => setFlash(null), 3200); }
  React.useEffect(() => () => clearTimeout(flashTimer.current), []);

  async function loadData() {
    setBooting(true); setLoadError(null);
    try { setTickets(await api.getTickets()); }
    catch (e) { if (!api.isAuthenticated()) onLogout(); else setLoadError(e.message); }
    finally { setBooting(false); }
  }
  React.useEffect(() => { loadData(); }, []);

  async function openTicket(t) {
    setSelected(t);
    if (!commentMap[t.id]) {
      try { const cs = await api.getComments(t.id); setCommentMap((m) => ({ ...m, [t.id]: cs })); }
      catch (e) { notify(e.message); }
    }
  }
  async function reply(id, body) {
    try { const c = await api.addComment(id, body, false); setCommentMap((m) => ({ ...m, [id]: [...(m[id] || []), c] })); }
    catch (e) { notify(e.message); }
  }
  async function create(payload) {
    try { const t = await api.createTicket(payload); setTickets((p) => [t, ...p]); notify('Ticket #TK-' + t.id + ' submitted — we’ll be in touch.'); }
    catch (e) { notify(e.message); }
  }

  const openCount = tickets.filter((t) => t.status === 'Open' || t.status === 'InProgress').length;

  function body() {
    if (booting) return <Skeleton rows={4} />;
    if (loadError) return <CenterMsg onRetry={loadData}>Couldn’t load your tickets: {loadError}</CenterMsg>;
    if (tickets.length === 0) {
      return <EmptyState icon="ticket" title="No tickets yet"
        subtitle="When you need help, raise a ticket and our support team will pick it up and keep you posted here."
        action={<Button variant="primary" icon="plus" onClick={() => setModal(true)} style={{ marginTop: 6 }}>Raise a ticket</Button>} />;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tickets.map((t) => <CustomerTicketCard key={t.id} t={t} onOpen={openTicket} />)}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface-card)', flexShrink: 0 }}>
        <img src="/assets/logo-full.svg" height="26" alt="HelpDesk" />
        <div style={{ flex: 1 }} />
        <Button variant="primary" icon="plus" onClick={() => setModal(true)}>New ticket</Button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, paddingLeft: 8 }}>
          <Avatar name={user ? user.fullName : 'You'} size="sm" />
          <div style={{ minWidth: 0 }}>
            <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{user ? user.fullName : 'You'}</div>
            <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)' }}>Customer</div>
          </div>
          <button onClick={onLogout} title="Sign out" style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 6, borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', display: 'inline-flex' }}>
            <Icon name="log-out" size={17} />
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <h1 style={{ font: 'var(--font-h1)', color: 'var(--text-strong)', margin: 0 }}>My tickets</h1>
            <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', marginTop: 4 }}>
              {tickets.length === 0 ? 'You haven’t raised any tickets yet.'
                : `${tickets.length} ${tickets.length === 1 ? 'ticket' : 'tickets'} · ${openCount} still open`}
            </div>
          </div>
          {body()}
        </div>
        <TicketDetail key={selected ? selected.id : 'none'} ticket={selected} comments={commentMap} canManage={false}
          onClose={() => setSelected(null)} onReply={reply} />
      </div>

      <NewTicketModal open={modal} onClose={() => setModal(false)} onCreate={create} heading="Raise a ticket" />
      {flash && <div className="flash">{flash}</div>}
    </div>
  );
}
Object.assign(window, { CustomerApp });
