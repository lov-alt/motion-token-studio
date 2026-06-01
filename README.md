<p align="center">
  <img src="docs/preview.svg" alt="Motion Token Studio" width="100%" />
</p>

<h1 align="center">Motion Token Studio</h1>

<p align="center">
  <strong>Open Source Motion Token Management</strong>
</p>

<p align="center">
  <a href="https://lov-alt.github.io/motion-token-studio/"><img src="https://img.shields.io/badge/demo-live-6366f1?style=flat-square" alt="Live Demo" /></a>
  <a href="https://github.com/lov-alt/motion-token-studio/stargazers"><img src="https://img.shields.io/github/stars/lov-alt/motion-token-studio?style=flat-square&color=f59e0b" alt="Stars" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/lov-alt/motion-token-studio?style=flat-square&color=6366f1" alt="MIT" /></a>
</p>

---

## Why Motion Tokens

Every design system defines **static** tokens — colors, typography, spacing. But interaction design needs **motion**: how elements fade in, slide up, pulse for attention, lift on hover.

| Problem | Solution |
|---|---|
| Material Design 3 defines motion tokens but has **no visual editor** | SVG-based cubic-bezier curve editor with draggable control points |
| `cubic-bezier(0.34, 1.56, 0.64, 1)` is **four opaque numbers** | Real-time curve graph + ball animation along the timing path |
| CSS animation code is **verbose and framework-specific** | One-click export to CSS, Framer Motion, SwiftUI, and Flutter |
| Duration values scattered across codebases with **no standardization** | Named duration token scale (instant → gentle) with visual timeline |

---

## Token Files

The `tokens/` directory contains ready-to-use W3C DTCG motion tokens:

```bash
curl -O https://raw.githubusercontent.com/lov-alt/motion-token-studio/master/tokens/motion-tokens.json
```

[`tokens/motion-tokens.json`](./tokens/motion-tokens.json) — 6 durations × 6 easing curves, compatible with Figma Tokens Studio, Style Dictionary, and any DTCG parser.

```json
{
  "duration": {
    "fast":   { "$value": "150ms" },
    "normal": { "$value": "300ms" },
    "slow":   { "$value": "500ms" }
  },
  "easing": {
    "ease-out": { "$value": "cubic-bezier(0, 0, 0.58, 1)" },
    "spring":   { "$value": "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    "bounce":   { "$value": "cubic-bezier(0.68, -0.55, 0.27, 1.55)" }
  }
}
```

---

## Features

| Feature | Description |
|---|---|
| **Bezier Curve Editor** | Interactive SVG cubic-bezier tool. Drag two control points. Curve updates instantly. |
| **Preview Ball** | A ball animates along the timing curve in real-time — see exactly how your easing feels. |
| **9 Easing Presets** | ease, ease-in, ease-out, ease-in-out, linear, spring, bounce, decelerate, accelerate |
| **Numeric Input** | Fine-tune x1/y1/x2/y2 values directly for precision |
| **Duration Scale** | 6 named tokens (0ms–800ms) with visual timeline bars and inline editing |
| **12 Motion Presets** | Enter (fade-in, slide-up, scale-in, blur-in) · Exit (fade-out, slide-down) · Hover (lift, expand, highlight) · Attention (pulse, shake, bounce). Hover cards to preview. |
| **5 Export Formats** | CSS `transition` · CSS `@keyframes` · Framer Motion `variants` · SwiftUI `.animation()` · Flutter `AnimationController` |
| **Dark Mode** | System-aware + manual toggle, localStorage persisted |
| **i18n** | 中文 / English |

---

## Project Structure

```text
motion-token-studio/
├── tokens/motion-tokens.json      # W3C DTCG format
├── src/
│   ├── engine/
│   │   ├── bezier.ts              # Cubic-bezier math + sampling
│   │   └── tokens.ts              # Data model + defaults
│   ├── pages/
│   │   ├── Dashboard.tsx          # Easing previews + duration bar + nav
│   │   ├── EasingEditor.tsx       # SVG curve editor (core)
│   │   ├── Durations.tsx          # Duration token scale
│   │   ├── Presets.tsx            # Motion pattern gallery
│   │   └── ExportPage.tsx         # 5-format code export
│   ├── i18n/
│   ├── App.tsx
│   └── main.tsx
├── docs/preview.svg
└── .github/workflows/deploy.yml
```

## Quick Start

```bash
git clone https://github.com/lov-alt/motion-token-studio.git
cd motion-token-studio
npm install
npm run dev          # http://localhost:5173
```

Or use instantly at **[lov-alt.github.io/motion-token-studio](https://lov-alt.github.io/motion-token-studio/)**.

## Ecosystem

```
Design Token Studio   →  CSS Visual Toolbox  →  Typography Lab   →  Motion Token Studio
(static tokens)          (visual CSS editing)    (layout generator)   (motion & animation)
```

- **[Design Token Studio](https://github.com/lov-alt/design-token-studio)** — Color, typography, spacing, shadow, radius token management. WCAG checker, 6 export formats.
- **[CSS Visual Toolbox](https://github.com/lov-alt/css-visual-toolbox)** — Visual CSS editor (clip-path, gradients, shadows, border-radius). 8-framework export including SwiftUI and Flutter.
- **[Typography Lab](https://github.com/lov-alt/typography-lab)** — Content-driven layout generator. 14 archetypes, 8 typographic traditions, local font import, image editing with 16 blend modes.

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router

## License

MIT
