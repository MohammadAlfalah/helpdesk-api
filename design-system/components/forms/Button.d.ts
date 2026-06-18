import React from "react";

export interface ButtonProps {
  /** Visual style. */
  variant?: "primary" | "secondary" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
  /** Lucide icon name shown before the label. */
  icon?: string;
  /** A ready React node for the leading icon (takes precedence over `icon`). */
  iconLeft?: React.ReactNode;
  /** Lucide icon name OR React node shown after the label. */
  iconRight?: string | React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Primary action button for HelpDesk. Terracotta primary, soft secondary,
 * ghost for low-emphasis, danger for destructive actions.
 *
 * @startingPoint section="Forms" subtitle="Buttons in every variant & size" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
