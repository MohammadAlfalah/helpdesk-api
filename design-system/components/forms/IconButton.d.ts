import React from "react";

export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  variant?: "ghost" | "secondary" | "soft" | "primary";
  size?: "sm" | "md" | "lg";
  /** Accessible label (also the tooltip). */
  label?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Square single-icon button for toolbars and table-row actions. */
export function IconButton(props: IconButtonProps): JSX.Element;
