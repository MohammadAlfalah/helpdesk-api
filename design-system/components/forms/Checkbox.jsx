import React from "react";

/** Checkbox with label — terracotta when checked. Controlled or uncontrolled. */
export function Checkbox({ label, checked, defaultChecked, disabled = false, id, style, onChange, ...rest }) {
  const reactId = React.useId();
  const inputId = id || reactId;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const on = isControlled ? checked : internal;

  return (
    <label
      htmlFor={inputId}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontSize: "var(--text-base)",
        color: "var(--text-body)",
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: 19,
          height: 19,
          flexShrink: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "var(--radius-xs)",
          background: on ? "var(--brand)" : "var(--surface-card)",
          border: `1px solid ${on ? "var(--brand)" : "var(--border-strong)"}`,
          transition: "background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)",
          ...style,
        }}
      >
        {on && <i data-lucide="check" style={{ width: 13, height: 13, color: "#fff", strokeWidth: 3 }} />}
      </span>
      <input
        id={inputId}
        type="checkbox"
        checked={isControlled ? checked : undefined}
        defaultChecked={isControlled ? undefined : defaultChecked}
        disabled={disabled}
        onChange={(e) => { if (!isControlled) setInternal(e.target.checked); onChange && onChange(e); }}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {label}
    </label>
  );
}
