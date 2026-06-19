/* The agent console: inbox + escalated + resolved + agents + reports, with live
   search, sort, "assigned to me", a slide-over ticket detail with full triage
   actions, and a new-ticket modal. */
const NAV_TITLES = {
  inbox: ['Inbox', 'All tickets across your team'],
  escalated: ['Escalated', 'Tickets that breached their SLA'],
  resolved: ['Resolved', 'Recently resolved & closed'],
  agents: ['Agents', 'Your support team'],
  reports: ['Reports', 'SLA performance & volume'],
};
const PRIO_RANK = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

function statusLabel(s) { return s === 'InProgress' ? 'In progress' : s; }

function sortTickets(arr, s) {
  const a = arr.slice();
  if (s === 'oldest') a.sort((x, y) => x.createdAt - y.createdAt);
  else if (s === 'sla') a.sort((x, y) => x.slaDueAt - y.slaDueAt);
  else if (s === 'priority') a.sort((x, y) => (PRIO_RANK[y.priority] || 0) - (PRIO_RANK[x.priority] || 0) || y.createdAt - x.createdAt);
  else a.sort((x, y) => y.createdAt - x.createdAt); // newest
  return a;
}
function matchesQuery(t, q) {
  return ('tk-' + t.id).includes(q) || String(t.id).includes(q)
    || (t.title || '').toLowerCase().includes(q)
    || (t.description || '').toLowerCase().includes(q)
    || (t.category || '').toLowerCase().includes(q)
    || (t.createdBy && (t.createdBy.fullName || '').toLowerCase().includes(q))
    || (t.assignedAgent && (t.assignedAgent.fullName || '').toLowerCase().includes(q));
}

