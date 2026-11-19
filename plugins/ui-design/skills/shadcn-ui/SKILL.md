---
name: shadcn-ui
description: Architect, install, and customize production-grade components using shadcn/ui, Radix UI primitives, Tailwind CSS, and Lucide icons. Use when building clean component libraries, enterprise design systems, forms, dialogs, and data tables.
---

# shadcn/ui Architecture & Engineering Guide

shadcn/ui is the premier design system methodology for modern web development: accessible, fully owned React component source code built on **Radix UI** primitives and styled with **Tailwind CSS**.

## 1. Project Initialization & Architecture

### Setup & CLI
```bash
npx shadcn@latest init
```
This creates `components.json` in your project root, configuring paths for:
- Components: `@/components`
- UI Primitives: `@/components/ui`
- Lib/Utils: `@/lib/utils`
- Styles/CSS: `app/globals.css`

### Adding Components
```bash
# Add specific components
npx shadcn@latest add button dialog dropdown-menu input select form table card

# Add all components non-interactively
npx shadcn@latest add -y --all
```

## 2. Core Concepts & Conventions

### The `cn()` Utility
All components rely on `lib/utils.ts` to cleanly merge Tailwind utilities:
```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Component Variants with CVA (`class-variance-authority`)
Every primitive exposes typed variants for styling flexibility:
```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

## 3. High-Value Implementation Patterns

### 1. Robust Type-Safe Forms with Zod
Combine `react-hook-form`, `@hookform/resolvers/zod`, and shadcn `Form` primitives:
```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
});

export function EmailForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="developer@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Subscribe</Button>
      </form>
    </Form>
  );
}
```

### 2. Accessible Modals with Focus Management
Always pair `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, and `DialogDescription`:
```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your personal profile and notification preferences.
          </DialogDescription>
        </DialogHeader>
        {/* Content here */}
      </DialogContent>
    </Dialog>
  );
}
```

## 4. Theming, CSS Variables & Dark Mode

- **CSS Variables:** Colors are mapped in CSS as semantic roles (`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--card`, `--border`, `--ring`).
- **Dark Mode:** Integrated seamlessly with `next-themes` via a `ThemeProvider` setting the `.dark` class on `<html>`.
