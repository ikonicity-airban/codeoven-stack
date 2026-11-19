---
name: smooth-transitions
description: Implement seamless page transitions, shared element transitions, layout morphing, and DOM mount/unmount animations using the View Transitions API, Motion (Framer Motion) layoutId, and modern CSS @starting-style.
---

# Smooth Transitions & Layout Morphing Guide

This guide covers modern techniques for eliminating page flickers, orchestrating cross-view shared elements, and transitioning dynamically mounted elements.

---

## 1. Modern CSS `@starting-style` (Pure CSS Mount Animations)

Historically, animating elements transitioning from `display: none` to `display: block` required JavaScript timeouts or keyframe hacks. Modern CSS now supports `@starting-style` and `transition-behavior: allow-discrete`.

### Smooth Dialog / Dropdown Transition in Pure CSS
```css
/* The dialog or popover element */
.animated-dialog {
  display: none;
  opacity: 0;
  transform: scale(0.95) translateY(8px);
  transition: opacity 0.25s ease-out, transform 0.25s ease-out, display 0.25s allow-discrete, overlay 0.25s allow-discrete;
}

/* When open */
.animated-dialog[open] {
  display: block;
  opacity: 1;
  transform: scale(1) translateY(0);
}

/* The starting state when newly inserted or unhidden */
@starting-style {
  .animated-dialog[open] {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
}
```

---

## 2. Native View Transitions API (`document.startViewTransition`)

The View Transitions API creates seamless snapshot transitions between different DOM states or pages.

### Basic In-App State Transition
```ts
function changeView(newTheme: string) {
  if (!document.startViewTransition) {
    updateTheme(newTheme);
    return;
  }

  document.startViewTransition(() => {
    updateTheme(newTheme);
  });
}
```

### Shared Element Morphing via `view-transition-name`
To morph a card thumbnail from a list view into a full hero image on a detail page:
```css
/* On the list thumbnail */
.product-card-123 img {
  view-transition-name: product-hero-123;
}

/* On the detail page main image */
.product-detail-hero img {
  view-transition-name: product-hero-123;
}
```
The browser automatically captures snapshots of both elements, interpolates dimensions, position, and clipping, and animates between them seamlessly.

---

## 3. Motion (`framer-motion`) Shared Element `layoutId`

Within React/Next.js applications, Motion’s `layoutId` provides declarative shared layout transitions.

### 1. Sliding Navigation Tab Pill
```tsx
"use client";

import { useState } from "react";
import { motion } from "motion/react";

const tabs = ["Overview", "Features", "Analytics", "Settings"];

export function SlidingTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative px-4 py-2 text-sm font-medium rounded-lg text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-lg shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### 2. Card-to-Modal Expansion
```tsx
// List Item:
<motion.div layoutId={`card-${item.id}`} onClick={() => setSelected(item)}>
  <motion.h3 layoutId={`title-${item.id}`}>{item.title}</motion.h3>
</motion.div>

// Modal View:
<motion.div layoutId={`card-${selected.id}`} className="fixed inset-0 z-50 ...">
  <motion.h3 layoutId={`title-${selected.id}`}>{selected.title}</motion.h3>
</motion.div>
```

---

## 4. Next.js App Router Page Transitions

When orchestrating route transitions in Next.js:
- Use `app/template.tsx` instead of `app/layout.tsx` when you need animations to re-run on navigation.
- Keep duration between **150ms – 250ms** so user flow is not delayed.
- Pair with `frozen` router wrappers to prevent exit flicker when content unmounts.
