---
name: expo-mobile
description: Architect and develop production cross-platform mobile apps with Expo and React Native. Use when implementing Expo Router, NativeWind (Tailwind), gesture handlers, Reanimated animations, or EAS workflows.
---

# Expo & React Native Architecture Guide

Guide for building production iOS and Android apps using **Expo SDK** and **React Native**.

## 1. File-Based Routing (Expo Router)
Organize layouts and routes under `app/`:
```text
app/
├── _layout.tsx      # Root providers, navigation stack, theme provider
├── (tabs)/          # Bottom tab navigation group
│   ├── _layout.tsx
│   ├── index.tsx    # Home screen
│   └── profile.tsx  # User profile
├── (modals)/        # Modal stack screens (presentation: 'modal')
│   └── settings.tsx
└── [id].tsx         # Dynamic path routes
```

## 2. Performance & Styling with NativeWind
- **NativeWind v4:** Write pure Tailwind utility classes directly in React Native components:
```tsx
import { View, Text, Pressable } from "react-native";

export function MobileCard({ title, subtitle, onPress }: { title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="p-4 mx-4 my-2 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 active:opacity-80"
    >
      <Text className="text-xl font-bold text-neutral-950 dark:text-white">{title}</Text>
      <Text className="mt-1 text-sm text-neutral-500">{subtitle}</Text>
    </Pressable>
  );
}
```

## 3. High-Performance Lists & Gestures
- Use **Shopify FlashList** instead of standard FlatList for smooth 60fps scrolling on large data sets.
- Use **React Native Reanimated 3** for worklet-driven, UI-thread animations.
