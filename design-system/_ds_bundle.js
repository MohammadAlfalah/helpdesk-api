/* @ds-bundle: {"format":3,"namespace":"HelpDeskDesignSystem_35c226","components":[{"name":"Avatar","sourcePath":"components/feedback/Avatar.jsx"},{"name":"Badge","sourcePath":"components/feedback/Badge.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"PriorityBadge","sourcePath":"components/helpdesk/PriorityBadge.jsx"},{"name":"SlaIndicator","sourcePath":"components/helpdesk/SlaIndicator.jsx"},{"name":"StatusBadge","sourcePath":"components/helpdesk/StatusBadge.jsx"},{"name":"Card","sourcePath":"components/layout/Card.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/feedback/Avatar.jsx":"4ba08dae1f2a","components/feedback/Badge.jsx":"e5bc83d413e0","components/feedback/Toast.jsx":"b6511fdc2524","components/forms/Button.jsx":"ffe77e355912","components/forms/Checkbox.jsx":"81f95cf22b0b","components/forms/IconButton.jsx":"4688140209e9","components/forms/Input.jsx":"b813ce394450","components/forms/Select.jsx":"cdd9ab0a39eb","components/forms/Switch.jsx":"ae8f153e847e","components/forms/Textarea.jsx":"c19d6f8ed647","components/helpdesk/PriorityBadge.jsx":"0109ff5287ca","components/helpdesk/SlaIndicator.jsx":"ac5fd0b6170b","components/helpdesk/StatusBadge.jsx":"80999e4d1c92","components/layout/Card.jsx":"e4bdb35ee558","components/navigation/Tabs.jsx":"85cf22facbfa","ui_kits/agent-console/Sidebar.jsx":"a6555057e75e","ui_kits/agent-console/TicketDetail.jsx":"26dca7c5cf57","ui_kits/agent-console/TicketInbox.jsx":"9c5b2f5821c1","ui_kits/agent-console/Topbar.jsx":"42cef01d4471","ui_kits/agent-console/data.js":"a02466ddfd51","ui_kits/agent-console/util.jsx":"2a1071bca204"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.HelpDeskDesignSystem_35c226 = window.HelpDeskDesignSystem_35c226 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/feedback/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PALETTE = [["#C75D4A", "#fff"], ["#5E7E9B", "#fff"], ["#5E8C5A", "#fff"], ["#C2902F", "#fff"], ["#8A7B6B", "#fff"], ["#B9742F", "#fff"]];
const NAMED = {
  xs: 24,
  sm: 30,
  md: 36,
  lg: 44,
  xl: 56
};
function hashIndex(str = "") {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = h * 31 + str.charCodeAt(i) >>> 0;
  return h % PALETTE.length;
}
function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "?";
}

/** Avatar — initials on a deterministic warm color, or an image.
 *  `size` accepts a number (px) or a named token: xs/sm/md/lg/xl. */
