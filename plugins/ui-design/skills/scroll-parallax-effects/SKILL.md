---
name: scroll-parallax-effects
description: Implement smooth momentum scrolling, scroll-linked animations, parallax depth layers, section pinning, and scrubbed timelines using Lenis, GSAP ScrollTrigger, Motion (Framer Motion), and native CSS scroll-driven animations.
---

# Scroll & Parallax Effects Guide

This guide details patterns for creating smooth momentum scrolling, scroll-linked animations, parallax depth layers, and section pinning.

---

## 1. Smooth Momentum Scroll: Lenis + GSAP ScrollTrigger

When momentum scrolling (Lenis) and scrubbed animations (GSAP ScrollTrigger) are used together, **Lenis must own the scroll position and GSAP's ticker must drive Lenis** to eliminate micro-jitter and desynchronized pinning.

### Setup Pattern (Next.js / React)

```tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    // 2. Synchronize Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Drive Lenis with GSAP's internal high-precision ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000); // GSAP seconds to milliseconds
    };
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // 4. Cleanup
    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
```

### GSAP Pinning & Scrubbing Rules
1. **Never Pin the Animated Element:** Pin an outer wrapper (`pin: true`), and animate an inner container or child elements.
2. **Scrub vs. Toggle:** Use `scrub: 1` (or `scrub: true`) for progress linked directly to scroll position. Use `toggleActions` for trigger-once entrances. Never mix both.
3. **Scoping & Cleanup:** In React components, always wrap ScrollTrigger logic in `gsap.context((self) => { ... }, containerRef)` to clean up on unmount.

---

## 2. Motion / Framer Motion Parallax Layers

Use `useScroll` and `useTransform` to create layered depth where backgrounds, midgrounds, and foregrounds move at differential speeds.

### Multi-Layer Parallax Hero

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"], // from container at top to container leaving top
  });

  // Smooth out raw scroll with physics springs
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // Different layer speeds
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "40%"]);
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "-30%"]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[120vh] overflow-hidden bg-neutral-950">
      {/* Background layer: moves slowly downwards */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-neutral-950 to-neutral-950" />

      {/* Midground layer: floating graphics */}
      <motion.div style={{ y: midY }} className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-blue-500/20 blur-3xl opacity-50" />
      </motion.div>

      {/* Foreground layer: headlines that rise faster and fade out */}
      <motion.div style={{ y: textY, opacity }} className="relative z-10 flex flex-col items-center justify-center h-screen px-4 text-center">
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tight">
          Spatial Depth
        </h1>
        <p className="mt-6 text-xl text-neutral-400 max-w-xl">
          Multi-speed parallax creates tangible dimensional hierarchy.
        </p>
      </motion.div>
    </div>
  );
}
```

---

## 3. Native CSS Scroll-Driven Animations (Zero-JS)

Modern browsers support declarative scroll animations entirely in CSS with zero thread-locking JavaScript.

### Scroll Progress Timeline (`scroll()`)
```css
/* Top reading progress indicator */
.scroll-progress-bar {
  transform-origin: left;
  animation: grow-progress auto linear;
  animation-timeline: scroll();
}

@keyframes grow-progress {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
```

### Element View Visibility Timeline (`view()`)
Animates an element based on its entry and exit within the viewport:
```css
.fade-in-on-scroll {
  animation: reveal-view linear both;
  animation-timeline: view();
  animation-range: entry 15% cover 40%;
}

@keyframes reveal-view {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

---

## 4. Performance & Mobile Guardrails

1. **Hardware Acceleration:** Only animate compositor properties (`transform`, `opacity`). Never animate `top`, `margin`, or `padding` with scroll.
2. **Mobile Optimization:** On mobile viewports (`max-width: 768px`), disable aggressive parallax (clamp transform distances) to avoid mobile scroll desync or rubber-band hitching.
3. **Accessibility:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-timeline: none !important;
       transform: none !important;
     }
   }
   ```
