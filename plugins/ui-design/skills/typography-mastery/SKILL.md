---
name: typography-mastery
description: Architect production-grade typography systems with fluid scaling (clamp), modular scales, typographic rhythm, font pairing, OpenType features, text-balance, and web font performance optimization.
---

# Typography Systems & Engineering Mastery

Typography is the foundational structure of user interfaces. A mathematically sound, responsive typographic system establishes hierarchy, boosts comprehension, and conveys brand authority.

---

## 1. Fluid Typography Scaling with `clamp()`

Breakpoint-based font jumps (e.g. abrupt changes at `sm:`, `md:`, `lg:`) can feel unpolished. Fluid typography smoothly interpolates font size based on the active viewport.

### The Linear Fluid Formula
Given a minimum size $S_{min}$ at viewport $V_{min}$ and maximum size $S_{max}$ at viewport $V_{max}$:
$$\text{Rate} = \frac{S_{max} - S_{min}}{V_{max} - V_{min}}$$
$$\text{Offset} = S_{min} - (\text{Rate} \times V_{min})$$
$$\text{Fluid Size} = \text{clamp}(S_{min}, \text{Offset} + (\text{Rate} \times 100\text{vw}), S_{max})$$

### CSS Custom Properties & Tailwind Implementation
```css
:root {
  /* Fluid display scale: 32px at 375px viewport -> 64px at 1280px viewport */
  --font-fluid-display: clamp(2rem, 1.171rem + 3.536vw, 4rem);

  /* Fluid H1: 24px at 375px -> 40px at 1280px */
  --font-fluid-h1: clamp(1.5rem, 1.086rem + 1.768vw, 2.5rem);

  /* Fluid H2: 20px at 375px -> 30px at 1280px */
  --font-fluid-h2: clamp(1.25rem, 0.991rem + 1.105vw, 1.875rem);

  /* Fluid Body: 15px at 375px -> 17px at 1280px */
  --font-fluid-body: clamp(0.938rem, 0.886rem + 0.221vw, 1.063rem);
}
```

---

## 2. Typographic Rhythm & Readability

### 1. Optimal Measure (Line Length)
The ideal reading length for body copy is **45 to 75 characters per line** (including spaces).
- Use Tailwind's `max-w-prose` (65ch) for body containers:
```html
<article className="max-w-prose mx-auto text-neutral-700 dark:text-neutral-300 leading-relaxed">
  <p>Content maintains comfortable horizontal eye travel...</p>
</article>
```

### 2. Inverse Leading (Line Height Rule)
- **Headlines & Display:** As font size increases, line height must **decrease** (`leading-none` to `leading-tight`, ~1.0 to 1.15).
- **Body Text:** Standard body text needs comfortable vertical breathing room (`leading-normal` to `leading-relaxed`, ~1.5 to 1.65).
- **Small / UI Text:** Compact buttons, tooltips, and badges require snug leading (`leading-none` to `leading-tight`).

### 3. Orphan Prevention (`text-balance` & `text-pretty`)
- **Headings:** Always use `text-balance` to distribute lines evenly and eliminate awkward hanging single-word orphans.
- **Body Copy:** Use `text-pretty` for natural, typographically sound line breaks.

---

## 3. OpenType & Advanced Variable Font Features

Modern system and web fonts contain OpenType feature flags that dramatically improve interface legibility:

### Tabular Numbers (`tabular-nums`)
Always apply `tabular-nums` to timers, financial tables, counters, and statistics so numerical digits share identical monospaced widths and do not jitter when values update:
```html
<span className="font-mono tabular-nums text-2xl font-bold">
  {formatCurrency(balance)}
</span>
```

### OpenType Feature Flags
```css
.pro-typography {
  /* Enable standard ligatures, tabular numbers, slashed zero, contextual alternates */
  font-feature-settings: "cv02", "cv03", "cv04", "cv11", "tnum", "zero";
  font-optical-sizing: auto;
}
```

---

## 4. Next.js Web Font Performance (Zero Layout Shift)

```ts
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});
```
- `display: "swap"` prevents Flash of Invisible Text (FOIT).
- Automatically handles fallback font metric overrides (`ascent-override`, `descent-override`, `size-adjust`) to achieve a **0 Cumulative Layout Shift (CLS)** score.
