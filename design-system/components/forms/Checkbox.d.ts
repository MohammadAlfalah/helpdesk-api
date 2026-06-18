import React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
}

/** Checkbox with terracotta fill — e.g. "Mark as internal note". */
export function Checkbox(props: CheckboxProps): JSX.Element;
