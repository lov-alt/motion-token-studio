import { useState } from "react";
import { useI18n } from "../i18n/index";
import { createStore } from "../engine/tokens";

const CATEGORIES = ["enter", "exit", "hover", "attention"] as const;

export default function Presets() {
  const { t } = useI18n();
  const store = createStore();
  const [category, setCategory] = useState<string>("enter");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = store.presets.filter((p) => p.category === category);
  const selected = store.presets.find((p) => p.id === previewId);
  const timing = store.easings.find((e) => e.id === selected?.timing);

  const code = selected
    ? `.element {\n  transition: ${selected.property} 300ms ${timing?.css ?? "ease"};\n}\n.element.animate {\n  ${selected.property.split(",").map((p) => p.trim()).map((p) => `  ${p}: ${selected.to.split(",").map((s) => s.trim()).join(";\n  " + p + ": ")}`).join(";\n")}\n}`
    : "";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">{t.presets.title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.presets.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories + Cards */}
        <div className="lg:col-span-2">
          {/* Category tabs */}
          <div className="flex gap-1 mb-4">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                  category === cat
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                }`}>{t.presets[cat]}</button>
            ))}
          </div>

          {/* Preset cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((p) => (
              <button key={p.id} type="button"
                onClick={() => setPreviewId(p.id === previewId ? null : p.id)}
                onMouseEnter={() => setPreviewId(p.id)}
                className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                  previewId === p.id
                    ? "border-indigo-300 dark:border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/5 shadow-md"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-md"
                }`}>
                {/* Animated preview block */}
                <div className="h-16 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                  <div
                    className="w-10 h-10 bg-indigo-500 rounded-lg"
                    style={previewId === p.id ? {
                      animation: `preview-${p.id} 1.5s ${store.easings.find((e) => e.id === p.timing)?.css ?? "ease"} infinite alternate`,
                    } : {}}
                  />
                </div>
                <style>{previewId === p.id && timing ? `
                  @keyframes preview-${p.id} {
                    from { ${p.property.split(",").map((prop, i) => `${prop.trim()}: ${p.from.split(",")[i]?.trim() ?? p.from}`).join("; ")}; }
                    to { ${p.property.split(",").map((prop, i) => `${prop.trim()}: ${p.to.split(",")[i]?.trim() ?? p.to}`).join("; ")}; }
                  }` : ""}</style>
                <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">{p.name}</h4>
                <p className="text-[11px] text-zinc-400">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          {selected ? (
            <div className="space-y-3">
              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{selected.category} · {selected.name}</span>
              <div>
                <span className="text-[10px] text-zinc-400">Property</span>
                <p className="text-sm font-mono text-zinc-700 dark:text-zinc-300">{selected.property}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-zinc-400">From</span>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{selected.from}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400">To</span>
                  <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{selected.to}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400">Timing</span>
                <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{timing?.css ?? selected.timing}</p>
              </div>
              <pre className="text-[11px] font-mono text-zinc-500 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg whitespace-pre-wrap leading-relaxed">{code}</pre>
              <button onClick={() => navigator.clipboard.writeText(code)}
                className="w-full py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">
                {t.export.copy}
              </button>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 text-center py-8">Click a preset to see details and get CSS code</p>
          )}
        </div>
      </div>
    </div>
  );
}
