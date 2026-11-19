---
name: ebook-creator
description: Comprehensive framework for drafting, formatting, compiling, and publishing professional non-fiction and technical eBooks to EPUB, PDF, and Kindle KDP formats using Markdown, Pandoc, and Typst.
---

# Professional eBook Creator Skill

An end-to-end authoring and build system to turn ideas and research into polished, commercially viable eBooks and digital guides.

---

## 1. Product Structuring & Scope Architecture

| Book Type | Target Length | Pricing Sweet Spot | Best Formats | Primary Distribution |
| :--- | :--- | :--- | :--- | :--- |
| **Tactical Playbook / Field Guide** | 40 – 80 pages (12k – 25k words) | $19 – $49 | PDF + Notion template | Gumroad, Lemon Squeezy, Stripe |
| **Comprehensive Technical Guide** | 120 – 250 pages (40k – 75k words) | $39 – $99 | PDF + EPUB + Code Repo | Self-hosted, Leanpub |
| **Commercial Non-Fiction / Mindset**| 150 – 220 pages (45k – 60k words) | $9.99 – $14.99 | EPUB (MOBI/KDP) + Paperback | Amazon KDP, Apple Books, IngramSpark |
| **High-Converting Lead Magnet** | 15 – 30 pages (5k – 10k words) | Free (Email opt-in) | PDF | Substack, Landing Page |

---

## 2. Chapter Blueprint (The 6-Step Module)

Every chapter should follow this structured pedagogic flow:
1. **The Hook Problem**: Introduce a real-world failure state or misconception the reader faces right now.
2. **The Core Mental Model**: Define the underlying principle or diagram that explains why the problem occurs.
3. **The Step-by-Step Execution**: Actionable, reproducible walkthrough with code snippets, templates, or checklists.
4. **Edge Cases & Pitfalls**: What goes wrong when this is applied in the wild, and how to debug it.
5. **Real-World Case Study / Example**: Concrete before-and-after proof.
6. **Action Checklist (The 30-Minute Win)**: Immediate exercise the reader can execute right away.

---

## 3. Markdown Semantic Source Architecture

Keep each chapter in an isolated file:
```
my-book/
├── metadata.yaml
├── cover.jpg
├── chapters/
│   ├── 00-introduction.md
│   ├── 01-foundations.md
│   ├── 02-architecture.md
│   ├── 03-implementation.md
│   └── 04-scaling.md
└── styles/
    ├── custom.css       # For EPUB styling
    └── template.typ     # For Typst high-res PDF generation
```

### Frontmatter Example (`metadata.yaml`)
```yaml
---
title: "The Agentic Architect"
subtitle: "Designing Autonomous AI Systems That Scale"
author: "Alex Mercer"
rights: "Copyright © 2026 Alex Mercer. All rights reserved."
language: "en-US"
cover-image: "cover.jpg"
toc: true
toc-depth: 2
---
```

---

## 4. Production Compilation Toolchains

### Pipeline A: Fast High-Quality EPUB via Pandoc
```bash
pandoc metadata.yaml chapters/*.md \
  -o dist/the-agentic-architect.epub \
  --epub-cover-image=cover.jpg \
  --toc \
  --toc-depth=2 \
  --css=styles/custom.css
```

### Pipeline B: Beautiful Modern PDF via Typst
Typst produces lightweight, beautifully typeset PDFs with native ligature handling and zero LaTeX bloat:
```typst
#set page(
  paper: "a5",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.0cm, right: 2.0cm),
  header: locate(loc => {
    if loc.page() > 2 {
      align(center, text(9pt, fill: rgb("#64748b"))[The Agentic Architect])
    }
  }),
  footer: locate(loc => {
    if loc.page() > 1 {
      align(center, text(10pt)[#loc.page()])
    }
  })
)

#set text(font: "Linux Libertine", size: 11pt, lang: "en")
#set par(justify: true, leading: 0.75em)

#show heading.where(level: 1): it => block(break: true)[
  #v(2cm)
  #text(24pt, weight: "bold", fill: rgb("#0f172a"))[#it.body]
  #v(1cm)
]
```

---

## 5. Cover Design & Packaging

- **Aspect Ratio**: 1:1.6 (Standard Amazon Kindle resolution: `1600 x 2560 px` at 300 DPI).
- **Visual Formula**:
  - Top 30%: Clear, bold, high-contrast title (visible as a 100px thumbnail).
  - Middle 40%: One singular focal visual (abstract 3D geometry or minimal icon).
  - Bottom 30%: Subtitle explaining the exact transformation + Author name.
- **Color Contrast**: Verify thumbnail legibility in grayscale mode before finalizing.
