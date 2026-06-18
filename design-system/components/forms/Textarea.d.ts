import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerStyle?: React.CSSProperties;
}

/** Multi-line text field, e.g. a ticket description or comment body. */
export function Textarea(props: TextareaProps): JSX.Element;
