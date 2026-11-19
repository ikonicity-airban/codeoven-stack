---
name: magic-ui
description: Build delightful animated landing pages and micro-interactions using Magic UI components, Tailwind CSS, and Motion. Use when implementing animated bento grids, marquees, particle globes, shimmer buttons, and border beams.
---

# Magic UI Development Guide

Magic UI (`magicui.design`) provides animated, high-converting UI components for React, Next.js, and Tailwind CSS. It is designed to sit alongside shadcn/ui, giving developers drop-in animated components without writing complex WebGL or GSAP code from scratch.

## 1. Setup & Installation

Install dependencies:
```bash
npm i motion clsx tailwind-merge
```

Install components via the shadcn registry CLI:
```bash
npx shadcn@latest add "https://magicui.design/r/bento-grid"
npx shadcn@latest add "https://magicui.design/r/marquee"
npx shadcn@latest add "https://magicui.design/r/shimmer-button"
npx shadcn@latest add "https://magicui.design/r/border-beam"
npx shadcn@latest add "https://magicui.design/r/particles"
npx shadcn@latest add "https://magicui.design/r/number-ticker"
npx shadcn@latest add "https://magicui.design/r/blur-fade"
```

## 2. Core Component Catalog & Patterns

### 1. Animated Bento Grid
Combines modular layout spans with rich hover animations and interactive callouts:
```tsx
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { FileTextIcon, InputIcon } from "@radix-ui/react-icons";

const features = [
  {
    Icon: FileTextIcon,
    name: "Save files instantly",
    description: "Automatically index and synchronize project artifacts.",
    href: "/",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: <div className="absolute right-2 top-4 h-[300px] w-full opacity-60" />,
  },
  {
    Icon: InputIcon,
    name: "Full text search",
    description: "Search across millions of lines of code with zero latency.",
    href: "/",
    cta: "Explore search",
    className: "col-span-3 lg:col-span-2",
    background: <div className="absolute right-2 top-4 h-[300px] w-full opacity-60" />,
  },
];

export function FeatureSection() {
  return (
    <BentoGrid className="max-w-4xl mx-auto">
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
```

### 2. Smooth Infinite Marquee
GPU-accelerated horizontal or vertical infinite ticker for customer logos or reviews:
```tsx
import { Marquee } from "@/components/ui/marquee";

export function LogoCloud() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
      <Marquee pauseOnHover className="[--duration:20s]">
        {/* Brand logos or customer reviews */}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
```

### 3. Shimmer Button & Border Beam
- **Shimmer Button:** High-visibility CTA button featuring an internal sweeping highlight gradient.
- **Border Beam:** Animated laser light beam tracing the boundary of cards, modals, or mockups.

## 3. Best Practices
- **Performance:** Keep animation duration between 15s-30s for continuous marquees to ensure silky smooth 60fps rendering without CPU spikes.
- **Fades:** Use `BlurFade` for staggered list and grid entrances (`delay={0.25 + idx * 0.05}`).
