import React from "react";

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  /** Options as strings or {value,label} objects. */
  options?: Array<string | SelectOption>;
  size?: "sm" | "md" | "lg";
  containerStyle?: React.CSSProperties;
}

/** Native select with custom chevron — status, priority, category, assignee. */
export function Select(props: SelectProps): JSX.Element;
