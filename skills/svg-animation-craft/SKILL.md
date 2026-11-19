---
name: svg-animation-craft
description: Create scalable SVG graphics, kinetic path-drawing animations, SMIL, CSS keyframe morphs, and GSAP vector sequences. Use when building animated logos, illustrated graphics, or interactive vector UI.
---

# SVG Animation & Vector Craft Guide

## 1. Vector Geometry & `viewBox` Rules
- **Scalable coordinate system:** Always define `viewBox="0 0 W H"` and omit hardcoded `width`/`height` on the SVG element so it scales fluidly with CSS.
- **Path structure:** Combine distinct layers into grouped tags (`<g id="foreground">`) with semantic IDs for targeted animation.

## 2. Kinetic Line-Drawing Animation (Dashoffset Technique)
Animate paths appearing as if hand-drawn in real time:

```css
.animated-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-line 2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes draw-line {
  to {
    stroke-dashoffset: 0;
  }
}
```

## 3. Path Morphing with Motion / GSAP
When morphing one SVG path into another, ensure both paths share identical anchor point counts or use morphing libraries:
```tsx
import { motion } from "motion/react";

export function MorphingMenuIcon({ isOpen }: { isOpen: boolean }) {
  const hamburger = "M 4 6 L 20 6 M 4 12 L 20 12 M 4 18 L 20 18";
  const closeCross = "M 6 6 L 18 18 M 12 12 L 12 12 M 6 18 L 18 6";

  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 stroke-current stroke-2">
      <motion.path
        animate={{ d: isOpen ? closeCross : hamburger }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      />
    </svg>
  );
}
```
