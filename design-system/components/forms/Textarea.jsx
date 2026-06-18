import React from "react";

/** Multi-line text area, matched to Input styling. */
export function Textarea({ label, hint, error, rows = 4, id, style, containerStyle, ...rest }) {
  const reactId = React.useId();
  const inputId = id || reactId;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...containerStyle }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)", color: "var(--text-body)" }}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        style={{
          width: "100%",
          padding: "10px 14px",
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          lineHeight: "var(--leading-normal)",
          color: "var(--text-strong)",
          background: "var(--surface-card)",
          border: `1px solid ${error ? "var(--danger)" : "var(--border-default)"}`,
          borderRadius: "var(--radius-md)",
          outline: "none",
          resize: "vertical",
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
      {(hint || error) && (
        <span style={{ fontSize: "var(--text-xs)", color: error ? "var(--danger)" : "var(--text-faint)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
