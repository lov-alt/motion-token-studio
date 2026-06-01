import { Link } from "react-router-dom";
import { useI18n } from "../i18n/index";
import { createStore } from "../engine/tokens";
import { sampleCurve } from "../engine/bezier";

const MODULES = [
  { path: "/easing", icon: "⌁", color: "from-indigo-500 to-violet-500", key: "easing" as const },
  { path: "/durations", icon: "◎", color: "from-emerald-500 to-teal-500", key: "durations" as const },
  { path: "/presets", icon: "✦", color: "from-amber-500 to-orange-500", key: "presets" as const },
  { path: "/export", icon: "↓", color: "from-sky-500 to-cyan-500", key: "export" as const },
];

export default function Dashboard() {
  const { t } = useI18n();
  const store = createStore();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">{t.app.title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {t.dashboard.subtitle.replace("{e}", String(store.easings.length)).replace("{d}", String(store.durations.length)).replace("{p}", String(store.presets.length))}
        </p>
      </div>

      {/* Easing cards */}
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t.dashboard.easing}</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2 mb-8">
        {store.easings.map((c) => {
          const pts = sampleCurve(c.x1, c.y1, c.x2, c.y2, 20);
          const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${2 + p.x * 36} ${22 - p.y * 20}`).join(" ");
          return (
            <Link key={c.id} to="/easing"
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <svg viewBox="0 0 40 24" className="w-full h-8 mb-1.5">
                <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{c.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Duration bar */}
      <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t.dashboard.durations}</h2>
      <div className="flex gap-2 mb-8">
        {store.durations.map((d) => (
          <Link key={d.id} to="/durations"
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300">{d.ms}<span className="text-xs text-zinc-400 font-normal">ms</span></div>
            <div className="text-[10px] text-zinc-400 mt-0.5">{d.name}</div>
          </Link>
        ))}
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-2 gap-3">
        {MODULES.map((m) => (
          <Link key={m.path} to={m.path}
            className="group flex gap-4 p-5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
              {m.icon}
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">{t.dashboard[m.key]}</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{t.dashboard[`${m.key}Desc` as keyof typeof t.dashboard]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
