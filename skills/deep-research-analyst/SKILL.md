---
name: deep-research-analyst
description: Autonomous multi-source technical and market research system. Formulates query vectors, audits primary sources (docs, RFCs, code, whitepapers), cross-examines contradictory claims, and synthesizes exhaustive, cite-backed intelligence reports.
---

# Deep Research Analyst Skill

A rigorous, evidence-first framework to conduct deep technical investigations, competitive benchmarking, and domain research with verifiable primary source citations.

---

## 1. Research Protocol: The 4-Stage Funnel

```
[1. Vector Decomposition]
   ├── Core Question: Break down into 3-5 orthogonal query axes
   └── Source Taxonomy: Identify primary repositories, RFCs, official docs, release logs
           │
[2. Source Ingestion & Triangulation]
   ├── Primary: Official GitHub repos, API references, specifications, changelogs
   ├── Secondary: High-signal technical postmortems, maintainer interviews, engineering blogs
   └── Excluded: SEO spam, sponsored roundups, unverified regurgitated lists
           │
[3. Contradiction & Claim Verification]
   ├── Cross-examine marketing claims against actual GitHub issue trackers & benchmarks
   └── Pinpoint divergence between spec documentation and real-world behavior
           │
[4. Synthesis & Executive Briefing]
   └── Deliver structured, actionable reports with verbatim citations and comparison matrices
```

---

## 2. Query Axis Formulations

Never run generic one-shot searches. For any subject $X$, decompose queries into:

| Objective | Query Pattern Example | Target High-Signal Surface |
| :--- | :--- | :--- |
| **Ground Truth Architecture** | `"<subject>" architecture RFC specification filetype:md OR inurl:github` | Design specs, RFC proposals |
| **Real Performance & Limits** | `"<subject>" benchmark latency memory bottleneck site:github.com/issues` | Real developer complaints & edge cases |
| **Breaking & Recent Changes** | `"<subject>" "breaking changes" OR "changelog" 2025..2026` | Release tags, migration notes |
| **Alternative Trade-Offs** | `"<subject>" vs "<alternative>" trade-offs production postmortem` | Engineering engineering logs |

---

## 3. High-Signal Source Hierarchy

1. **Tier 1 (Authoritative Ground Truth)**:
   - Merged code, PR discussions, and commit diffs in core open-source repositories.
   - W3C, IETF, or language standards committees (ECMA, PEPs, RFCs).
   - Official API documentation and vendor status pages.
2. **Tier 2 (Empirical Evidence)**:
   - Reproducible benchmark suites with published datasets and methodology.
   - Verified production postmortems (e.g., Cloudflare, Stripe, Netflix tech blogs).
3. **Tier 3 (Contextual Opinions)**:
   - Senior maintainer talks, conference papers, Hacker News deep-dive threads.

---

## 4. Synthesis Output Architecture

Every deep research report must be delivered in this exact structure:

```markdown
# Deep Research Report: [Subject]

## Executive Summary
> [!NOTE]
> High-density 3-paragraph distillation of findings, bottom-line recommendations, and readiness state.

## Key Findings Matrix
| Capability / Axis | Option A | Option B | Evidence Citation |
| :--- | :--- | :--- | :--- |
| Throughput / Latency | ... | ... | [Link to Benchmark] |
| Production Maturity | ... | ... | [Link to Issue/RFC] |

## Technical Architecture & Underlying Mechanics
- How it actually works under the hood (data paths, memory models, protocols).

## Verifiable Trade-offs & Known Pitfalls
- Documented gotchas, performance regressions, and unmitigated bugs found in issue trackers.

## Actionable Recommendations
1. **Immediate Step**: Exact config or library recommendation.
2. **Migration / Adoption Path**: Step-by-step risk mitigation.
3. **Primary Source Appendix**: Bulleted clickable links to all consulted sources.
```
