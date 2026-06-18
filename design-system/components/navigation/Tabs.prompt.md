Underline tabs with optional icon + count badge — ticket status filters, detail-panel sections.

```jsx
<Tabs tabs={[
  {value:"all", label:"All", count:128},
  {value:"open", label:"Open", count:42},
  {value:"mine", label:"Assigned to me", icon:"user", count:7},
]} defaultValue="all" />
```
