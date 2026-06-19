/* Top bar: page title, live search, new-ticket action. */
function Topbar({ title, subtitle, onNew, query = '', onSearch, showSearch = true, newLabel = 'New ticket' }) {
  const { Button, Input } = window.DS;
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 20,
      padding: '18px 28px', borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)', flexShrink: 0,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ font: 'var(--font-h2)', color: 'var(--text-strong)', margin: 0 }}>{title}</h1>
        {subtitle && <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      {showSearch && (
        <div style={{ width: 260 }}>
          <Input id="ticket-search" iconLeft={<Icon name="search" size={16} />} placeholder="Search tickets…"
            value={query} onChange={(e) => onSearch && onSearch(e.target.value)} />
        </div>
      )}
      {onNew && <Button variant="primary" iconLeft={<Icon name="plus" size={16} color="#fff" />} onClick={onNew}>{newLabel}</Button>}
    </header>
  );
}
Object.assign(window, { Topbar });