function AgentApp({ user, onLogout }) {
  const api = window.HelpDeskApi;
  const [booting, setBooting] = React.useState(true);
  const [loadError, setLoadError] = React.useState(null);
  const [tickets, setTickets] = React.useState([]);
  const [commentMap, setCommentMap] = React.useState({});
  const [agents, setAgents] = React.useState([]);
  const [active, setActive] = React.useState('inbox');
  const [selected, setSelected] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [flash, setFlash] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const [sort, setSort] = React.useState('newest');
  const [mineOnly, setMineOnly] = React.useState(false);

  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });

  const flashTimer = React.useRef(null);
  function notify(msg) { setFlash(msg); clearTimeout(flashTimer.current); flashTimer.current = setTimeout(() => setFlash(null), 3200); }
  React.useEffect(() => () => clearTimeout(flashTimer.current), []);

  async function loadData() {
    setBooting(true); setLoadError(null);
    try {
      const ags = await api.getAgents();
      const tks = await api.getTickets();
      setAgents(ags); setTickets(tks);
    } catch (e) {
      if (!api.isAuthenticated()) onLogout();
      else setLoadError(e.message);
    } finally { setBooting(false); }
  }
  React.useEffect(() => { loadData(); }, []);

  // Keyboard shortcuts: / focus search, n new ticket, Esc close.
  React.useEffect(() => {
    function onKey(e) {
      const tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (selected || modal) return;   // an open dialog owns its own keys (Esc, Tab trap)
      if (e.key === '/') { e.preventDefault(); const el = document.getElementById('ticket-search'); if (el) el.focus(); }
      else if (e.key === 'n' || e.key === 'N') { e.preventDefault(); setModal(true); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, modal]);

  async function openTicket(t) {
    setSelected(t);
    if (!commentMap[t.id]) {
      try { const cs = await api.getComments(t.id); setCommentMap((m) => ({ ...m, [t.id]: cs })); }
      catch (e) { notify(e.message); }
    }
  }
  async function reply(id, body, internal) {
    try { const c = await api.addComment(id, body, internal); setCommentMap((m) => ({ ...m, [id]: [...(m[id] || []), c] })); }
    catch (e) { notify(e.message); }
  }
  async function create(payload) {
    try { const t = await api.createTicket(payload); setTickets((p) => [t, ...p]); setActive('inbox'); notify('Ticket #TK-' + t.id + ' created.'); }
    catch (e) { notify(e.message); }
  }
  function replaceTicket(t) { setTickets((p) => p.map((x) => (x.id === t.id ? t : x))); setSelected((s) => (s && s.id === t.id ? t : s)); }
  async function onAssign(id, agentIdStr) { try { replaceTicket(await api.assignTicket(id, agentIdStr)); notify('Assignment updated.'); } catch (e) { notify(e.message); } }
  async function onStatus(id, status) { try { replaceTicket(await api.updateTicket(id, { status })); notify('Status → ' + statusLabel(status) + '.'); } catch (e) { notify(e.message); } }
  async function onPriority(id, priority) { try { replaceTicket(await api.updateTicket(id, { priority })); notify('Priority → ' + priority + '.'); } catch (e) { notify(e.message); } }
  async function onCategory(id, category) { try { replaceTicket(await api.updateTicket(id, { category })); notify('Category → ' + category + '.'); } catch (e) { notify(e.message); } }
  async function onDelete(id) {
    try { await api.deleteTicket(id); setTickets((p) => p.filter((x) => x.id !== id)); setSelected((s) => (s && s.id === id ? null : s)); notify('Ticket #TK-' + id + ' deleted.'); }
    catch (e) { notify(e.message); }
  }

  const counts = {
    all: tickets.length,
    open: tickets.filter((t) => t.status === 'Open').length,
    inprogress: tickets.filter((t) => t.status === 'InProgress').length,
    escalated: tickets.filter((t) => t.isEscalated).length,
    resolved: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
  };

  let view = tickets;
  if (active === 'escalated') view = view.filter((t) => t.isEscalated);
  else if (active === 'resolved') view = view.filter((t) => t.status === 'Resolved' || t.status === 'Closed');
  if (mineOnly && user && user.id != null) view = view.filter((t) => t.assignedAgent && t.assignedAgent.id === user.id);
  const q = query.trim().toLowerCase();
  if (q) view = view.filter((t) => matchesQuery(t, q));
  view = sortTickets(view, sort);

  const [navTitle, navSub] = NAV_TITLES[active];
  const showSearch = active === 'inbox' || active === 'escalated' || active === 'resolved';

  function content() {
    if (booting) return <Skeleton />;
    if (loadError) return <CenterMsg onRetry={loadData}>Couldn’t load tickets: {loadError}</CenterMsg>;
    if (active === 'agents') return <AgentsPage agents={agents} tickets={tickets} />;
    if (active === 'reports') return <ReportsPage tickets={tickets} agents={agents} />;
    return <TicketInbox tickets={view} counts={counts} onOpen={openTicket}
      sort={sort} onSort={setSort} mineOnly={mineOnly} onMineOnly={() => setMineOnly((v) => !v)}
      canMine={!!(user && user.id != null)} searching={!!q} query={query} />;
  }

  return (
    <>
      <Sidebar active={active} onNavigate={(k) => { setActive(k); setSelected(null); }} counts={counts} user={user} onLogout={onLogout} />
      <div className="main">
        <Topbar title={navTitle} subtitle={navSub} onNew={() => setModal(true)} query={query} onSearch={setQuery} showSearch={showSearch} />
        <div className="content">
          {content()}
          <TicketDetail key={selected ? selected.id : 'none'} ticket={selected} comments={commentMap} agents={agents} canManage
            onClose={() => setSelected(null)} onReply={reply} onAssign={onAssign} onStatus={onStatus}
            onPriority={onPriority} onCategory={onCategory} onDelete={onDelete} />
        </div>
      </div>
      <NewTicketModal open={modal} onClose={() => setModal(false)} onCreate={create} />
      {flash && <div className="flash">{flash}</div>}
    </>
  );
}
Object.assign(window, { AgentApp, NAV_TITLES, sortTickets, matchesQuery, statusLabel });
