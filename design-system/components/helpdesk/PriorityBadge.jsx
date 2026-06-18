import React from 'react';

const PRIO = {
  Low:    { fg: 'var(--prio-low-fg)',    bg: 'var(--prio-low-bg)',    bars: 1, label: 'Low' },
  Medium: { fg: 'var(--prio-medium-fg)', bg: 'var(--prio-medium-bg)', bars: 2, label: 'Medium' },
  High:   { fg: 'var(--prio-high-fg)',   bg: 'var(--prio-high-bg)',   bars: 3, label: 'High' },
  Urgent: { fg: 'var(--prio-urgent-fg)', bg: 'var(--prio-urgent-bg)', bars: 4, label: 'Urgent' },
};

/**
 * PriorityBadge — a ticket's priority with a 4-bar signal-strength glyph.
 * Maps Low / Medium / High / Urgent to the canonical warm palette.
 */
export function PriorityBadge({ priority = 'Medium', size = 'md', style, ...rest }) {
  const p = PRIO[priority] || PRIO.Medium;
  const sizes = {
    sm: { font: 'var(--text-xs)', padding: '2px 9px', height: '20px', bar: 3 },
    md: { font: 'var(--text-sm)', padding: '4px 11px', height: '26px', bar: 4 },
  };
  const z = sizes[size] || sizes.md;
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        background: p.bg, color: p.fg,
        font: `var(--weight-semibold) ${z.font}/1 var(--font-sans)`,
        padding: z.padding, height: z.height,
        borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: '2px', height: z.bar * 2.6 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} style={{
            width: z.bar - 1, height: `${(i + 1) * 26}%`,
            borderRadius: '1px',
            background: 'currentColor',
            opacity: i < p.bars ? 1 : 0.25,
          }} />
        ))}
      </span>
      {p.label}
    </span>
  );
}
