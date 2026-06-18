import React from "react";

export interface TabItem { value: string; label: string; icon?: string; count?: number; }

export interface TabsProps {
  /** Tabs as strings or {value,label,icon?,count?} objects. */
  tabs?: Array<string | TabItem>;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  style?: React.CSSProperties;
}

/** Underline tabs with optional icon + count — e.g. ticket status filters. */
export function Tabs(props: TabsProps): JSX.Element;
