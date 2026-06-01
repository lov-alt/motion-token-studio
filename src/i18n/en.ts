import type { Translations } from "./zh";

const en: Translations = {
  app: { title: "Motion Token Studio" },
  nav: {
    easing: "Easing", durations: "Durations",
    presets: "Presets", export: "Export",
  },
  dashboard: {
    subtitle: "{e} easing curves · {d} durations · {p} motion presets",
    easing: "Easing Curves", durations: "Durations",
    presets: "Motion Presets", export: "Export",
    easingDesc: "Visual cubic-bezier editor with live preview and 9 built-in curves",
    durationsDesc: "Duration token scale — instant to gentle",
    presetsDesc: "Enter · Exit · Hover · Attention — production-ready motion patterns",
    exportDesc: "CSS animations, Framer Motion, SwiftUI, Flutter",
  },
  easing: {
    title: "Easing Curve Editor",
    desc: "Drag control points to shape the cubic-bezier curve. Watch the ball animate in real-time.",
    preset: "Presets", custom: "Custom Curve",
    preview: "Preview", play: "Play", reset: "Reset",
  },
  durations: {
    title: "Duration Tokens",
    desc: "Define your animation timing scale",
  },
  presets: {
    title: "Motion Presets",
    desc: "Production-ready animation patterns by category",
    enter: "Enter", exit: "Exit", hover: "Hover",
    attention: "Attention",
    preview: "Hover to preview",
  },
  export: {
    title: "Export", desc: "Copy animation code in your chosen format",
    css: "CSS transition", cssKeyframes: "CSS @keyframes",
    framer: "Framer Motion", swiftui: "SwiftUI", flutter: "Flutter",
    copy: "Copy", copied: "Copied",
  },
  common: { back: "← Back", darkMode: "Dark" },
};

export default en;
