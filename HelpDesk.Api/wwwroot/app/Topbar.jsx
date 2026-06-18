/* Top bar: page title, search, new-ticket action. */
function Topbar({ title, subtitle, onNew }) {
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
      <div style={{ width: 260 }}>
        <Input iconLeft={<Icon name="search" size={16} />} placeholder="Search tickets…" />
      </div>
      <Button variant="primary" iconLeft={<Icon name="plus" size={16} color="#fff" />} onClick={onNew}>New ticket</Button>
    </header>
  );
}
Object.assign(window, { Topbar });
