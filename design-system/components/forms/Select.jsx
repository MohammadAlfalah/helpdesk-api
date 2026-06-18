import React from "react";

/** Select dropdown styled to match Input. Pass options as [{value,label}] or strings. */
export function Select({ label, hint, error, options = [], size = "md", id, style, containerStyle, ...rest }) {
  const sizes = { sm: 34, md: 40, lg: 46 };
  const reactId = React.useId();
  const inputId = id || reactId;
  const opts = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-body)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select
          id={inputId}
          style={{
            width: "100%",
            height: sizes[size] || sizes.md,
            padding: "0 38px 0 14px",
            fontFamily: "var(--font-sans)",
            fontSize: "var(--text-base)",
            color: "var(--text-strong)",
            background: "var(--surface-card)",
            border: `1px solid ${error ? "var(--danger)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            appearance: "none",
            cursor: "pointer",
            transition: "border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--border-focus)";
            e.target.style.boxShadow = "var(--ring)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "var(--danger)" : "var(--border-default)";
            e.target.style.boxShadow = "none";
          }}
          {...rest}
        >
          {opts.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <i data-lucide="chevron-down" style={{ position: "absolute", right: 12, width: 17, height: 17, color: "var(--text-faint)", pointerEvents: "none" }} />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: "var(--text-xs)", color: error ? "var(--danger)" : "var(--text-faint)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
