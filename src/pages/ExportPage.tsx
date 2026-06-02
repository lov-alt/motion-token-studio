import { useState } from "react";
import { createStore } from "../engine/tokens";

type Format = "css-transition" | "css-keyframes" | "framer" | "swiftui" | "flutter";

const LABELS: Record<Format, string> = {
  "css-transition": "CSS transition",
  "css-keyframes": "CSS @keyframes",
  framer: "Framer Motion",
  swiftui: "SwiftUI",
  flutter: "Flutter",
};

export default function ExportPage() {
  const store = createStore();
  const [fmt, setFmt] = useState<Format>("css-transition");
  const [copied, setCopied] = useState(false);

  const [x1, y1, x2, y2] = [store.easings[3].x1, store.easings[3].y1, store.easings[3].x2, store.easings[3].y2];
  const ms = store.durations[3].ms;

  const codeMap: Record<Format, string> = {
    "css-transition": `:root {\n${store.durations.map((d) => `  --duration-${d.id}: ${d.ms}ms;`).join("\n")}\n}\n\n.element {\n  transition: all var(--duration-md) cubic-bezier(${x1}, ${y1}, ${x2}, ${y2});\n}`,

    "css-keyframes": `@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(8px); }\n  to   { opacity: 1; transform: translateY(0);  }\n}\n\n.animate-in {\n  animation: fadeIn ${ms}ms cubic-bezier(${x1}, ${y1}, ${x2}, ${y2}) both;\n}`,

    framer: `import { motion } from "framer-motion";\n\nconst fadeIn = {\n  hidden:  { opacity: 0, y: 8 },\n  visible: {\n    opacity: 1, y: 0,\n    transition: { duration: ${(ms / 1000).toFixed(1)}, ease: [${x1}, ${y1}, ${x2}, ${y2}] },\n  },\n};\n\n<motion.div variants={fadeIn} initial="hidden" animate="visible" />`,

    swiftui: `import SwiftUI\n\nRectangle()\n  .opacity(appear ? 1 : 0)\n  .offset(y: appear ? 0 : 8)\n  .animation(.timingCurve(${x1}, ${y1}, ${x2}, ${y2}, duration: ${(ms / 1000).toFixed(1)}), value: appear)`,

    flutter: `AnimationController(\n  duration: Duration(milliseconds: ${ms}),\n  vsync: this,\n);\n\nCurvedAnimation(\n  parent: _ctrl,\n  curve: Cubic(${x1}, ${y1}, ${x2}, ${y2}),\n);`,
  };

  const code = codeMap[fmt];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">Export</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Copy animation code in your chosen format</p>

      <div className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/60 border-b border-zinc-800">
          <div className="flex gap-0.5 flex-wrap">
            {(Object.keys(LABELS) as Format[]).map((f) => (
              <button key={f} onClick={() => setFmt(f)}
                className={`px-2.5 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                  fmt === f ? "bg-indigo-600 text-white" : "text-zinc-500 hover:text-zinc-200"
                }`}>{LABELS[f]}</button>
            ))}
          </div>
          <button onClick={async () => { await navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
            className="text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md transition-colors">
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="p-4 text-xs text-zinc-200 font-mono leading-relaxed overflow-x-auto"><code>{code}</code></pre>
      </div>
    </div>
  );
}
