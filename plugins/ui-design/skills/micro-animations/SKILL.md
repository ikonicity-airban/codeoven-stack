---
name: micro-animations
description: Design and implement tactile, purpose-driven micro-interactions, spring physics, button feedback, hover effects, and interactive feedback using Motion (Framer Motion) and Tailwind CSS.
---

# Micro-Animations & Interaction Design Guide

Micro-animations give users immediate sensory feedback, reinforce spatial affordance, and elevate product craftsmanship from generic to delightful.

---

## 1. Principles & Duration Budgets

- **Immediate Acknowledgment:** Feedback must begin within **16ms** (1 frame) of user input.
- **Duration Budgets:**
  - Button presses / clicks: **100ms – 180ms**
  - Tooltips & badges: **150ms – 200ms**
  - Dropdowns & menus: **180ms – 250ms**
  - Modal dialogues & sheets: **250ms – 350ms**
- **Spring Over Linear:** Never use linear easing for physical interactions. Use spring physics with appropriate damping:
  - Snappy/Tactile (Buttons, switches): `{ stiffness: 400, damping: 25 }`
  - Smooth/Fluid (Modals, cards): `{ stiffness: 200, damping: 20 }`
  - Gentle/Bouncy (Badges, toasts): `{ stiffness: 300, damping: 15 }`

---

## 2. Interactive Component Patterns

### 1. Tactile Compression Button
```tsx
import { motion } from "motion/react";

export function TactileButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 20 }}
      onClick={onClick}
      className="px-5 py-2.5 rounded-xl font-medium bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm hover:shadow-md transition-shadow"
    >
      {children}
    </motion.button>
  );
}
```

### 2. Magnetic Cursor-Attraction Button
Button gently translates toward the cursor when hovering nearby:
```tsx
"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.3;
    const y = (clientY - (top + height / 2)) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-lg hover:shadow-blue-500/25"
    >
      {children}
    </motion.button>
  );
}
```

### 3. Stateful Loading-to-Success Morph
Transitions smoothly without layout jumping:
```tsx
import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2 } from "lucide-react";

export function StateButton({ status }: { status: "idle" | "loading" | "success" }) {
  return (
    <button className="relative h-10 px-6 rounded-lg bg-neutral-900 text-white font-medium overflow-hidden">
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            Submit
          </motion.span>
        )}
        {status === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </motion.span>
        )}
        {status === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 text-emerald-400"
          >
            <Check className="w-4 h-4" />
            Complete
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
```

### 4. Interactive Input Feedback (Error Shake)
```tsx
export const shakeVariant = {
  idle: { x: 0 },
  error: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 },
  },
};
```

---

## 3. Best Practices
- Never animate font sizes directly; use `scale` transforms to prevent subpixel layout thrashing.
- Always bundle `pointer-events-none` on animated decorative overlay layers.
- Limit layout triggers: avoid animating CSS `margin`, `padding`, `width`, or `height`.
