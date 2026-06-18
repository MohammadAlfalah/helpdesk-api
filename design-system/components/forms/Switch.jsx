import React from 'react';

/**
 * Switch — on/off toggle. Use for binary settings (e.g. internal-note mode).
 */
export function Switch({ label, checked = false, disabled = false, onChange, id, style, ...rest }) {
  const fieldId = id || `sw-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <label
      htmlFor={fieldId}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, ...style }}
    >
      <span style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center', flexShrink: 0,
        width: 38, height: 22, padding: 2,
        borderRadius: 'var(--radius-full)',
        background: checked ? 'var(--brand)' : 'var(--sand-400)',
        transition: 'background 160ms ease',
      }}>
        <input
          type="checkbox" id={fieldId} checked={checked} disabled={disabled} onChange={onChange}
          style={{ position: 'absolute', opacity: 0, inset: 0, margin: 0, cursor: 'inherit' }}
          {...rest}
        />
        <span style={{
          width: 18, height: 18, borderRadius: '50%', background: '#fff',
          boxShadow: 'var(--shadow-sm)',
          transform: checked ? 'translateX(16px)' : 'translateX(0)',
          transition: 'transform 160ms cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </span>
      {label && <span style={{ font: 'var(--font-label)', color: 'var(--text-strong)' }}>{label}</span>}
    </label>
  );
}
