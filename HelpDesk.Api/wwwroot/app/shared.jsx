/* Shared UI used by both the agent console and the customer portal. */

// Accessible-dialog hook: when `active`, move focus into the panel, trap Tab,
// close on Escape, and restore focus to the trigger on close. Returns a ref to
// put on the dialog's outer element.
function useDialog(onClose, active = true) {
  const ref = React.useRef(null);
  const closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  React.useEffect(() => {
    if (!active) return undefined;
    const panel = ref.current;
    if (!panel) return undefined;
    const prev = document.activeElement;
    const sel = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const items = () => Array.prototype.slice.call(panel.querySelectorAll(sel));
    const first = items()[0];
    (first || panel).focus();
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (closeRef.current) closeRef.current(); return; }
      if (e.key === 'Tab') {
        const f = items();
        if (!f.length) { e.preventDefault(); panel.focus(); return; }
        const lo = f[0], hi = f[f.length - 1];
        if (e.shiftKey && (document.activeElement === lo || document.activeElement === panel)) { e.preventDefault(); hi.focus(); }
        else if (!e.shiftKey && document.activeElement === hi) { e.preventDefault(); lo.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      if (prev && prev.focus) { try { prev.focus(); } catch (err) { /* ignore */ } }
    };
  }, [active]);
  return ref;
}

function NewTicketModal({ open, onClose, onCreate, heading = 'New ticket' }) {
  const { Button, Input, Select, Textarea, Card } = window.DS;
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Network');
  const [priority, setPriority] = React.useState('Medium');
  const [desc, setDesc] = React.useState('');
  const dialogRef = useDialog(onClose, open);
  React.useEffect(() => { window.lucide && window.lucide.createIcons(); });
  if (!open) return null;
  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="ntm-title" tabIndex={-1}
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(34,28,24,0.38)' }} />
      <Card padding="none" style={{ position: 'relative', width: 520, maxWidth: '92%', boxShadow: 'var(--shadow-xl)' }}>
        <div style={{ padding: '20px 22px', borderBottom: '1px solid var(--border-subtle)' }}>
          <h2 id="ntm-title" style={{ font: 'var(--font-h2)', margin: 0, color: 'var(--text-strong)' }}>{heading}</h2>
        </div>
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Subject" placeholder="Briefly describe the issue" value={title} onChange={(e) => setTitle(e.target.value)} />
          <div style={{ display: 'flex', gap: 12 }}>
            <Select label="Category" containerStyle={{ flex: 1 }} options={['Network', 'Hardware', 'Account', 'Billing', 'General']} value={category} onChange={(e) => setCategory(e.target.value)} />
            <Select label="Priority" containerStyle={{ flex: 1 }} options={['Low', 'Medium', 'High', 'Urgent']} value={priority} onChange={(e) => setPriority(e.target.value)} />
          </div>
          <Textarea label="Description" rows={4} placeholder="What happened? What did you expect?" value={desc} onChange={(e) => setDesc(e.target.value)} />
        </div>
        <div style={{ padding: 16, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" icon="plus" disabled={!title.trim()}
            onClick={() => { onCreate({ title: title.trim(), category, priority, description: desc.trim() }); onClose(); }}>Create ticket</Button>
        </div>
      </Card>
    </div>
  );
}

function CenterMsg({ children, onRetry }) {
  const { Button } = window.DS;
  return (
    <div className="center-msg">
      <div style={{ font: 'var(--font-body)' }}>{children}</div>
      {onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}

function EmptyState({ icon = 'inbox', title, subtitle, action }) {
  return (
    <div className="center-msg" style={{ gap: 10 }}>
      <span style={{ width: 52, height: 52, borderRadius: 'var(--radius-lg)', background: 'var(--surface-sunken, #F1EAE0)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={24} color="var(--text-faint)" />
      </span>
      <div style={{ font: 'var(--font-h3)', color: 'var(--text-strong)' }}>{title}</div>
      {subtitle && <div style={{ font: 'var(--font-small)', color: 'var(--text-muted)', maxWidth: 360, textAlign: 'center' }}>{subtitle}</div>}
      {action}
    </div>
  );
}

// Lightweight loading skeleton: a few shimmering ticket-row placeholders.
function Skeleton({ rows = 5 }) {
  return (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <style>{`@keyframes hdShimmer { 0% { opacity: .55 } 50% { opacity: 1 } 100% { opacity: .55 } }`}</style>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{
          height: 64, borderRadius: 'var(--radius-lg)', background: 'var(--surface-card)',
          border: '1px solid var(--border-subtle)', animation: 'hdShimmer 1.3s ease-in-out infinite',
          animationDelay: (i * 0.08) + 's',
        }} />
      ))}
    </div>
  );
}

Object.assign(window, { useDialog, NewTicketModal, CenterMsg, EmptyState, Skeleton });
