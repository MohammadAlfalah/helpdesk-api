import React from "react";

export interface CardProps {
  /** Inner padding: px number, a named size (none/sm/md/lg), or any CSS padding string. */
  padding?: number | "none" | "sm" | "md" | "lg" | string;
  /** Adds hover lift + pointer cursor. */
  interactive?: boolean;
  elevation?: "none" | "sm" | "md" | "lg";
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * Base surface — white, rounded, soft warm shadow. Everything in HelpDesk
 * sits on a Card: ticket rows, detail panels, stat tiles.
 *
 * @startingPoint section="Layout" subtitle="Card surface with elevation levels" viewport="700x200"
 */
export function Card(props: CardProps): JSX.Element;
