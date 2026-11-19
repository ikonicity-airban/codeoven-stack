---
name: aceternity-ui
description: Build high-impact animated React/Next.js interfaces, 3D cards, beam effects, and spotlights with Aceternity UI, Tailwind CSS, and Motion (Framer Motion). Use when designing interactive landing pages, heroes, feature grids, or eye-catching micro-interactions.
---

# Aceternity UI Development Guide

Aceternity UI (`ui.aceternity.com`) provides animated, high-polish UI components built on **Next.js**, **Tailwind CSS**, and **Motion** (`motion/react` or `framer-motion`). They are consumed via a copy-paste component architecture using the `shadcn` CLI registry.

## 1. Setup & Installation

### Core Dependencies
Ensure the project has the required animation and styling packages:
```bash
npm i motion clsx tailwind-merge tailwindcss-animate
# or legacy framer-motion:
npm i framer-motion clsx tailwind-merge
```

### Utility Helper (`lib/utils.ts`)
```ts
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Installing Components via CLI
Components are installed directly through the shadcn registry CLI:
```bash
npx shadcn@latest add "https://ui.aceternity.com/r/spotlight"
npx shadcn@latest add "https://ui.aceternity.com/r/3d-card"
npx shadcn@latest add "https://ui.aceternity.com/r/background-beams"
npx shadcn@latest add "https://ui.aceternity.com/r/bento-grid"
```

## 2. Core Component Catalog & Patterns

### 1. Spotlight Hero Header
Creates an elliptical radial gradient spotlight that follows or accents the headline:
```tsx
import { Spotlight } from "@/components/ui/spotlight";

export function HeroSpotlight() {
  return (
    <div className="h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
          Supercharge Your Product
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
          Production-grade components crafted with meticulous animation physics.
        </p>
      </div>
    </div>
  );
}
```

### 2. 3D Card Effect
Uses pointer-tracking transform matrices for depth and parallax:
```tsx
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export function InteractiveFeatureCard() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
          Make things float in 3D space
        </CardItem>
        <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Hover over this card to unleash the perspective power of Aceternity 3D.
        </CardItem>
        <CardItem translateZ="100" className="w-full mt-4">
          <img src="/feature-mockup.png" className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl" alt="thumbnail" />
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}
```

### 3. Background Beams & Canvas Reveal
- **Background Beams:** Ambient SVG light paths intersecting behind hero content.
- **Canvas Reveal Effect:** Interactive WebGL shader effect revealing colors on hover.
- **Rule:** Always set `pointer-events-none` on decorative canvas or beam layers so buttons and text beneath remain clickable.

## 3. Performance & Accessibility Guardrails

1. **Hardware Acceleration:** Ensure 3D layers use `transform-gpu` to offload calculations to the compositor thread.
2. **Mobile Viewports:** Canvas shaders and heavy particle calculations should be hidden or paused on small screens (`hidden md:block`) to prevent battery drain.
3. **Reduced Motion:** Always respect `prefers-reduced-motion`. If reduced motion is active, render the static state of the component without continuous looping transforms.
4. **Z-Index Layering:** Explicitly assign `z-0` to background effects and `relative z-10` to interactive content.
