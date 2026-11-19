---
name: flutter-apps
description: Build natively compiled mobile, desktop, and web applications using Google Flutter and Dart. Use when creating Flutter widget hierarchies, Riverpod state management, custom painters, and cross-platform layouts.
---

# Flutter & Dart Architecture Guide

Best practices for building scalable, high-performance Flutter applications.

## 1. Architectural Foundation & State Management (Riverpod)
- Separate UI widgets from business logic providers.
- Use `ConsumerWidget` or `ConsumerStatefulWidget` for reactive UI updates.

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final counterProvider = StateProvider<int>((ref) => 0);

class CounterScreen extends ConsumerWidget {
  const CounterScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Riverpod Counter')),
      body: Center(
        child: Text('Count: $count', style: Theme.of(context).textTheme.headlineMedium),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(counterProvider.notifier).state++,
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

## 2. Responsive UI & Custom Animation
- Use `LayoutBuilder` and MediaQuery breakpoints for mobile, tablet, and desktop views.
- Use `CustomPaint` with `CustomPainter` for high-speed hardware-accelerated vector rendering.
