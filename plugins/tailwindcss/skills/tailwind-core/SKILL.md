---
name: tailwind-core
description: Core Tailwind CSS v4 & v3 runbook for component styling, utility-first layouts, responsive design, dark mode, animations, and clean class composition. Use whenever writing, styling, or refactoring UI components with Tailwind CSS.
---

# Tailwind CSS Core Development Guide

A practical reference and standard for writing production-ready, clean, and accessible UI components with Tailwind CSS (v4 & v3).

## 1. Modern Layout & Component Patterns

### Flexbox & Grid Primitives
- **Centering:** `flex items-center justify-center` or `grid place-items-center`.
- **Responsive Stack-to-Row:** `flex flex-col sm:flex-row items-start sm:items-center gap-4`.
- **Auto-fit Grid:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`.
- **Subgrid (v4):** `grid grid-rows-subgrid`.

### Spacing & Sizing Scale
- Use standard spacing multipliers: `p-4` (1rem), `p-6` (1.5rem), `gap-4` (1rem).
- Always use semantic container widths: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.
- Minimum touch targets for mobile: at least `min-h-[44px] min-w-[44px]` for interactive elements.

## 2. Colors, Theming & Dark Mode

### Tailwind v4 `@theme` (CSS-First)
In Tailwind v4, themes are declared directly in CSS rather than `tailwind.config.js`:
```css
@import "tailwindcss";

@theme {
  --color-primary-50: oklch(0.97 0.02 250);
  --color-primary-500: oklch(0.55 0.22 250);
  --color-primary-600: oklch(0.48 0.23 250);
  --font-display: "Inter", sans-serif;
}
```

### Semantic Dark Mode Patterns
- Pair light/dark utilities symmetrically:
  ```html
  <div class="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800">
    <h2 class="text-zinc-950 dark:text-white font-semibold">Title</h2>
    <p class="text-zinc-600 dark:text-zinc-400">Description text</p>
  </div>
  ```

## 3. Interactive States & Micro-Interactions

- **Hover & Focus States:**
  Always pair `:hover` with `:focus-visible` for keyboard navigation:
  `hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2`
- **Active & Disabled States:**
  `active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-150`
- **Group & Peer Hover:**
  - Parent: `group`, Child: `group-hover:translate-x-1 group-hover:text-primary-600`
  - Peer inputs: `peer`, Helper text: `peer-invalid:text-red-500 peer-focus:block`

## 4. Class Organization & Component Composition

1. **Ordering Convention:**
   - Layout / Positioning (`relative`, `absolute`, `flex`, `grid`, `block`)
   - Sizing & Box Model (`w-*`, `h-*`, `p-*`, `m-*`)
   - Typography (`font-*`, `text-*`, `tracking-*`, `leading-*`)
   - Backgrounds & Borders (`bg-*`, `border`, `rounded-*`)
   - Effects & Transforms (`shadow-*`, `opacity-*`, `scale-*`)
   - Transitions & State Variants (`transition-*`, `hover:*`, `focus:*`, `dark:*`)

2. **Component Variants with CVA (`class-variance-authority`):**
   ```ts
   import { cva, type VariantProps } from "class-variance-authority";

   export const buttonVariants = cva(
     "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
     {
       variants: {
         variant: {
           default: "bg-blue-600 text-white hover:bg-blue-700",
           secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100",
           outline: "border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900",
           ghost: "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
         },
         size: {
           sm: "h-8 px-3 text-xs",
           md: "h-10 px-4 text-sm",
           lg: "h-12 px-6 text-base"
         }
       },
       defaultVariants: {
         variant: "default",
         size: "md"
       }
     }
   );
   ```

## 5. Performance & Quality Checks
- Prefer utility classes over arbitrary values (avoid `w-[237px]` unless strictly required).
- Never construct class names dynamically with string interpolation (`text-${color}-500`); Tailwind compiler will purge them. Always map full class strings.
