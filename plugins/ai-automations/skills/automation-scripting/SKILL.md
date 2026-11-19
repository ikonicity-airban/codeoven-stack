---
name: automation-scripting
description: Create headless web scrapers, automated scheduled tasks, data ingestion pipelines, and webhook responders using Playwright, Python, and Node.js.
---

# Task Automation & Data Pipelines

## 1. Headless Browser Automation (Playwright)
- Always wait for network idle or specific selector state rather than arbitrary sleep timers.
- Run headless by default with custom user agents to avoid bot blocks.

## 2. Scheduled Jobs & Error Handling
- Implement exponential backoff retries for third-party API dependencies.
- Ensure idempotent execution so repeated triggers do not duplicate state.