function Avatar({
  name = "",
  src,
  size = "md",
  role,
  style,
  ...rest
}) {
  const dim = typeof size === "number" ? size : NAMED[size] || NAMED.md;
  const [bg, fg] = PALETTE[hashIndex(name)];
  return /*#__PURE__*/React.createElement("span", _extends({
    title: name,
    style: {
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
      ...style
    }
  }, rest), src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials(name), role === "Agent" && /*#__PURE__*/React.createElement("span", {
    title: "Agent",
    style: {
      position: "absolute",
      right: -1,
      bottom: -1,
      width: Math.max(9, dim * 0.3),
      height: Math.max(9, dim * 0.3),
      background: "var(--brand)",
      border: "2px solid var(--surface-card)",
      borderRadius: "50%"
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  neutral: {
    bg: "var(--cream-200)",
    fg: "var(--charcoal-700)",
    dot: "var(--taupe-600)"
  },
  brand: {
    bg: "var(--brand-soft)",
    fg: "var(--brand-soft-fg)",
    dot: "var(--brand)"
  },
  info: {
    bg: "var(--info-soft)",
    fg: "var(--blue-600)",
    dot: "var(--info)"
  },
  warning: {
    bg: "var(--warning-soft)",
    fg: "var(--amber-600)",
    dot: "var(--warning)"
  },
  success: {
    bg: "var(--success-soft)",
    fg: "var(--green-600)",
    dot: "var(--success)"
  },
  danger: {
    bg: "var(--danger-soft)",
    fg: "var(--red-600)",
    dot: "var(--danger)"
  }
};

/**
 * Badge / pill — a generic labelled chip for categories, counts, and tags.
 * For ticket status & priority, prefer the domain components StatusBadge /
 * PriorityBadge, which carry the canonical color mapping.
 */
function Badge({
  tone = "neutral",
  dot = false,
  size = "md",
  icon,
  children,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  const sm = size === "sm";
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: t.dot,
      flexShrink: 0
    }
  }), icon && /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: sm ? 12 : 13,
      height: sm ? 12 : 13
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Badge.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KIND = {
  info: {
    icon: "info",
    color: "var(--info)",
    bg: "var(--info-soft)"
  },
  success: {
    icon: "check-circle-2",
    color: "var(--success)",
    bg: "var(--success-soft)"
  },
  warning: {
    icon: "alert-triangle",
    color: "var(--warning)",
    bg: "var(--warning-soft)"
  },
  danger: {
    icon: "alert-octagon",
    color: "var(--danger)",
    bg: "var(--danger-soft)"
  }
};

/** Toast / inline notification. Static presentational component. */
function Toast({
  kind = "info",
  title,
  children,
  onDismiss,
  style,
  ...rest
}) {
  const k = KIND[kind] || KIND.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      width: "100%",
      maxWidth: 420,
      padding: "14px 16px",
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-lg)",
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 30,
      height: 30,
      flexShrink: 0,
      borderRadius: "var(--radius-md)",
      background: k.bg,
      color: k.color
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": k.icon,
    style: {
      width: 18,
      height: 18
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-base)",
      fontWeight: "var(--weight-semibold)",
      color: "var(--text-strong)"
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "var(--text-sm)",
      color: "var(--text-muted)",
      marginTop: title ? 2 : 0,
      lineHeight: "var(--leading-snug)"
    }
  }, children)), onDismiss && /*#__PURE__*/React.createElement("button", {
    onClick: onDismiss,
    "aria-label": "Dismiss",
    style: {
      display: "inline-flex",
      background: "transparent",
      border: "none",
      color: "var(--text-faint)",
      cursor: "pointer",
      padding: 2,
      marginTop: -2
    }
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "x",
    style: {
      width: 16,
      height: 16
    }
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — primary action element for the HelpDesk system.
 * Icons use Lucide: pass `icon`/`iconRight` as a Lucide name; the host page
 * must run `lucide.createIcons()` after render to swap them to SVG.
 */
function Button({
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
    sm: {
      padding: "0 12px",
      height: 32,
      fontSize: "var(--text-sm)",
      gap: 6,
      icon: 15
    },
    md: {
      padding: "0 16px",
      height: 38,
      fontSize: "var(--text-base)",
      gap: 8,
      icon: 17
    },
    lg: {
      padding: "0 22px",
      height: 46,
      fontSize: "var(--text-md)",
      gap: 9,
      icon: 19
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: "var(--brand)",
      color: "var(--text-on-primary)",
      border: "1px solid var(--brand)",
      boxShadow: "var(--shadow-xs)"
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--text-strong)",
      border: "1px solid var(--border-default)",
      boxShadow: "var(--shadow-xs)"
    },
    ghost: {
      background: "transparent",
      color: "var(--text-body)",
      border: "1px solid transparent"
    },
    danger: {
      background: "var(--danger)",
      color: "#fff",
      border: "1px solid var(--danger)",
      boxShadow: "var(--shadow-xs)"
    },
    soft: {
      background: "var(--brand-soft)",
      color: "var(--brand-active)",
      border: "1px solid var(--brand-soft-border)"
    }
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
    ...style
  };

  // Accepts a Lucide name (string) or a ready React node.
  const renderIcon = val => {
    if (!val) return null;
    if (typeof val === "string") return /*#__PURE__*/React.createElement("i", {
      "data-lucide": val,
      style: {
        width: s.icon,
        height: s.icon,
        display: "inline-flex"
      }
    });
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: s.icon,
        height: s.icon
      }
    }, val);
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    style: base
  }, rest), renderIcon(iconLeft || icon), children, renderIcon(iconRight));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with label — terracotta when checked. Controlled or uncontrolled. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  disabled = false,
  id,
  style,
  onChange,
  ...rest
}) {
  const reactId = React.useId();
  const inputId = id || reactId;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked || false);
  const on = isControlled ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: "var(--text-base)",
      color: "var(--text-body)",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
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
      ...style
    }
  }, on && /*#__PURE__*/React.createElement("i", {
    "data-lucide": "check",
    style: {
      width: 13,
      height: 13,
      color: "#fff",
      strokeWidth: 3
    }
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "checkbox",
    checked: isControlled ? checked : undefined,
    defaultChecked: isControlled ? undefined : defaultChecked,
    disabled: disabled,
    onChange: e => {
      if (!isControlled) setInternal(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: "absolute",
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** IconButton — square button for a single Lucide icon (toolbar/row actions). */
function IconButton({
  icon,
  variant = "ghost",
  size = "md",
  label,
  disabled = false,
  style,
  ...rest
}) {
  const sizes = {
    sm: 30,
    md: 36,
    lg: 42
  };
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20
  };
  const dim = sizes[size] || sizes.md;
  const variants = {
    ghost: {
      background: "transparent",
      color: "var(--text-muted)",
      border: "1px solid transparent"
    },
    secondary: {
      background: "var(--surface-card)",
      color: "var(--text-body)",
      border: "1px solid var(--border-default)"
    },
    soft: {
      background: "var(--brand-soft)",
      color: "var(--brand-active)",
      border: "1px solid var(--brand-soft-border)"
    },
    primary: {
      background: "var(--brand)",
      color: "#fff",
      border: "1px solid var(--brand)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label,
    disabled: disabled,
    style: {
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
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: iconSizes[size],
      height: iconSizes[size]
    }
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Text input with optional label, Lucide leading icon, and error state. */
function Input({
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
    sm: {
      height: 34,
      fontSize: "var(--text-sm)"
    },
    md: {
      height: 40,
      fontSize: "var(--text-base)"
    },
    lg: {
      height: 46,
      fontSize: "var(--text-md)"
    }
  };
  const s = sizes[size] || sizes.md;
  const reactId = React.useId();
  const inputId = id || reactId;
  const hasIcon = !!(icon || iconLeft);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, hasIcon && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      width: 17,
      height: 17,
      color: "var(--text-faint)",
      pointerEvents: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, iconLeft || /*#__PURE__*/React.createElement("i", {
    "data-lucide": icon,
    style: {
      width: 17,
      height: 17
    }
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    style: {
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
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = error ? "var(--danger)" : "var(--border-focus)";
      e.target.style.boxShadow = "var(--ring)";
    },
    onBlur: e => {
      e.target.style.borderColor = error ? "var(--danger)" : "var(--border-default)";
      e.target.style.boxShadow = "none";
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Select dropdown styled to match Input. Pass options as [{value,label}] or strings. */
function Select({
  label,
  hint,
  error,
  options = [],
  size = "md",
  id,
  style,
  containerStyle,
  ...rest
}) {
  const sizes = {
    sm: 34,
    md: 40,
    lg: 46
  };
  const reactId = React.useId();
  const inputId = id || reactId;
  const opts = options.map(o => typeof o === "string" ? {
    value: o,
    label: o
  } : o);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: inputId,
    style: {
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
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = "var(--border-focus)";
      e.target.style.boxShadow = "var(--ring)";
    },
    onBlur: e => {
      e.target.style.borderColor = error ? "var(--danger)" : "var(--border-default)";
      e.target.style.boxShadow = "none";
    }
  }, rest), opts.map(o => /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("i", {
    "data-lucide": "chevron-down",
    style: {
      position: "absolute",
      right: 12,
      width: 17,
      height: 17,
      color: "var(--text-faint)",
      pointerEvents: "none"
    }
  })), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Switch — on/off toggle. Use for binary settings (e.g. internal-note mode).
 */
function Switch({
  label,
  checked = false,
  disabled = false,
  onChange,
  id,
  style,
  ...rest
}) {
  const fieldId = id || `sw-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      flexShrink: 0,
      width: 38,
      height: 22,
      padding: 2,
      borderRadius: 'var(--radius-full)',
      background: checked ? 'var(--brand)' : 'var(--sand-400)',
      transition: 'background 160ms ease'
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "checkbox",
    id: fieldId,
    checked: checked,
    disabled: disabled,
    onChange: onChange,
    style: {
      position: 'absolute',
      opacity: 0,
      inset: 0,
      margin: 0,
      cursor: 'inherit'
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 18,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transform: checked ? 'translateX(16px)' : 'translateX(0)',
      transition: 'transform 160ms cubic-bezier(0.34,1.56,0.64,1)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-strong)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Multi-line text area, matched to Input styling. */
function Textarea({
  label,
  hint,
  error,
  rows = 4,
  id,
  style,
  containerStyle,
  ...rest
}) {
  const reactId = React.useId();
  const inputId = id || reactId;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...containerStyle
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: "var(--text-sm)",
      fontWeight: "var(--weight-medium)",
      color: "var(--text-body)"
    }
  }, label), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    rows: rows,
    style: {
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
      ...style
    },
    onFocus: e => {
      e.target.style.borderColor = error ? "var(--danger)" : "var(--border-focus)";
      e.target.style.boxShadow = "var(--ring)";
    },
    onBlur: e => {
      e.target.style.borderColor = error ? "var(--danger)" : "var(--border-default)";
      e.target.style.boxShadow = "none";
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "var(--text-xs)",
      color: error ? "var(--danger)" : "var(--text-faint)"
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/helpdesk/PriorityBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const PRIO = {
  Low: {
    fg: 'var(--prio-low-fg)',
    bg: 'var(--prio-low-bg)',
    bars: 1,
    label: 'Low'
  },
  Medium: {
    fg: 'var(--prio-medium-fg)',
    bg: 'var(--prio-medium-bg)',
    bars: 2,
    label: 'Medium'
  },
  High: {
    fg: 'var(--prio-high-fg)',
    bg: 'var(--prio-high-bg)',
    bars: 3,
    label: 'High'
  },
  Urgent: {
    fg: 'var(--prio-urgent-fg)',
    bg: 'var(--prio-urgent-bg)',
    bars: 4,
    label: 'Urgent'
  }
};

/**
 * PriorityBadge — a ticket's priority with a 4-bar signal-strength glyph.
 * Maps Low / Medium / High / Urgent to the canonical warm palette.
 */
function PriorityBadge({
  priority = 'Medium',
  size = 'md',
  style,
  ...rest
}) {
  const p = PRIO[priority] || PRIO.Medium;
  const sizes = {
    sm: {
      font: 'var(--text-xs)',
      padding: '2px 9px',
      height: '20px',
      bar: 3
    },
    md: {
      font: 'var(--text-sm)',
      padding: '4px 11px',
      height: '26px',
      bar: 4
    }
  };
  const z = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      background: p.bg,
      color: p.fg,
      font: `var(--weight-semibold) ${z.font}/1 var(--font-sans)`,
      padding: z.padding,
      height: z.height,
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'flex-end',
      gap: '2px',
      height: z.bar * 2.6
    }
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: z.bar - 1,
      height: `${(i + 1) * 26}%`,
      borderRadius: '1px',
      background: 'currentColor',
      opacity: i < p.bars ? 1 : 0.25
    }
  }))), p.label);
}
Object.assign(__ds_scope, { PriorityBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/helpdesk/PriorityBadge.jsx", error: String((e && e.message) || e) }); }

// components/helpdesk/SlaIndicator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * SlaIndicator — surfaces a ticket's SLA state: time remaining, breached, or
 * escalated. Mirrors the API's SLA model (slaDueAt / isSlaBreached / isEscalated).
 */
function SlaIndicator({
  dueAt,
  breached = false,
  escalated = false,
  now = Date.now(),
  size = 'md',
  style,
  ...rest
}) {
  const due = dueAt ? new Date(dueAt).getTime() : null;
  const diffMs = due != null ? due - now : null;
  const isBreached = breached || diffMs != null && diffMs < 0;
  function humanize(ms) {
    const abs = Math.abs(ms);
    const h = Math.floor(abs / 3.6e6);
    const m = Math.floor(abs % 3.6e6 / 6e4);
    if (h >= 24) {
      const d = Math.floor(h / 24);
      return `${d}d ${h % 24}h`;
    }
    if (h >= 1) return `${h}h ${m}m`;
    return `${m}m`;
  }
  let fg, bg, label, icon;
  if (escalated) {
    fg = 'var(--red-500)';
    bg = 'var(--red-100)';
    label = 'Escalated';
    icon = '▲';
  } else if (isBreached) {
    fg = 'var(--red-500)';
    bg = 'var(--red-100)';
    label = diffMs != null ? `Breached ${humanize(diffMs)} ago` : 'SLA breached';
    icon = '●';
  } else if (diffMs != null && diffMs < 3.6e6) {
    fg = 'var(--amber-600)';
    bg = 'var(--amber-100)';
    label = `Due in ${humanize(diffMs)}`;
    icon = '●';
  } else {
    fg = 'var(--green-600)';
    bg = 'var(--green-100)';
    label = diffMs != null ? `Due in ${humanize(diffMs)}` : 'Within SLA';
    icon = '●';
  }
  const sizes = {
    sm: {
      font: 'var(--text-xs)',
      padding: '2px 9px 2px 8px',
      height: '20px'
    },
    md: {
      font: 'var(--text-sm)',
      padding: '4px 11px 4px 10px',
      height: '26px'
    }
  };
  const z = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: bg,
      color: fg,
      font: `var(--weight-semibold) ${z.font}/1 var(--font-sans)`,
      padding: z.padding,
      height: z.height,
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7em',
      lineHeight: 1
    }
  }, icon), label);
}
Object.assign(__ds_scope, { SlaIndicator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/helpdesk/SlaIndicator.jsx", error: String((e && e.message) || e) }); }

// components/helpdesk/StatusBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const STATUS = {
  Open: {
    fg: 'var(--status-open-fg)',
    bg: 'var(--status-open-bg)',
    label: 'Open'
  },
  InProgress: {
    fg: 'var(--status-inprogress-fg)',
    bg: 'var(--status-inprogress-bg)',
    label: 'In progress'
  },
  Resolved: {
    fg: 'var(--status-resolved-fg)',
    bg: 'var(--status-resolved-bg)',
    label: 'Resolved'
  },
  Closed: {
    fg: 'var(--status-closed-fg)',
    bg: 'var(--status-closed-bg)',
    label: 'Closed'
  }
};

/**
 * StatusBadge — renders a ticket's lifecycle status with the canonical
 * color mapping (Open / InProgress / Resolved / Closed).
 */
function StatusBadge({
  status = 'Open',
  size = 'md',
  style,
  ...rest
}) {
  const s = STATUS[status] || STATUS.Open;
  const sizes = {
    sm: {
      font: 'var(--text-xs)',
      padding: '2px 9px 2px 7px',
      height: '20px'
    },
    md: {
      font: 'var(--text-sm)',
      padding: '4px 11px 4px 9px',
      height: '26px'
    }
  };
  const z = sizes[size] || sizes.md;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      background: s.bg,
      color: s.fg,
      font: `var(--weight-semibold) ${z.font}/1 var(--font-sans)`,
      padding: z.padding,
      height: z.height,
      borderRadius: 'var(--radius-full)',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: '50%',
      background: 'currentColor',
      flexShrink: 0
    }
  }), s.label);
}
Object.assign(__ds_scope, { StatusBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/helpdesk/StatusBadge.jsx", error: String((e && e.message) || e) }); }

// components/layout/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Card surface — white, rounded, soft shadow. The base container of the system. */
function Card({
  padding = 20,
  interactive = false,
  elevation = "sm",
  children,
  style,
  ...rest
}) {
  const shadows = {
    none: "none",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)"
  };
  const PAD = {
    none: 0,
    sm: 14,
    md: 20,
    lg: 28
  };
  const pad = typeof padding === "number" ? padding : PAD[padding] ?? padding;
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: "var(--surface-card)",
      border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-lg)",
      boxShadow: shadows[elevation] ?? shadows.sm,
      padding: pad,
      transition: interactive ? "box-shadow var(--duration-normal) var(--ease-out), transform var(--duration-normal) var(--ease-out), border-color var(--duration-normal) var(--ease-out)" : undefined,
      cursor: interactive ? "pointer" : undefined,
      ...style
    },
    onMouseEnter: interactive ? e => {
      e.currentTarget.style.boxShadow = "var(--shadow-md)";
      e.currentTarget.style.borderColor = "var(--border-default)";
      e.currentTarget.style.transform = "translateY(-1px)";
    } : undefined,
    onMouseLeave: interactive ? e => {
      e.currentTarget.style.boxShadow = shadows[elevation] ?? shadows.sm;
      e.currentTarget.style.borderColor = "var(--border-subtle)";
      e.currentTarget.style.transform = "none";
    } : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/Card.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tabs — underline style. Controlled via `value`/`onChange`, or uncontrolled. */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style,
  ...rest
}) {
  const items = tabs.map(t => typeof t === "string" ? {
    value: t,
    label: t
  } : t);
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const active = isControlled ? value : internal;
  const select = v => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: "flex",
      gap: 4,
      borderBottom: "1px solid var(--border-subtle)",
      ...style
    }
  }, rest), items.map(t => {
    const on = t.value === active;
    return /*#__PURE__*/React.createElement("button", {
      key: t.value,
      onClick: () => select(t.value),
      style: {
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
        transition: "color var(--duration-fast) var(--ease-out)"
      }
    }, t.icon && /*#__PURE__*/React.createElement("i", {
      "data-lucide": t.icon,
      style: {
        width: 16,
        height: 16
      }
    }), t.label, t.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: "var(--text-xs)",
        fontWeight: "var(--weight-semibold)",
        color: on ? "var(--brand-active)" : "var(--text-faint)",
        background: on ? "var(--brand-soft)" : "var(--surface-sunken)",
        borderRadius: "var(--radius-pill)",
        padding: "1px 7px"
      }
    }, t.count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 8,
        right: 8,
        bottom: -1,
        height: 2,
        borderRadius: "2px 2px 0 0",
        background: on ? "var(--brand)" : "transparent"
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent-console/Sidebar.jsx
try { (() => {
/* Left navigation rail for the agent console. */
function Sidebar({
  active,
  onNavigate,
  counts
}) {
  const {
    Avatar
  } = window.DS;
  const nav = [{
    key: 'inbox',
    label: 'Inbox',
    icon: 'inbox',
    count: counts.open + counts.inprogress
  }, {
    key: 'escalated',
    label: 'Escalated',
    icon: 'alert-triangle',
    count: counts.escalated
  }, {
    key: 'resolved',
    label: 'Resolved',
    icon: 'check-circle-2',
    count: null
  }, {
    key: 'agents',
    label: 'Agents',
    icon: 'users',
    count: null
  }, {
    key: 'reports',
    label: 'Reports',
    icon: 'bar-chart-3',
    count: null
  }];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 232,
      flexShrink: 0,
      background: 'var(--surface-card)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 14px',
      gap: 24,
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-full.svg",
    height: "28",
    alt: "HelpDesk"
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, nav.map(n => {
    const on = active === n.key;
    return /*#__PURE__*/React.createElement("button", {
      key: n.key,
      onClick: () => onNavigate(n.key),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        width: '100%',
        padding: '9px 12px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: on ? 'var(--brand-soft)' : 'transparent',
        color: on ? 'var(--brand-soft-fg)' : 'var(--text-body)',
        font: `var(--weight-${on ? 'semibold' : 'medium'}) var(--text-sm)/1 var(--font-sans)`,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 120ms ease'
      },
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.background = 'var(--surface-sunken)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: n.icon,
      size: 18,
      color: on ? 'var(--brand)' : 'var(--text-muted)'
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, n.label), n.count != null && n.count > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--weight-semibold) var(--text-xs)/1 var(--font-mono)',
        color: on ? 'var(--brand-soft-fg)' : 'var(--text-muted)',
        background: on ? 'rgba(194,94,60,0.14)' : 'var(--surface-sunken)',
        padding: '3px 7px',
        borderRadius: 'var(--radius-full)'
      }
    }, n.count));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 8px',
      borderTop: '1px solid var(--border-subtle)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: "Dana Okafor",
    role: "Agent",
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Dana Okafor"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-small)',
      color: 'var(--text-muted)'
    }
  }, "Agent"))));
}
Object.assign(window, {
  Sidebar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent-console/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent-console/TicketDetail.jsx
try { (() => {
/* Ticket detail slide-over: meta, description, comment thread, reply composer. */
function TicketDetail({
  ticket,
  comments,
  onClose,
  onReply
}) {
  const {
    Card,
    StatusBadge,
    PriorityBadge,
    SlaIndicator,
    Avatar,
    Badge,
    Button,
    Textarea,
    Select,
    IconButton,
    Checkbox
  } = window.DS;
  const [draft, setDraft] = React.useState('');
  const [internal, setInternal] = React.useState(false);
  if (!ticket) return null;
  const list = comments[ticket.id] || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 30,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(34,28,24,0.32)'
    }
  }), /*#__PURE__*/React.createElement("aside", {
    style: {
      position: 'relative',
      width: 520,
      maxWidth: '92%',
      height: '100%',
      background: 'var(--bg)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'slideIn 220ms cubic-bezier(0.22,0.61,0.36,1)'
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes slideIn { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }`), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 14,
      padding: '20px 22px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)',
      color: 'var(--text-faint)',
      marginBottom: 7
    }
  }, "#TK-", ticket.id), /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--font-h2)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, ticket.title)), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto',
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: ticket.status
  }), /*#__PURE__*/React.createElement(PriorityBadge, {
    priority: ticket.priority
  }), /*#__PURE__*/React.createElement(SlaIndicator, {
    dueAt: ticket.slaDueAt,
    breached: ticket.isSlaBreached,
    escalated: ticket.isEscalated,
    now: window.KIT_DATA.now
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral"
  }, ticket.category)), /*#__PURE__*/React.createElement(Card, {
    padding: "md"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: ticket.createdBy.fullName,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-strong)'
    }
  }, ticket.createdBy.fullName), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-small)',
      color: 'var(--text-muted)'
    }
  }, ticket.createdBy.email, " \xB7 ", timeAgo(ticket.createdAt)))), /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--font-body)',
      color: 'var(--text-body)',
      margin: 0
    }
  }, ticket.description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Assignee",
    containerStyle: {
      flex: 1
    },
    options: [{
      value: '',
      label: 'Unassigned'
    }, ...window.KIT_DATA.agents.map(a => ({
      value: String(a.id),
      label: a.fullName
    }))],
    defaultValue: ticket.assignedAgent ? String(ticket.assignedAgent.id) : ''
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Status",
    containerStyle: {
      flex: 1
    },
    options: ['Open', 'InProgress', 'Resolved', 'Closed'],
    defaultValue: ticket.status
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-caps)',
      fontSize: 11,
      marginBottom: 12
    }
  }, "Activity \xB7 ", list.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, list.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: c.author.fullName,
    role: c.author.role,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-label)',
      color: 'var(--text-strong)'
    }
  }, c.author.fullName), c.isInternal && /*#__PURE__*/React.createElement(Badge, {
    tone: "warning",
    size: "sm",
    icon: "lock"
  }, "Internal"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-small)',
      color: 'var(--text-faint)'
    }
  }, timeAgo(c.createdAt))), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-body)',
      color: 'var(--text-body)',
      background: c.isInternal ? 'var(--amber-100)' : 'var(--surface-card)',
      border: `1px solid ${c.isInternal ? 'transparent' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-md)',
      padding: '10px 13px'
    }
  }, c.body)))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-small)',
      color: 'var(--text-faint)',
      padding: '8px 0'
    }
  }, "No activity yet.")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Textarea, {
    rows: 2,
    placeholder: internal ? 'Add an internal note (agents only)…' : 'Reply to the customer…',
    value: draft,
    onChange: e => setDraft(e.target.value),
    style: internal ? {
      background: 'var(--amber-100)',
      borderColor: 'transparent'
    } : undefined
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Internal note",
    checked: internal,
    onChange: () => setInternal(!internal)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: onClose
  }, "Close"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    icon: "send",
    disabled: !draft.trim(),
    onClick: () => {
      onReply(ticket.id, draft, internal);
      setDraft('');
      setInternal(false);
    }
  }, internal ? 'Add note' : 'Send reply')))));
}
Object.assign(window, {
  TicketDetail
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent-console/TicketDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent-console/TicketInbox.jsx
try { (() => {
/* Ticket inbox: filter chips, stat tiles, and the ticket list. */
function StatTile({
  icon,
  label,
  value,
  tone
}) {
  const {
    Card
  } = window.DS;
  return /*#__PURE__*/React.createElement(Card, {
    padding: "sm",
    style: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 'var(--radius-md)',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: tone.bg,
      color: tone.fg
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 19,
    color: tone.fg
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--weight-bold) var(--text-xl)/1 var(--font-sans)',
      color: 'var(--text-strong)'
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-small)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, label)));
}
function TicketRow({
  t,
  onOpen
}) {
  const {
    Card,
    StatusBadge,
    PriorityBadge,
    SlaIndicator,
    Avatar,
    Badge
  } = window.DS;
  return /*#__PURE__*/React.createElement(Card, {
    interactive: true,
    padding: "none",
    onClick: () => onOpen(t),
    style: {
      padding: '14px 18px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--weight-medium) var(--text-xs)/1 var(--font-mono)',
      color: 'var(--text-faint)'
    }
  }, "#TK-", t.id), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--font-h3)',
      color: 'var(--text-strong)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, t.title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      font: 'var(--font-small)',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: t.createdBy.fullName,
    size: "xs"
  }), /*#__PURE__*/React.createElement("span", null, t.createdBy.fullName), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement(Badge, {
    tone: "neutral",
    size: "sm"
  }, t.category), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, timeAgo(t.createdAt)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(SlaIndicator, {
    dueAt: t.slaDueAt,
    breached: t.isSlaBreached,
    escalated: t.isEscalated,
    now: window.KIT_DATA.now,
    size: "sm"
  }), /*#__PURE__*/React.createElement(PriorityBadge, {
    priority: t.priority,
    size: "sm"
  }), /*#__PURE__*/React.createElement(StatusBadge, {
    status: t.status,
    size: "sm"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, t.assignedAgent ? /*#__PURE__*/React.createElement(Avatar, {
    name: t.assignedAgent.fullName,
    role: "Agent",
    size: "sm"
  }) : /*#__PURE__*/React.createElement("span", {
    title: "Unassigned",
    style: {
      width: 32,
      height: 32,
      borderRadius: '50%',
      border: '1.5px dashed var(--border-strong)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user-plus",
    size: 15,
    color: "var(--text-faint)"
  }))))));
}
function TicketInbox({
  tickets,
  counts,
  onOpen
}) {
  const {
    Badge
  } = window.DS;
  const [filter, setFilter] = React.useState('All');
  const filters = ['All', 'Open', 'In progress', 'Escalated', 'Resolved'];
  const shown = tickets.filter(t => {
    if (filter === 'All') return true;
    if (filter === 'Open') return t.status === 'Open';
    if (filter === 'In progress') return t.status === 'InProgress';
    if (filter === 'Escalated') return t.isEscalated;
    if (filter === 'Resolved') return t.status === 'Resolved' || t.status === 'Closed';
    return true;
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
      overflow: 'auto',
      height: '100%',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    icon: "inbox",
    label: "Open tickets",
    value: counts.open,
    tone: {
      bg: 'var(--terracotta-50)',
      fg: 'var(--terracotta-600)'
    }
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "loader",
    label: "In progress",
    value: counts.inprogress,
    tone: {
      bg: 'var(--blue-100)',
      fg: 'var(--blue-600)'
    }
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "alert-triangle",
    label: "Escalated",
    value: counts.escalated,
    tone: {
      bg: 'var(--red-100)',
      fg: 'var(--red-500)'
    }
  }), /*#__PURE__*/React.createElement(StatTile, {
    icon: "check-circle-2",
    label: "Resolved today",
    value: counts.resolved,
    tone: {
      bg: 'var(--green-100)',
      fg: 'var(--green-600)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, filters.map(f => {
    const on = filter === f;
    return /*#__PURE__*/React.createElement("button", {
      key: f,
      onClick: () => setFilter(f),
      style: {
        padding: '7px 14px',
        borderRadius: 'var(--radius-full)',
        cursor: 'pointer',
        border: `1px solid ${on ? 'transparent' : 'var(--border)'}`,
        background: on ? 'var(--charcoal-900)' : 'var(--surface-card)',
        color: on ? 'var(--cream-50)' : 'var(--text-body)',
        font: 'var(--weight-medium) var(--text-sm)/1 var(--font-sans)',
        transition: 'all 120ms ease'
      }
    }, f);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, shown.map(t => /*#__PURE__*/React.createElement(TicketRow, {
    key: t.id,
    t: t,
    onOpen: onOpen
  }))));
}
Object.assign(window, {
  TicketInbox,
  TicketRow
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent-console/TicketInbox.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent-console/Topbar.jsx
try { (() => {
/* Top bar: page title, search, new-ticket action. */
function Topbar({
  title,
  subtitle,
  onNew
}) {
  const {
    Button,
    Input
  } = window.DS;
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '18px 28px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--surface-card)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      font: 'var(--font-h2)',
      color: 'var(--text-strong)',
      margin: 0
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--font-small)',
      color: 'var(--text-muted)',
      marginTop: 2
    }
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 260
    }
  }, /*#__PURE__*/React.createElement(Input, {
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 16
    }),
    placeholder: "Search tickets\u2026"
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    iconLeft: /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 16,
      color: "#fff"
    }),
    onClick: onNew
  }, "New ticket"));
}
Object.assign(window, {
  Topbar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent-console/Topbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/agent-console/data.js
try { (() => {
/* Mock data for the HelpDesk agent console — shapes mirror the API's TicketReadDto. */
window.KIT_DATA = function () {
  const H = 3.6e6;
  const now = Date.now();
  const agents = [{
    id: 2,
    fullName: 'Dana Okafor',
    email: 'dana@helpdesk.local',
    role: 'Agent'
  }, {
    id: 3,
    fullName: 'Marcus Hale',
    email: 'marcus@helpdesk.local',
    role: 'Agent'
  }, {
    id: 4,
    fullName: 'Priya Raman',
    email: 'priya@helpdesk.local',
    role: 'Agent'
  }];
  const cust = (id, n, e) => ({
    id,
    fullName: n,
    email: e,
    role: 'Customer'
  });
  const tickets = [{
    id: 2048,
    title: 'VPN keeps dropping every few minutes',
    category: 'Network',
    description: 'The corporate VPN disconnects every few minutes on my machine. Restarting the client does not help and it happens across two laptops. It started this morning after the maintenance window.',
    status: 'Open',
    priority: 'High',
    createdBy: cust(11, 'Sam Liu', 'sam.liu@northwind.co'),
    assignedAgent: agents[0],
    createdAt: now - 2 * H,
    updatedAt: now - 30 * 6e4,
    slaDueAt: now + 2 * H,
    isEscalated: false,
    isSlaBreached: false
  }, {
    id: 2047,
    title: 'Cannot reset password — link expired',
    category: 'Account',
    description: 'Every password reset email link says it has expired the moment I click it. I have tried three times over the last hour.',
    status: 'InProgress',
    priority: 'Urgent',
    createdBy: cust(12, 'Rosa Méndez', 'rosa@brightpath.io'),
    assignedAgent: agents[1],
    createdAt: now - 5 * H,
    updatedAt: now - 1 * H,
    slaDueAt: now - 0.5 * H,
    isEscalated: true,
    isSlaBreached: true
  }, {
    id: 2046,
    title: 'Printer on 3rd floor offline',
    category: 'Hardware',
    description: 'The shared printer (HP-3F) shows offline for everyone on the third floor since yesterday afternoon.',
    status: 'Open',
    priority: 'Medium',
    createdBy: cust(13, 'Tomas Berg', 'tomas@northwind.co'),
    assignedAgent: null,
    createdAt: now - 20 * H,
    updatedAt: now - 20 * H,
    slaDueAt: now + 4 * H,
    isEscalated: false,
    isSlaBreached: false
  }, {
    id: 2045,
    title: 'Billing invoice shows wrong seat count',
    category: 'Billing',
    description: 'Our latest invoice lists 60 seats but we are on the 45-seat plan. Please correct and re-issue.',
    status: 'InProgress',
    priority: 'Medium',
    createdBy: cust(14, 'Aisha Khan', 'aisha@brightpath.io'),
    assignedAgent: agents[2],
    createdAt: now - 26 * H,
    updatedAt: now - 3 * H,
    slaDueAt: now + 0.4 * H,
    isEscalated: false,
    isSlaBreached: false
  }, {
    id: 2044,
    title: 'Onboarding new starter — laptop request',
    category: 'Hardware',
    description: 'New hire starts Monday and needs a standard developer laptop image and a monitor.',
    status: 'Resolved',
    priority: 'Low',
    createdBy: cust(15, 'Jordan Webb', 'jordan@northwind.co'),
    assignedAgent: agents[0],
    createdAt: now - 70 * H,
    updatedAt: now - 40 * H,
    resolvedAt: now - 40 * H,
    slaDueAt: now - 10 * H,
    isEscalated: false,
    isSlaBreached: false
  }, {
    id: 2043,
    title: 'Email signature not applying for the team',
    category: 'Account',
    description: 'The standard signature template is not being pushed to anyone in the sales team Outlook.',
    status: 'Closed',
    priority: 'Low',
    createdBy: cust(16, 'Lena Fischer', 'lena@brightpath.io'),
    assignedAgent: agents[1],
    createdAt: now - 96 * H,
    updatedAt: now - 80 * H,
    resolvedAt: now - 82 * H,
    slaDueAt: now - 24 * H,
    isEscalated: false,
    isSlaBreached: false
  }];
  const comments = {
    2048: [{
      id: 1,
      author: cust(11, 'Sam Liu', 'sam.liu@northwind.co'),
      body: 'It just dropped again while I was on a call. Really disruptive.',
      isInternal: false,
      createdAt: now - 1.5 * H
    }, {
      id: 2,
      author: agents[0],
      body: 'Thanks Sam — taking a look now. Can you confirm which VPN gateway you connect to?',
      isInternal: false,
      createdAt: now - 1 * H
    }, {
      id: 3,
      author: agents[0],
      body: 'Gateway GW-2 was flapping after the maintenance window. Escalating to network team.',
      isInternal: true,
      createdAt: now - 40 * 6e4
    }],
    2047: [{
      id: 4,
      author: cust(12, 'Rosa Méndez', 'rosa@brightpath.io'),
      body: 'Still cannot get in. This is now blocking my whole morning.',
      isInternal: false,
      createdAt: now - 2 * H
    }, {
      id: 5,
      author: agents[1],
      body: 'SLA breached — token TTL was misconfigured. Pushing a fix and will reset her link manually.',
      isInternal: true,
      createdAt: now - 50 * 6e4
    }]
  };
  const counts = {
    all: tickets.length,
    open: 2,
    inprogress: 2,
    escalated: 1,
    resolved: 1
  };
  return {
    agents,
    tickets,
    comments,
    counts,
    now
  };
}();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent-console/data.js", error: String((e && e.message) || e) }); }

// ui_kits/agent-console/util.jsx
try { (() => {
/* Small helpers shared across the agent console screens. */

// Lucide icon as a React element. Re-runs createIcons after each render.
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  strokeWidth = 1.75,
  style
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      ref.current.innerHTML = '';
      const el = document.createElement('i');
      el.setAttribute('data-lucide', name);
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: {
          width: size,
          height: size,
          'stroke-width': strokeWidth
        },
        nameAttr: 'data-lucide'
      });
    }
  });
  return React.createElement('span', {
    ref,
    style: {
      display: 'inline-flex',
      color,
      width: size,
      height: size,
      ...style
    }
  });
}
function timeAgo(ts) {
  const s = Math.floor((window.KIT_DATA.now - ts) / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
Object.assign(window, {
  Icon,
  timeAgo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/agent-console/util.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.PriorityBadge = __ds_scope.PriorityBadge;

__ds_ns.SlaIndicator = __ds_scope.SlaIndicator;

__ds_ns.StatusBadge = __ds_scope.StatusBadge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
