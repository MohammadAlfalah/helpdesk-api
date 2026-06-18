import React from "react";

/** Card surface — white, rounded, soft shadow. The base container of the system. */
export function Card({ padding = 20, interactive = false, elevation = "sm", children, style, ...rest }) {
  const shadows = { none: "none", sm: "var(--shadow-sm)", md: "var(--shadow-md)", lg: "var(--shadow-lg)" };
  const PAD = { none: 0, sm: 14, md: 20, lg: 28 };
  const pad = typeof padding === "number" ? padding : (PAD[padding] ?? padding);
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: shadows[elevation] ?? shadows.sm,
        padding: pad,
        transition: interactive
          ? "box-shadow var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out), border-color var(--duration-normal) var(--ease-out)"
          : undefined,
        cursor: interactive ? "pointer" : undefined,
        ...style,
      }}
      onMouseEnter={interactive ? (e) => { e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.transform = "translateY(-1px)"; } : undefined}
      onMouseLeave={interactive ? (e) => { e.currentTarget.style.boxShadow = shadows[elevation] ?? shadows.sm; e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.transform = "none"; } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}
