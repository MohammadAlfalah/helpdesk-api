import React from "react";

const TONES = {
  neutral: { bg: "var(--cream-200)", fg: "var(--charcoal-700)", dot: "var(--taupe-600)" },
  brand:   { bg: "var(--brand-soft)", fg: "var(--brand-soft-fg)", dot: "var(--brand)" },
  info:    { bg: "var(--info-soft)", fg: "var(--blue-600)", dot: "var(--info)" },
  warning: { bg: "var(--warning-soft)", fg: "var(--amber-600)", dot: "var(--warning)" },
  success: { bg: "var(--success-soft)", fg: "var(--green-600)", dot: "var(--success)" },
  danger:  { bg: "var(--danger-soft)", fg: "var(--red-600)", dot: "var(--danger)" },
};

/**
 * Badge / pill — a generic labelled chip for categories, counts, and tags.
 * For ticket status & priority, prefer the domain components StatusBadge /
 * PriorityBadge, which carry the canonical color mapping.
 */
export function Badge({ tone = "neutral", dot = false, size = "md", icon, children, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  const sm = size === "sm";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sm ? 5 : 6,
        height: sm ? 20 : 24,
        padding: sm ? "0 8px" : "0 10px",
        background: t.bg,
        color: t.fg,
        fontFamily: "var(--font-sans)",
        fontSize: sm ? "11px" : "var(--text-xs)",
        fontWeight: "var(--weight-semibold)",
        letterSpacing: "0.01em",
        lineHeight: 1,
        borderRadius: "var(--radius-full)",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...rest}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dot, flexShrink: 0 }} />}
      {icon && <i data-lucide={icon} style={{ width: sm ? 12 : 13, height: sm ? 12 : 13 }} />}
      {children}
    </span>
  );
}
