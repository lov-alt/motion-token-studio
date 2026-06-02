import { Link } from "react-router-dom";
import { createStore } from "../engine/tokens";
import { sampleCurve } from "../engine/bezier";

const SECTIONS = [
  {
    path: "/easing", label: "Easing Curves", icon: "⌁", color: "bg-indigo-500",
    desc: "Interactive cubic-bezier curve editor with live preview ball",
  },
  {
    path: "/durations", label: "Durations", icon: "◎", color: "bg-emerald-500",
    desc: "Animation timing scale — instant to gentle",
  },
  {
    path: "/presets", label: "Motion Presets", icon: "✦", color: "bg-amber-500",
    desc: "12 production-ready patterns across 4 categories",
  },
  {
    path: "/export", label: "Export", icon: "↓", color: "bg-sky-500",
    desc: "CSS, Framer Motion, SwiftUI, Flutter — one click",
  },
];

export default function Dashboard() {
  const store = createStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
        Motion Token Studio
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-10">
        {store.easings.length} easing curves · {store.durations.length} durations · {store.presets.length} presets
      </p>

      {/* Easing miniatures */}
      <h2 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Easing Curves</h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-10">
        {store.easings.map((c) => {
          const pts = sampleCurve(c.x1, c.y1, c.x2, c.y2, 20);
          const d = `M ${2 + pts[0].x * 36} ${22 - pts[0].y * 20} ` + pts.slice(1).map((p) => `L ${2 + p.x * 36} ${22 - p.y * 20}`).join(" ");
          return (
            <Link key={c.id} to="/easing"
              className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <svg viewBox="0 0 40 24" className="w-full h-8 mb-1.5">
                <path d={d} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{c.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Duration bar */}
      <h2 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3">Durations</h2>
      <div className="flex gap-2 mb-10">
        {store.durations.map((d) => (
          <Link key={d.id} to="/durations"
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
            <span className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">{d.ms}</span>
            <span className="text-[11px] text-zinc-400 font-normal ml-0.5">ms</span>
            <p className="text-[10px] text-zinc-400 mt-0.5">{d.name}</p>
          </Link>
        ))}
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SECTIONS.map((m) => (
          <Link key={m.path} to={m.path}
            className="flex items-start gap-4 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <div className={`w-10 h-10 shrink-0 rounded-xl ${m.color} flex items-center justify-center text-white text-lg shadow-sm`}>
              {m.icon}
            </div>
            <div>
              <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{m.label}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
