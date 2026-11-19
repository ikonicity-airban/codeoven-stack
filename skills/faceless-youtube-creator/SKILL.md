---
name: faceless-youtube-creator
description: End-to-end production system for faceless YouTube channels, including high-retention script engineering, AI voice pacing, Remotion and programmatic video generation, B-roll sourcing, and high-CTR thumbnail packaging.
---

# Faceless YouTube Creator Skill

A complete engineering and content production playbook to build, automate, and scale high-retention faceless YouTube channels.

---

## 1. High-RPM Niche Taxonomy & Selection

| Tier | Niches | Avg. CPM / RPM | Content Lifespan | Production Style |
| :--- | :--- | :--- | :--- | :--- |
| **Tier 1 (High Revenue)** | Personal Finance, Real Estate, SaaS breakdowns, AI Tools, Trading | $18.00 – $45.00+ | Evergreen (1–3 years) | Screen recordings, animated motion graphics, data charts |
| **Tier 2 (High Virality)** | Dark History, Unsolved Mysteries, Military Tech, Space/Cosmology | $8.00 – $18.00 | Long (6–18 months) | Midjourney/Flux cinematic visuals, parallax pan-zoom, ambient soundscapes |
| **Tier 3 (Mass Scale)** | Motivational Stories, Philosophy, Biographies, Psychology | $5.00 – $12.00 | Evergreen | Fast cuts, typography callouts, kinetic captions |

---

## 2. Retention-Driven Script Architecture

Every viral script follows the **6-Part Retention Loop**:

```
[0:00 - 0:05] Pattern Interrupt (Visual + Audio Shock)
       │
[0:05 - 0:25] The Retention Lock (The Stakes & "The Price of Not Knowing")
       │
[0:25 - 2:00] Act I: The Premise & Immediate Micro-Payoff
       │
[2:00 - 5:30] Act II: The Complication / Escalating Stakes (Change visual angle every 4s)
       │
[5:30 - 8:00] Act III: The Climax / Master Revelation
       │
[8:00 - End ] Seamless Binge CTA (Zero "Thank you for watching" - directly route to next video)
```

### Hook Script Formula Template
```markdown
[VISUAL: Rapid glitch cut to dramatic satellite imagery with red crosshair]
[SFX: Heavy bass thud + distant air raid siren]
NARRATOR (Pacing: brisk, 155 WPM):
"In 1998, an anonymous engineer uploaded a 40-line Python script that quietly bypassed the Pentagon's firewall. For twenty-six years, the government denied it ever happened. Until three days ago."
[SFX: High-frequency tape rewind]
"What you are looking at right now is the declassified source code. And the final seven lines... should not exist."
```

---

## 3. Audio & Voice Engineering (ElevenLabs Best Practices)

- **Voice Model**: Eleven Multilingual v2 or Turbo v2.5.
- **Pacing**: Target 145–160 Words Per Minute (WPM) for narrative deep dives; 170–185 WPM for fast-paced shorts or top-10 lists.
- **SSML & Break Control**:
  - Add `...` for natural micro-pauses (200ms).
  - Add `<break time="0.6s" />` after cliffhanger statements before revealing an answer.
- **Audio Ducking Rules**:
  - Voice track: Normalized to **-14 LUFS** (integrated) with peak at -1 dBTP.
  - Background music: Ducked to **-22 dB to -26 dB** beneath narration.
  - SFX (Whooshes, Risers, Thuds): Peaked at **-8 dB to -10 dB**.

---

## 4. Programmatic Video Rendering with Remotion (React)

Create automated, data-driven video renderers using Remotion:

```tsx
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const KineticTitleSequence = ({ title, subtitle }: { title: string; subtitle: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 100 },
  });

  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill className="bg-neutral-950 flex flex-col items-center justify-center text-white font-sans">
      <h1
        style={{ transform: `scale(${titleScale})` }}
        className="text-7xl font-black tracking-tight text-center max-w-4xl uppercase bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
      >
        {title}
      </h1>
      <p
        style={{ opacity: subtitleOpacity }}
        className="text-2xl mt-6 text-neutral-400 font-medium tracking-wide"
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
```

---

## 5. Visual Asset Generation & B-Roll Pipeline

1. **AI Image Generation (Midjourney v6 / Flux.1 Schnell)**:
   - *Cinematic Wide*: `cinematic film still, wide angle 16:9, documentary style, moody rim lighting, 35mm photography, subtle film grain, photorealistic --ar 16:9 --style raw`
   - *Technical Schematic*: `futuristic blueprint schematic of [subject], glowing cyan and amber HUD vector lines, dark carbon background, 8k render, octane render --ar 16:9`
2. **Motion Animation (Ken Burns Effect)**:
   - Apply continuous subtle zoom (100% $\to$ 108% over 4 seconds) or pan left-to-right.
   - Cut to a new asset or angle every **3.5 to 5.0 seconds** to preserve watch time.

---

## 6. High-CTR Packaging (Title & Thumbnail)

### The 3-Element Thumbnail Rule
Never overload a thumbnail. Maximum of three visual elements:
1. **Focal Subject** (Human expression, mysterious artifact, or prominent chart).
2. **Context Cue** (Dark contrast backdrop, warning border, or glowing spotlight).
3. **Punch Text** (1 to 3 words max, e.g., *"IT FAILED"*, *"THE LIE"*, *"DON'T CLICK"*).

### Title Framing Frameworks
- **The Insider Secret**: *"The $4.2B Algorithm Wall Street Keeps Hidden"*
- **The Counter-Intuitive Truth**: *"Why 98% of Cloud Startups Are Moving Back to Hardware"*
- **The Countdown with Stakes**: *"What Happens When The Last Bitcoin Is Mined?"*
