---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea using an interactive option menu. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

# Grilling (Interactive Option Menu Flow)

Interview the user relentlessly until you reach a shared understanding. Map this as a **design tree**: every decision branches into the decisions that hang off it.

Work the tree in **rounds**. The **frontier** is every decision whose prerequisites are already settled: the questions you can ask _now_ without guessing at answers you haven't heard yet.

## Interactive Dispatch via `ask_question`

Instead of asking questions in plain text, **always use the native `ask_question` tool** to present the round as an interactive multi-choice option menu:

1. **Group the Frontier:** Bundle up to 3–4 open frontier decisions into a single `ask_question` call.
2. **Options Format:**
   - Lead each question with a recommended default prefixed with `(Recommended)` and a brief rationale.
   - Supply 2–4 distinct, actionable architectural choices per question.
   - Do NOT include an "Other" option (the UI provides this automatically).
   - Set `is_multi_select: false` for architectural forks, or `true` for non-exclusive feature sets.
3. **Fact-Finding Rule:** Never ask the user for environmental facts (dependencies, files, configuration) you can determine yourself. Inspect the workspace or dispatch subagents; only ask the user for *decisions*.

## Advancing the Tree

Each time the user submits their choices through the interactive menu:
1. Recompute the frontier: settled decisions unblock child questions.
2. Launch the next round of `ask_question` until every branch of the design tree is visited.
3. When the frontier is empty, summarize the shared understanding in an Architectural Alignment Spec before acting.
