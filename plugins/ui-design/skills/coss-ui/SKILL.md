---
name: coss-ui
description: Implement, style, and compose accessible React UI components using the Coss UI (cosscom/ui) design system built on Base UI primitives and Tailwind CSS. Use when building clean, product-grade interfaces, particle components, forms, dialogs, and enterprise web applications.
---

# Coss UI Development Guide

Coss UI (`cosscom/ui`) is the official design system for Cal.com and coss.com. It is built on unstyled **Base UI** primitives (from MUI) and styled with utility-first **Tailwind CSS**, emphasizing copy-paste modularity, accessibility, and high typographic rigor.

## 1. Architectural Foundation

- **Primitives Layer:** Built on [`@base-ui-components/react`](https://base-ui.com/react/components) rather than Radix UI. Base UI provides unstyled accessible functionality for dialogs, popovers, tooltips, select menus, switches, tabs, and sliders.
- **Styling Layer:** Pure Tailwind CSS with consistent design tokens for spacing, elevation, borders, and colors.
- **Class Merging:** Always use the `cn()` helper function (`clsx` + `tailwind-merge`) to compose class names and allow prop overrides.

## 2. Component Conventions & Particle Architecture

When implementing or porting components in the Coss UI pattern:

### Particle Naming & Signature
- **File naming:** `p-{component}-{N}.tsx` (e.g. `p-button-1.tsx`, `p-input-group-3.tsx`, `p-alert-dialog-2.tsx`).
- **Function export:** Always use a single default export named `Particle`:
  ```tsx
  export default function Particle() {
    return (
      <div className="flex items-center gap-2">
        {/* Component JSX */}
      </div>
    );
  }
  ```
- Never use named exports like `export function ParticleButton()` or export multiple components from a single particle file.

### "use client" Directive Rules
Only add `"use client";` at the top of the file when the component:
1. Uses React hooks (`useState`, `useEffect`, `useRef`, `useCallback`, etc.).
2. Uses interactive event handlers that modify state.
3. Accesses browser APIs (`window`, `document`, `localStorage`).
4. Consumes or provides React Context.

Do **NOT** add `"use client"` for purely stateless components or wrappers that only pass props down.

## 3. Typography & Design Rules

- **Font rendering:** Use `font-optical-sizing: auto` instead of hard-coded `opsz`.
- **Letter-spacing:** Never add manual letter-spacing or tracking adjustments (`tracking-*`) to UI text unless explicitly styled for all-caps section labels (`uppercase tracking-wider text-xs`).
- **Punctuation:** Always typeset typographic punctuation properly in user strings: curly quotes (`“`, `”`), apostrophes (`’`), and em/en dashes (`—`, `–`).
- **Heading balancing:** Use `text-balance` on titles and headlines to avoid single-word orphans.

## 4. Key Component Patterns

### Buttons & Actions
```tsx
import { Button } from "@/components/ui/button";

export function ActionGroup() {
  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm">Cancel</Button>
      <Button variant="default" size="sm">Save Changes</Button>
    </div>
  );
}
```

### Form Inputs with Groups & Addons
```tsx
export function DomainInput() {
  return (
    <div className="flex rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-zinc-950 dark:focus-within:ring-zinc-300">
      <span className="inline-flex items-center px-3 text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-lg">
        https://
      </span>
      <input
        type="text"
        placeholder="example.com"
        className="block w-full border-0 px-3 py-2 text-sm bg-transparent focus:outline-none"
      />
    </div>
  );
}
```

### Accessible Dialog / Modal (Base UI)
- Always manage focus trapping and backdrop dismissal.
- Always include an accessible `Dialog.Title` and `Dialog.Description` for screen readers.
- Never use `h-screen`; use `h-dvh` or modal flex containers with safe viewport bounds.
