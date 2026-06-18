import React from "react";

export type BadgeTone = "neutral" | "brand" | "info" | "warning" | "success" | "danger";

export interface BadgeProps {
  tone?: BadgeTone;
  /** Leading status dot. */
  dot?: boolean;
  /** Lucide icon name. */
  icon?: string;
  size?: "sm" | "md";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Generic labelled pill — categories, counts, tags. For ticket status &
 * priority use StatusBadge / PriorityBadge instead.
 *
 * @startingPoint section="Feedback" subtitle="Generic labelled pills" viewport="700x150"
 */
export function Badge(props: BadgeProps): JSX.Element;
