import React from 'react';

export interface SlaIndicatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** SLA due timestamp (ISO string or Date-parsable). */
  dueAt?: string | number | Date;
  /** Force breached state (mirrors API isSlaBreached). @default false */
  breached?: boolean;
  /** Ticket has been auto-escalated by the SLA job. @default false */
  escalated?: boolean;
  /** "Now" reference for the countdown, in ms. @default Date.now() */
  now?: number;
  /** Size. @default 'md' */
  size?: 'sm' | 'md';
}

/**
 * SLA state pill — green within SLA, amber when due soon, red when breached or escalated.
 *
 * @startingPoint section="HelpDesk" subtitle="SLA countdown / breach / escalation pill" viewport="700x150"
 */
export function SlaIndicator(props: SlaIndicatorProps): JSX.Element;
