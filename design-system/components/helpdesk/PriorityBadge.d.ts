import React from 'react';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface PriorityBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Ticket priority. @default 'Medium' */
  priority?: TicketPriority;
  /** Size. @default 'md' */
  size?: 'sm' | 'md';
}

/** Ticket-priority pill with a 4-bar signal-strength glyph. */
export function PriorityBadge(props: PriorityBadgeProps): JSX.Element;
