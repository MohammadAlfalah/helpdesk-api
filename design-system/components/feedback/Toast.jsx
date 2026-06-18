import React from "react";

const KIND = {
  info:    { icon: "info", color: "var(--info)", bg: "var(--info-soft)" },
  success: { icon: "check-circle-2", color: "var(--success)", bg: "var(--success-soft)" },
  warning: { icon: "alert-triangle", color: "var(--warning)", bg: "var(--warning-soft)" },
  danger:  { icon: "alert-octagon", color: "var(--danger)", bg: "var(--danger-soft)" },
};

/** Toast / inline notification. Static presentational component. */
export function Toast({ kind = "info", title, children, onDismiss, style, ...rest }) {
  const k = KIND[kind] || KIND.info;
  return (
    <div
      role="status"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        width: "100%",
        maxWidth: 420,
        padding: "14px 16px",
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        ...style,
      }}
      {...rest}
    >
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, flexShrink: 0, borderRadius: "var(--radius-md)", background: k.bg, color: k.color }}>
        <i data-lucide={k.icon} style={{ width: 18, height: 18 }} />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && <div style={{ fontSize: "var(--text-base)", fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>{title}</div>}
        {children && <div style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)", marginTop: title ? 2 : 0, lineHeight: "var(--leading-snug)" }}>{children}</div>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} aria-label="Dismiss" style={{ display: "inline-flex", background: "transparent", border: "none", color: "var(--text-faint)", cursor: "pointer", padding: 2, marginTop: -2 }}>
          <i data-lucide="x" style={{ width: 16, height: 16 }} />
        </button>
      )}
    </div>
  );
}
