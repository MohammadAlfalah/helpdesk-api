import React from 'react';

/**
 * SlaIndicator — surfaces a ticket's SLA state: time remaining, breached, or
 * escalated. Mirrors the API's SLA model (slaDueAt / isSlaBreached / isEscalated).
 */
export function SlaIndicator({ dueAt, breached = false, escalated = false, now = Date.now(), size = 'md', style, ...rest }) {
  const due = dueAt ? new Date(dueAt).getTime() : null;
  const diffMs = due != null ? due - now : null;
  const isBreached = breached || (diffMs != null && diffMs < 0);

  function humanize(ms) {
    const abs = Math.abs(ms);
    const h = Math.floor(abs / 3.6e6);
    const m = Math.floor((abs % 3.6e6) / 6e4);
    if (h >= 24) { const d = Math.floor(h / 24); return `${d}d ${h % 24}h`; }
    if (h >= 1) return `${h}h ${m}m`;
    return `${m}m`;
  }

  let fg, bg, label, icon;
  if (escalated) {
    fg = 'var(--red-500)'; bg = 'var(--red-100)';
    label = 'Escalated'; icon = '▲';
  } else if (isBreached) {
    fg = 'var(--red-500)'; bg = 'var(--red-100)';
    label = diffMs != null ? `Breached ${humanize(diffMs)} ago` : 'SLA breached'; icon = '●';
  } else if (diffMs != null && diffMs < 3.6e6) {
    fg = 'var(--amber-600)'; bg = 'var(--amber-100)';
    label = `Due in ${humanize(diffMs)}`; icon = '●';
  } else {
    fg = 'var(--green-600)'; bg = 'var(--green-100)';
    label = diffMs != null ? `Due in ${humanize(diffMs)}` : 'Within SLA'; icon = '●';
  }

  const sizes = {
    sm: { font: 'var(--text-xs)', padding: '2px 9px 2px 8px', height: '20px' },
    md: { font: 'var(--text-sm)', padding: '4px 11px 4px 10px', height: '26px' },
  };
  const z = sizes[size] || sizes.md;

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: bg, color: fg,
        font: `var(--weight-semibold) ${z.font}/1 var(--font-sans)`,
        padding: z.padding, height: z.height,
        borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      <span style={{ fontSize: '0.7em', lineHeight: 1 }}>{icon}</span>
      {label}
    </span>
  );
}
