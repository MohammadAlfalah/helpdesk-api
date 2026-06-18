import React from "react";

/** Text input with optional label, Lucide leading icon, and error state. */
export function Input({
  label,
  hint,
  error,
  icon,
  iconLeft,
  size = "md",
  id,
  style,
  containerStyle,
  ...rest
}) {
  const sizes = {
    sm: { height: 34, fontSize: "var(--text-sm)" },
    md: { height: 40, fontSize: "var(--text-base)" },
    lg: { height: 46, fontSize: "var(--text-md)" },
  };
  const s = sizes[size] || sizes.md;
  const reactId = React.useId();
  const inputId = id || reactId;
  const hasIcon = !!(icon || iconLeft);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-body)" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {hasIcon && (
          <span style={{ position: "absolute", left: 12, width: 17, height: 17, color: "var(--text-faint)", pointerEvents: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {iconLeft || <i data-lucide={icon} style={{ width: 17, height: 17 }} />}
          </span>
        )}
        <input
          id={inputId}
          style={{
            width: "100%",
            height: s.height,
            padding: hasIcon ? "0 14px 0 38px" : "0 14px",
            fontFamily: "var(--font-sans)",
            fontSize: s.fontSize,
            color: "var(--text-strong)",
            background: "var(--surface-card)",
            border: `1px solid ${error ? "var(--danger)" : "var(--border-default)"}`,
            borderRadius: "var(--radius-md)",
            outline: "none",
            transition: "border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
            ...style,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? "var(--danger)" : "var(--border-focus)";
            e.target.style.boxShadow = "var(--ring)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "var(--danger)" : "var(--border-default)";
            e.target.style.boxShadow = "none";
          }}
          {...rest}
        />
      </div>
      {(hint || error) && (
        <span style={{ fontSize: "var(--text-xs)", color: error ? "var(--danger)" : "var(--text-faint)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
