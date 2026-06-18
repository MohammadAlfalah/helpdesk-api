import React from "react";

export interface AvatarProps {
  /** Full name — drives initials and the deterministic background color. */
  name?: string;
  /** Optional image URL; falls back to initials. */
  src?: string;
  /** Pixel diameter (number) or a named size: xs/sm/md/lg/xl. */
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  /** "Agent" shows a small terracotta presence dot. */
  role?: "Agent" | "Customer";
  style?: React.CSSProperties;
}

/** Round user avatar — initials on a deterministic warm color, or an image. */
export function Avatar(props: AvatarProps): JSX.Element;
