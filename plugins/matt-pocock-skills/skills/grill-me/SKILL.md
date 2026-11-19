---
name: grill-me
description: A relentless, interactive option-menu interview to sharpen and stress-test a plan or design.
---

Interview the user relentlessly to stress-test their plan or design using the **Interactive Option Menu** (`ask_question` tool).

Follow the procedure in [../grill-interactive/SKILL.md](../grill-interactive/SKILL.md):
1. Build the Design Tree & compute the Frontier.
2. Inspect the codebase for facts first (never ask the user for things you can read from the repo).
3. Dispatch rounds of multiple-choice questions via the native `ask_question` tool with `(Recommended)` answers and trade-offs.
4. Advance the frontier until all branches are settled, then produce the final Architectural Alignment Spec.
