import React from "react";

/** Tabs — underline style. Controlled via `value`/`onChange`, or uncontrolled. */
export function Tabs({ tabs = [], value, defaultValue, onChange, style, ...rest }) {
  const items = tabs.map((t) => (typeof t === "string" ? { value: t, label: t } : t));
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const active = isControlled ? value : internal;

  const select = (v) => { if (!isControlled) setInternal(v); onChange && onChange(v); };

  return (
    <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-subtle)", ...style }} {...rest}>
      {items.map((t) => {
        const on = t.value === active;
        return (
          <button
            key={t.value}
            onClick={() => select(t.value)}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 14px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: "var(--text-base)",
              fontWeight: on ? "var(--weight-semibold)" : "var(--weight-medium)",
              color: on ? "var(--text-strong)" : "var(--text-muted)",
              transition: "color var(--duration-fast) var(--ease-out)",
            }}
          >
            {t.icon && <i data-lucide={t.icon} style={{ width: 16, height: 16 }} />}
            {t.label}
            {t.count != null && (
              <span style={{ fontSize: "var(--text-xs)", fontWeight: "var(--weight-semibold)", color: on ? "var(--brand-active)" : "var(--text-faint)", background: on ? "var(--brand-soft)" : "var(--surface-sunken)", borderRadius: "var(--radius-pill)", padding: "1px 7px" }}>{t.count}</span>
            )}
            <span style={{ position: "absolute", left: 8, right: 8, bottom: -1, height: 2, borderRadius: "2px 2px 0 0", background: on ? "var(--brand)" : "transparent" }} />
          </button>
        );
      })}
    </div>
  );
}
