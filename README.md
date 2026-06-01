<p align="center">
  <img src="public/favicon.svg" width="64" alt="Motion Token Studio" />
</p>

<h1 align="center">Motion Token Studio</h1>

<p align="center">
  <strong>Open Source Motion Token Management</strong><br/>
  Cubic-bezier editor · Duration scale · Motion presets · Multi-framework export
</p>

<p align="center">
  <a href="https://lov-alt.github.io/motion-token-studio/"><img src="https://img.shields.io/badge/demo-live-6366f1?style=flat-square" /></a>
  <a href="https://github.com/lov-alt/motion-token-studio/stargazers"><img src="https://img.shields.io/github/stars/lov-alt/motion-token-studio?style=flat-square&color=f59e0b" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/lov-alt/motion-token-studio?style=flat-square&color=6366f1" /></a>
</p>

---

## Motion Token Files

The `tokens/` directory contains ready-to-use motion tokens in W3C DTCG format:

```bash
curl -O https://raw.githubusercontent.com/lov-alt/motion-token-studio/master/tokens/motion-tokens.json
```

[`tokens/motion-tokens.json`](./tokens/motion-tokens.json) — 6 durations + 6 easing curves, ready to import into any token pipeline.

---

## Why Motion Tokens

Every design system defines **static** tokens — colors, typography, spacing. But interaction design needs **motion** tokens: how things fade in, slide up, pulse for attention, lift on hover.

- Material Design 3 defines motion tokens but provides no visual editor
- `cubic-bezier()` is opaque — four numbers that are impossible to visualize without a graph
- CSS animation code is verbose and framework-specific

Motion Token Studio makes motion design **visible, editable, and exportable**.

---

## Features

| | |
|---|---|
| **Bezier curve editor** | SVG-based interactive cubic-bezier editor. Drag control points. See the curve update in real-time. Watch a ball animate along the timing curve. |
| **9 easing presets** | ease, ease-in, ease-out, ease-in-out, linear, spring, bounce, decelerate, accelerate. Click to load into the editor. |
| **Duration scale** | 6 duration tokens (0ms–800ms) with visual timeline bars. Edit values inline. |
| **12 motion presets** | Enter (fade-in, slide-up, scale-in, blur-in) · Exit (fade-out, slide-down) · Hover (lift, expand, highlight) · Attention (pulse, shake, bounce). Hover to preview. |
| **5 export formats** | CSS transition, CSS @keyframes, Framer Motion variants, SwiftUI .animation, Flutter AnimationController. |
| **Dark mode** | System-aware + manual toggle, localStorage persisted. |

## Quick Start

```bash
git clone https://github.com/lov-alt/motion-token-studio.git
cd motion-token-studio
npm install
npm run dev          # http://localhost:5173
```

Or use instantly at **[lov-alt.github.io/motion-token-studio](https://lov-alt.github.io/motion-token-studio/)**.

## Ecosystem

Motion Token Studio completes the design-tool ecosystem:

```
Design Token Studio        CSS Visual Toolbox        Typography Lab           Motion Token Studio
(define static tokens)  →  (visual CSS editing)  →   (layout generation)  →  (motion + animation)
```

- **[Design Token Studio](https://github.com/lov-alt/design-token-studio)** — Color, typography, spacing, shadow token management
- **[CSS Visual Toolbox](https://github.com/lov-alt/css-visual-toolbox)** — Visual CSS editor (clip-path, gradients, shadows)
- **[Typography Lab](https://github.com/lov-alt/typography-lab)** — Content-driven layout generator (14 archetypes, 8 traditions)

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router

## License

MIT
