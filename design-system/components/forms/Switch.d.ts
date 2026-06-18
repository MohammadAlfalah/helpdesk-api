import React from 'react';

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Label next to the toggle. */
  label?: string;
  /** On/off state. @default false */
  checked?: boolean;
}

/** On/off toggle for binary settings. */
export function Switch(props: SwitchProps): JSX.Element;
