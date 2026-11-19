---
name: icon-design-systems
description: Design, architect, and optimize pixel-perfect SVG icon systems aligned to 16/24/32px grids. Use when building custom icon libraries, SVGO optimization passes, or accessible React icon wrappers.
---

# Icon Design Systems Guide

## 1. Pixel Grid Alignment
- Standard grid: **24×24px** with a **2px safe padding** boundary (effective 20×20 active artwork area).
- Align all control points to whole or half pixels to prevent fuzzy anti-aliasing on standard-DPI screens.
- Use uniform stroke weights (typically 1.5px or 2px) and consistent stroke joins (`stroke-linecap="round" stroke-linejoin="round"`).

## 2. Accessible Icon Component Wrapper
```tsx
export function Icon({ children, title, size = 24, className = "" }: { children: React.ReactNode; title?: string; size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : "presentation"}
      className={className}
    >
      {title && <title>{title}</title>}
      {children}
    </svg>
  );
}
```
