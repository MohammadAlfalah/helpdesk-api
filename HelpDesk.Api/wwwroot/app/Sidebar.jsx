/* Left navigation rail for the agent console. */
function Sidebar({ active, onNavigate, counts, user, onLogout }) {
  const { Avatar } = window.DS;
  const me = user || { fullName: 'Agent', role: 'Agent' };
  const nav = [
    { key: 'inbox', label: 'Inbox', icon: 'inbox', count: counts.open + counts.inprogress },
    { key: 'escalated', label: 'Escalated', icon: 'alert-triangle', count: counts.escalated },
    { key: 'resolved', label: 'Resolved', icon: 'check-circle-2', count: null },
    { key: 'agents', label: 'Agents', icon: 'users', count: null },
    { key: 'reports', label: 'Reports', icon: 'bar-chart-3', count: null },
  ];
  return (
    <aside style={{
      width: 232, flexShrink: 0, background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column',
      padding: '20px 14px', gap: 24, height: '100%', boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
        <img src="/assets/logo-full.svg" height="28" alt="HelpDesk" />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map((n) => {
          const on = active === n.key;
          return (
            <button key={n.key} onClick={() => onNavigate(n.key)} style={{
              display: 'flex', alignItems: 'center', gap: 11, width: '100%',
              padding: '9px 12px', borderRadius: 'var(--radius-md)', border: 'none',
              background: on ? 'var(--brand-soft)' : 'transparent',
              color: on ? 'var(--brand-soft-fg)' : 'var(--text-body)',
              font: `var(--weight-${on ? 'semibold' : 'medium'}) var(--text-sm)/1 var(--font-sans)`,
              cursor: 'pointer', textAlign: 'left', transition: 'background 120ms ease',
            }}
            onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--surface-sunken)'; }}
            onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
              <Icon name={n.icon} size={18} color={on ? 'var(--brand)' : 'var(--text-muted)'} />
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.count != null && n.count > 0 && (
                <span style={{
                  font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-mono)',
                  color: on ? 'var(--brand-soft-fg)' : 'var(--text-muted)',
                  background: on ? 'rgba(194,94,60,0.14)' : 'var(--surface-sunken)',
                  padding: '3px 7px', borderRadius: 'var(--radius-full)',
                }}>{n.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <Avatar name={me.fullName} role={me.role} size="sm" />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ font: 'var(--font-label)', color: 'var(--text-strong)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{me.fullName}</div>
          <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)' }}>{me.role}</div>
        </div>
        <button onClick={onLogout} title="Sign out" style={{
          border: 'none', background: 'transparent', cursor: 'pointer', padding: 6,
          borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', display: 'inline-flex',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-sunken)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          <Icon name="log-out" size={17} />
        </button>
      </div>
    </aside>
  );
}
Object.assign(window, { Sidebar });
