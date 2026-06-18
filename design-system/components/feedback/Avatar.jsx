import React from "react";

const PALETTE = [
  ["#C75D4A", "#fff"], ["#5E7E9B", "#fff"], ["#5E8C5A", "#fff"],
  ["#C2902F", "#fff"], ["#8A7B6B", "#fff"], ["#B9742F", "#fff"],
];
const NAMED = { xs: 24, sm: 30, md: 36, lg: 44, xl: 56 };

function hashIndex(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % PALETTE.length;
}
function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

/** Avatar — initials on a deterministic warm color, or an image.
 *  `size` accepts a number (px) or a named token: xs/sm/md/lg/xl. */
export function Avatar({ name = "", src, size = "md", role, style, ...rest }) {
  const dim = typeof size === "number" ? size : (NAMED[size] || NAMED.md);
  const [bg, fg] = PALETTE[hashIndex(name)];
  return (
    <span
      title={name}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        flexShrink: 0,
        borderRadius: "var(--radius-full)",
        background: src ? "var(--surface-sunken)" : bg,
        color: fg,
        fontFamily: "var(--font-sans)",
        fontSize: Math.round(dim * 0.4),
        fontWeight: "var(--weight-semibold)",
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials(name)
      )}
      {role === "Agent" && (
        <span
          title="Agent"
          style={{
            position: "absolute", right: -1, bottom: -1,
            width: Math.max(9, dim * 0.3), height: Math.max(9, dim * 0.3),
            background: "var(--brand)", border: "2px solid var(--surface-card)",
            borderRadius: "50%",
          }}
        />
      )}
    </span>
  );
}
