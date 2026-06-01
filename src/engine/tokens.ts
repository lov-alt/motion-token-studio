export interface EasingToken {
  id: string; name: string;
  x1: number; y1: number; x2: number; y2: number;
  css: string;
}

export interface DurationToken {
  id: string; name: string; ms: number;
}

export interface MotionPreset {
  id: string; category: "enter" | "exit" | "hover" | "attention";
  name: string; desc: string;
  property: string; from: string; to: string;
  timing: string;
}

export interface MotionStore {
  easings: EasingToken[];
  durations: DurationToken[];
  presets: MotionPreset[];
}

const EASING_PRESETS: EasingToken[] = [
  { id: "ease", name: "Ease", x1: 0.25, y1: 0.1, x2: 0.25, y2: 1, css: "ease" },
  { id: "ease-in", name: "Ease In", x1: 0.42, y1: 0, x2: 1, y2: 1, css: "ease-in" },
  { id: "ease-out", name: "Ease Out", x1: 0, y1: 0, x2: 0.58, y2: 1, css: "ease-out" },
  { id: "ease-in-out", name: "Ease In Out", x1: 0.42, y1: 0, x2: 0.58, y2: 1, css: "ease-in-out" },
  { id: "linear", name: "Linear", x1: 0, y1: 0, x2: 1, y2: 1, css: "linear" },
  { id: "spring", name: "Spring", x1: 0.34, y1: 1.56, x2: 0.64, y2: 1, css: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { id: "bounce", name: "Bounce", x1: 0.68, y1: -0.55, x2: 0.27, y2: 1.55, css: "cubic-bezier(0.68, -0.55, 0.27, 1.55)" },
  { id: "decelerate", name: "Decelerate", x1: 0, y1: 0, x2: 0.2, y2: 1, css: "cubic-bezier(0, 0, 0.2, 1)" },
  { id: "accelerate", name: "Accelerate", x1: 0.4, y1: 0, x2: 1, y2: 1, css: "cubic-bezier(0.4, 0, 1, 1)" },
];

const DURATION_DEFAULTS: DurationToken[] = [
  { id: "instant", name: "Instant", ms: 0 },
  { id: "xs", name: "Extra Fast", ms: 100 },
  { id: "sm", name: "Fast", ms: 150 },
  { id: "md", name: "Normal", ms: 300 },
  { id: "lg", name: "Slow", ms: 500 },
  { id: "xl", name: "Gentle", ms: 800 },
];

const MOTION_PRESETS: MotionPreset[] = [
  { id: "fade-in", category: "enter", name: "Fade In", desc: "Opacity 0 → 1", property: "opacity", from: "0", to: "1", timing: "ease-out" },
  { id: "slide-up", category: "enter", name: "Slide Up", desc: "Translate up + fade", property: "transform,opacity", from: "translateY(20px), 0", to: "translateY(0), 1", timing: "decelerate" },
  { id: "scale-in", category: "enter", name: "Scale In", desc: "Scale 0.9 → 1 + fade", property: "transform,opacity", from: "scale(0.9), 0", to: "scale(1), 1", timing: "spring" },
  { id: "blur-in", category: "enter", name: "Blur In", desc: "Blur → sharp + fade", property: "filter,opacity", from: "blur(8px), 0", to: "blur(0), 1", timing: "ease-out" },
  { id: "fade-out", category: "exit", name: "Fade Out", desc: "Opacity 1 → 0", property: "opacity", from: "1", to: "0", timing: "ease-in" },
  { id: "slide-down", category: "exit", name: "Slide Down", desc: "Translate down + fade", property: "transform,opacity", from: "translateY(0), 1", to: "translateY(20px), 0", timing: "accelerate" },
  { id: "pulse", category: "attention", name: "Pulse", desc: "Subtle scale pulse", property: "transform", from: "scale(1)", to: "scale(1.05)", timing: "ease-in-out" },
  { id: "shake", category: "attention", name: "Shake", desc: "Horizontal shake", property: "transform", from: "translateX(0)", to: "translateX(6px)", timing: "ease-in-out" },
  { id: "bounce", category: "attention", name: "Bounce", desc: "Vertical bounce", property: "transform", from: "translateY(0)", to: "translateY(-12px)", timing: "bounce" },
  { id: "lift", category: "hover", name: "Lift", desc: "Scale + shadow lift", property: "transform,box-shadow", from: "translateY(0), 0 2px 8px rgba(0,0,0,0.1)", to: "translateY(-4px), 0 8px 24px rgba(0,0,0,0.15)", timing: "ease-out" },
  { id: "expand", category: "hover", name: "Expand", desc: "Scale up slightly", property: "transform", from: "scale(1)", to: "scale(1.03)", timing: "spring" },
  { id: "highlight", category: "hover", name: "Highlight", desc: "Brighten on hover", property: "filter", from: "brightness(1)", to: "brightness(1.1)", timing: "ease-out" },
];

export function createStore(): MotionStore {
  return {
    easings: EASING_PRESETS,
    durations: DURATION_DEFAULTS,
    presets: MOTION_PRESETS,
  };
}
