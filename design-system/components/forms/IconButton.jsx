import React from "react";

/** IconButton — square button for a single Lucide icon (toolbar/row actions). */
export function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  label,
  disabled = false,
  style,
  ...rest
}) {
  const sizes = { sm: 30, md: 36, lg: 42 };
  const iconSizes = { sm: 16, md: 18, lg: 20 };
  const dim = sizes[size] || sizes.md;

  const variants = {
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" },
    secondary: { background: "var(--surface-card)", color: "var(--text-body)", border: "1px solid var(--border-default)" },
    soft: { background: "var(--brand-soft)", color: "var(--brand-active)", border: "1px solid var(--brand-soft-border)" },
    primary: { background: "var(--brand)", color: "#fff", border: "1px solid var(--brand)" },
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transition: "background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)",
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      <i data-lucide={icon} style={{ width: iconSizes[size], height: iconSizes[size] }} />
    </button>
  );
}
