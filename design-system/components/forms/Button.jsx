import React from "react";

/**
 * Button — primary action element for the HelpDesk system.
 * Icons use Lucide: pass `icon`/`iconRight` as a Lucide name; the host page
 * must run `lucide.createIcons()` after render to swap them to SVG.
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconLeft,
  iconRight,
  fullWidth = false,
  disabled = false,
  type = "button",
  children,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: "0 12px", height: 32, fontSize: "var(--text-sm)", gap: 6, icon: 15 },
    md: { padding: "0 16px", height: 38, fontSize: "var(--text-base)", gap: 8, icon: 17 },
    lg: { padding: "0 22px", height: 46, fontSize: "var(--text-md)", gap: 9, icon: 19 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: "var(--brand)",
      color: "var(--text-on-primary)",
      border: "1px solid var(--brand)",
      boxShadow: "var(--shadow-xs)",
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--text-strong)",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-xs)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-body)",
      border: "1px solid transparent",
    },
    danger: {
      background: "var(--danger)",
      color: "#fff",
      border: "1px solid var(--danger)",
      boxShadow: "var(--shadow-xs)",
    },
    soft: {
      background: "var(--brand-soft)",
      color: "var(--brand-active)",
      border: "1px solid var(--brand-soft-border)",
    },
  };

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
    fontSize: s.fontSize,
    fontWeight: "var(--weight-semibold)",
    lineHeight: 1,
    letterSpacing: "0.005em",
    borderRadius: "var(--radius-md)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "background var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)",
    whiteSpace: "nowrap",
    ...variants[variant],
    ...style,
  };

  // Accepts a Lucide name (string) or a ready React node.
  const renderIcon = (val) => {
    if (!val) return null;
    if (typeof val === "string")
      return <i data-lucide={val} style={{ width: s.icon, height: s.icon, display: "inline-flex" }} />;
    return <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: s.icon, height: s.icon }}>{val}</span>;
  };

  return (
    <button type={type} disabled={disabled} style={base} {...rest}>
      {renderIcon(iconLeft || icon)}
      {children}
      {renderIcon(iconRight)}
    </button>
  );
}
