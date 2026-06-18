import React from 'react';

const STATUS = {
  Open:       { fg: 'var(--status-open-fg)',       bg: 'var(--status-open-bg)',       label: 'Open' },
  InProgress: { fg: 'var(--status-inprogress-fg)', bg: 'var(--status-inprogress-bg)', label: 'In progress' },
  Resolved:   { fg: 'var(--status-resolved-fg)',   bg: 'var(--status-resolved-bg)',   label: 'Resolved' },
  Closed:     { fg: 'var(--status-closed-fg)',     bg: 'var(--status-closed-bg)',     label: 'Closed' },
};

/**
 * StatusBadge — renders a ticket's lifecycle status with the canonical
 * color mapping (Open / InProgress / Resolved / Closed).
 */
export function StatusBadge({ status = 'Open', size = 'md', style, ...rest }) {
  const s = STATUS[status] || STATUS.Open;
  const sizes = {
    sm: { font: 'var(--text-xs)', padding: '2px 9px 2px 7px', height: '20px' },
    md: { font: 'var(--text-sm)', padding: '4px 11px 4px 9px', height: '26px' },
  };
  const z = sizes[size] || sizes.md;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        background: s.bg, color: s.fg,
        font: `var(--weight-semibold) ${z.font}/1 var(--font-sans)`,
        padding: z.padding, height: z.height,
        borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {s.label}
    </span>
  );
}
