import React from 'react';

export type TicketStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Ticket lifecycle status. @default 'Open' */
  status?: TicketStatus;
  /** Size. @default 'md' */
  size?: 'sm' | 'md';
}

/**
 * Canonical ticket-status pill (Open / In progress / Resolved / Closed).
 *
 * @startingPoint section="HelpDesk" subtitle="Ticket status & priority pills" viewport="700x150"
 */
export function StatusBadge(props: StatusBadgeProps): JSX.Element;
