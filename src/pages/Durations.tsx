import { useState } from "react";
import { useI18n } from "../i18n/index";
import { createStore, type DurationToken } from "../engine/tokens";

export default function Durations() {
  const { t } = useI18n();
  const [durations, setDurations] = useState<DurationToken[]>(() => createStore().durations);

  const update = (id: string, ms: number) => {
    setDurations((prev) => prev.map((d) => (d.id === id ? { ...d, ms } : d)));
  };

  const exportCSS = `/* Duration tokens */
:root {\n${durations.map((d) => `  --duration-${d.id}: ${d.ms}ms;`).join("\n")}\n}`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">{t.durations.title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.durations.desc}</p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        {durations.map((d) => (
          <div key={d.id} className="flex items-center gap-4 px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
            <span className="w-16 text-sm font-medium text-zinc-700 dark:text-zinc-300">{d.name}</span>
            <input type="range" min={0} max={1200} step={10} value={d.ms}
              onChange={(e) => update(d.id, Number(e.target.value))}
              className="slider flex-1" />
            <input type="number" value={d.ms} min={0} max={5000} step={10}
              onChange={(e) => update(d.id, Number(e.target.value) || 0)}
              className="w-20 px-2 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-right focus:outline-none focus:border-indigo-400" />
            <span className="text-xs text-zinc-400 w-8">ms</span>
            {/* Visual bar */}
            <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full flex-1 max-w-32">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(d.ms / 1200) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">CSS Variables</span>
          <button onClick={() => navigator.clipboard.writeText(exportCSS)}
            className="text-[10px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md transition-colors">Copy</button>
        </div>
        <pre className="text-xs font-mono text-zinc-300 leading-relaxed"><code>{exportCSS}</code></pre>
      </div>
    </div>
  );
}
