import React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  hint?: string;
  /** Error message — also turns the field red. */
  error?: string;
  /** Lucide icon name shown inside the field, left-aligned. */
  icon?: string;
  /** A ready React node for the leading icon (takes precedence over `icon`). */
  iconLeft?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  containerStyle?: React.CSSProperties;
}

/** Single-line text field with label, hint/error, and optional leading icon. */
export function Input(props: InputProps): JSX.Element;
