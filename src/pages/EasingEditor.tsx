import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "../i18n/index";
import { sampleCurve, formatCSS, clampPoint } from "../engine/bezier";
import { createStore } from "../engine/tokens";

export default function EasingEditor() {
  const { t } = useI18n();
  const store = createStore();
  const [selected, setSelected] = useState("ease-in-out");
  const [x1, setX1] = useState(0.42);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0.58);
  const [y2, setY2] = useState(1);
  const [playing, setPlaying] = useState(false);
  const animRef = useRef(0);
  const [dragging, setDragging] = useState<"p1" | "p2" | null>(null);

  const applyPreset = (id: string) => {
    const c = store.easings.find((e) => e.id === id) ?? store.easings[3];
    setSelected(id); setX1(c.x1); setY1(c.y1); setX2(c.x2); setY2(c.y2);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging) return;
    const svg = document.getElementById("bezier-svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = 280 / rect.width;
    const nx = clampPoint(((e.clientX - rect.left) * scale - 40) / 200);
    const ny = clampPoint(1 - ((e.clientY - rect.top) * scale - 40) / 200);
    dragging === "p1" ? (setX1(nx), setY1(ny)) : (setX2(nx), setY2(ny));
  }, [dragging]);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", () => setDragging(null));
    return () => { window.removeEventListener("pointermove", handlePointerMove); window.removeEventListener("pointerup", () => setDragging(null)); };
  }, [handlePointerMove]);

  const play = () => {
    if (playing) { cancelAnimationFrame(animRef.current); setPlaying(false); return; }
    setPlaying(true);
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / 2000);
      const pts = sampleCurve(x1, y1, x2, y2, 200);
      const ball = pts[Math.floor(t * 200)];
      (document.getElementById("preview-ball") as HTMLElement | null)?.setAttribute("cx", String(40 + (ball?.x ?? t) * 200));
      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else { setPlaying(false); (document.getElementById("preview-ball") as HTMLElement | null)?.setAttribute("cx", "240"); }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const pts = sampleCurve(x1, y1, x2, y2, 80);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${40 + p.x * 200} ${40 + (1 - p.y) * 200}`).join(" ");

  const css = formatCSS(x1, y1, x2, y2);
  const cssCode = `transition: all 300ms ${css};`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-light tracking-tight text-zinc-900 dark:text-zinc-100">{t.easing.title}</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{t.easing.desc}</p>
      </div>

      {/* Presets row */}
      <div className="flex flex-wrap gap-1 mb-5">
        {store.easings.map((c) => (
          <button key={c.id} onClick={() => applyPreset(c.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selected === c.id ? "bg-indigo-600 text-white shadow-sm" : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}>{c.name}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* SVG Editor */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <svg id="bezier-svg" viewBox="0 0 280 280" className="w-full max-w-[360px] mx-auto block touch-none select-none">
            {[0.25, 0.5, 0.75].map(v => (
              <g key={v}>
                <line x1={40 + v * 200} y1={40} x2={40 + v * 200} y2={240} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1={40} y1={40 + v * 200} x2={240} y2={40 + v * 200} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" />
              </g>
            ))}
            <line x1={40} y1={240} x2={240} y2={40} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />
            <path d={d} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />
            <line x1={40} y1={240} x2={40 + x1 * 200} y2={40 + (1 - y1) * 200} stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 2" />
            <line x1={240} y1={40} x2={40 + x2 * 200} y2={40 + (1 - y2) * 200} stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx={40 + x1 * 200} cy={40 + (1 - y1) * 200} r="8" fill="#fff" stroke="#6366f1" strokeWidth="2"
              onPointerDown={(e) => { e.preventDefault(); setDragging("p1"); }} className="cursor-grab" />
            <circle cx={40 + x2 * 200} cy={40 + (1 - y2) * 200} r="8" fill="#fff" stroke="#ec4899" strokeWidth="2"
              onPointerDown={(e) => { e.preventDefault(); setDragging("p2"); }} className="cursor-grab" />
            <line x1={40} y1={245} x2={240} y2={245} stroke="#e4e4e7" strokeWidth="0.5" />
            <circle id="preview-ball" cx="150" cy="245" r="5" fill="#6366f1" opacity="0.8" />
          </svg>

          <div className="mt-3 flex items-center justify-between max-w-[360px] mx-auto">
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{css}</span>
            <button onClick={play} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
              {playing ? "Stop" : "▶ Play"}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3 max-w-[360px] mx-auto">
            {([["x1", x1, setX1], ["y1", y1, setY1], ["x2", x2, setX2], ["y2", y2, setY2]] as [string, number, (v: number) => void][]).map(([label, val, set]) => (
              <div key={label}>
                <span className="text-[10px] text-zinc-400">{label}</span>
                <input type="number" min={0} max={1} step={0.01} value={val.toFixed(2)}
                  onChange={(e) => set(clampPoint(Number(e.target.value) || 0))}
                  className="w-full px-1.5 py-1 text-xs font-mono rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-center focus:outline-none focus:border-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Preview + export */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <h3 className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Preview</h3>
            <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
              <div
                className="w-10 h-10 bg-indigo-500 rounded-xl shadow-sm"
                style={{ animation: playing ? "none" : `moveX 2s ${css} infinite alternate` }}
              />
            </div>
            <style>{`@keyframes moveX { from { transform: translateX(-40px); } to { transform: translateX(40px); } }`}</style>
            <p className="text-[10px] text-zinc-400 mt-2 text-center">moveX 2s {css} infinite alternate</p>
          </div>

          <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl p-4 border border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-500">CSS</span>
              <button onClick={() => navigator.clipboard.writeText(cssCode)}
                className="text-[10px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md transition-colors">Copy</button>
            </div>
            <pre className="text-xs font-mono text-zinc-300 leading-relaxed"><code>{cssCode}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
}
