import React from "react";

export interface ToastProps {
  kind?: "info" | "success" | "warning" | "danger";
  title?: React.ReactNode;
  children?: React.ReactNode;
  /** Show a dismiss "×"; called on click. */
  onDismiss?: () => void;
  style?: React.CSSProperties;
}

/** Toast / inline notification — e.g. "Ticket #1042 escalated". */
export function Toast(props: ToastProps): JSX.Element;
