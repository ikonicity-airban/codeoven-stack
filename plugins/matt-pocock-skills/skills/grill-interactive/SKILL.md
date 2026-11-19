---
name: grill-interactive
description: Relentlessly interview and stress-test the user's plan, architecture, or idea using native interactive multi-choice option menus (via the ask_question tool) instead of plain-text questionnaires. Use whenever the user asks to grill, stress-test, or align on a plan interactively.
---

# Interactive Grilling (Option Menu Flow)

Transforms Matt Pocock's relentless "Grill Me" interrogation into an interactive, GUI-driven decision tree using the native `ask_question` option menu.

## Core Philosophy

1. **The Design Tree:** Every high-level architectural decision branches into sub-decisions.
2. **The Frontier:** The set of immediate architectural forks whose prerequisites are already settled.
3. **Interactive Menu via `ask_question`:** Never force the user to type answers to multiple-choice architectural dilemmas in plain text. Group each round of the frontier into structured, interactive multiple-choice questions with clear recommendations and trade-offs.
4. **Fact-Finding First:** The agent must inspect the repository (dependencies, files, APIs, configs) itself before asking. Never ask the user for facts you can determine from code; only ask for decisions, priorities, and trade-offs.

---

## The Interactive Grilling Loop

### Step 1: Map the Design Tree & Identify the Frontier
Analyze the user's proposal, plan, or idea. Identify:
- Core architecture & tech stack choices
- Data modeling & state management boundaries
- User flows & edge-case handling
- Performance, security, and migration constraints

Determine which decisions are the **prerequisites** (e.g., database choice comes before ORM/query builder; state strategy comes before component prop drills). The current **frontier** consists of all unblocked, top-level decisions.

---

### Step 2: Dispatch the Interactive Option Menu (`ask_question`)
For the current frontier, call the `ask_question` tool with up to 3–4 questions at a time:

#### Formatting Rules for `ask_question`:
- **`question`**: Concise, focused question title and context (without "select all that apply").
- **`options`**: 2 to 4 distinct, concrete choices:
  - First option MUST be prefixed with `(Recommended)` and explain *why* it's the strongest default (e.g., `(Recommended) Supabase Postgres with Drizzle ORM - typed, lightweight, and supports existing migrations`).
  - Remaining options represent valid alternatives with trade-offs.
  - Do NOT include an "Other" option in the array (the UI automatically appends one).
  - Do NOT include numbers like "1." or "A." (the UI formats and numbers them).
- **`is_multi_select`**: Set to `true` only when options are non-exclusive features or orthogonal requirements; set to `false` for architectural forks.

---

### Step 3: Ingest Choices & Branch Downward
When the user submits their choices through the interactive menu:
1. Acknowledge and lock in the settled decisions.
2. If the user typed a custom response via the "Other" field, incorporate it directly.
3. Advance the design tree: unblock child questions that depended on the newly settled choices.
4. If the frontier still has open decisions, immediately launch the next round of `ask_question`.

---

### Step 4: Conclude with an Aligned Architectural Spec
When the frontier is empty and all branches of the design tree have been explored:
1. Do not ask more questions.
2. Present a structured **Design Alignment Spec** summarizing:
   - **Settled Decisions:** The chosen path across every branch.
   - **Rejected Alternatives & Why:** Key trade-offs acknowledged.
   - **Concrete Next Steps:** Implementation breakdown ready for execution.
