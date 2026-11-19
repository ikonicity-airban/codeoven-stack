---
name: agentic-workflows
description: Architect durable, autonomous AI agents and multi-agent workflows using tool calling, structured outputs (Zod), prompt chaining, and evaluation loops. Use when designing LLM agents, chatbot backends, or autonomous pipelines.
---

# Agentic Workflows & Multi-Agent Architecture

Patterns for creating reliable, production-grade AI agents that execute tools and solve complex multi-step problems.

## 1. The Autonomous Agent Loop
1. **Thought & Plan:** The agent analyzes user intent and current state.
2. **Action (Tool Call):** Invokes typed tools validated with strict schemas (e.g. Zod).
3. **Observation:** Receives real tool output (data, errors, or environmental state).
4. **Reflection / Synthesis:** Evaluates whether the objective is satisfied or requires follow-up actions.

## 2. Guardrails & Structured Output
- Always define tool arguments with JSON Schema or Zod.
- Never let an LLM output loose free-form strings when structured JSON is required for downstream services.
- Provide explicit error feedback to the model on tool failure so it can self-correct.
