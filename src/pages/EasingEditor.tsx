import { useState, useRef, useEffect, useCallback } from "react";
import { useI18n } from "../i18n/index";
import { sampleCurve, formatCSS, clampPoint } from "../engine/bezier";
import { createStore } from "../engine/tokens";

const SIZE = 280;
const PAD = 40;
const INNER = SIZE - PAD * 2;

export default function EasingEditor() {
  const { t } = useI18n();
  const store = createStore();
  const [selected, setSelected] = useState("ease-in-out");
  const [x1, setX1] = useState(0.42);
  const [y1, setY1] = useState(0);
  const [x2, setX2] = useState(0.58);
  const [y2, setY2] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [ballProgress, setBallProgress] = useState(0);
  const animRef = useRef<number>(0);
  const [dragging, setDragging] = useState<"p1" | "p2" | null>(null);

  const applyPreset = (id: string) => {
    const curve = store.easings.find((c) => c.id === id) ?? store.easings[3];
    setSelected(id);
    setX1(curve.x1); setY1(curve.y1); setX2(curve.x2); setY2(curve.y2);
  };

  const toCanvas = (x: number, y: number): [number, number] => [PAD + x * INNER, PAD + (1 - y) * INNER];

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragging) return;
    const svg = document.getElementById("bezier-svg");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const scale = SIZE / rect.width;
    const nx = clampPoint(((e.clientX - rect.left) * scale - PAD) / INNER);
    const ny = clampPoint(1 - ((e.clientY - rect.top) * scale - PAD) / INNER);
    if (dragging === "p1") { setX1(nx); setY1(ny); }
    else { setX2(nx); setY2(ny); }
  }, [dragging]);

  const handlePointerUp = useCallback(() => setDragging(null), []);

  useEffect(() => {
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => { window.removeEventListener("pointermove", handlePointerMove); window.removeEventListener("pointerup", handlePointerUp); };
  }, [handlePointerMove, handlePointerUp]);

  const play = () => {
    if (playing) { cancelAnimationFrame(animRef.current); setPlaying(false); setBallProgress(0); return; }
    setPlaying(true); setBallProgress(0);
    const start = performance.now();
    const duration = 2000;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const curveY = sampleCurve(x1, y1, x2, y2, 200)[Math.floor(t * 200)]?.y ?? t;
      setBallProgress(curveY);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
      else { setPlaying(false); setBallProgress(1); }
    };
    animRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const curvePoints = sampleCurve(x1, y1, x2, y2, 80);
  const pathD = curvePoints.map((p, i) => {
    const [cx, cy] = toCanvas(p.x, p.y);
    return `${i === 0 ? "M" : "L"} ${cx} ${cy}`;
  }).join(" ");

  const [p1x, p1y] = toCanvas(x1, y1);
  const [p2x, p2y] = toCanvas(x2, y2);
  const ballX = PAD + ballProgress * INNER;
  const ballY = PAD + 10;

  const cssValue = formatCSS(x1, y1, x2, y2);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">{t.easing.title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.easing.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Presets panel */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 space-y-1.5">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t.easing.preset}</h3>
          {store.easings.map((c) => (
            <button key={c.id} type="button" onClick={() => applyPreset(c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selected === c.id
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-medium"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              }`}>{c.name} <span className="text-zinc-400 text-xs float-right font-mono">{c.css}</span></button>
          ))}
        </div>

        {/* Curve editor */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{t.easing.custom}</h3>

          <svg id="bezier-svg" viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full touch-none select-none cursor-crosshair">
            {/* Grid */}
            {[0.25, 0.5, 0.75].map((v) => (
              <g key={v}>
                <line x1={PAD + v * INNER} y1={PAD} x2={PAD + v * INNER} y2={PAD + INNER} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1={PAD} y1={PAD + v * INNER} x2={PAD + INNER} y2={PAD + v * INNER} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" />
              </g>
            ))}
            {/* Diagonal */}
            <line x1={PAD} y1={PAD + INNER} x2={PAD + INNER} y2={PAD} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5" />

            {/* Curve path */}
            <path d={pathD} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" />

            {/* Control lines */}
            <line x1={PAD} y1={PAD + INNER} x2={p1x} y2={p1y} stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 2" />
            <line x1={PAD + INNER} y1={PAD} x2={p2x} y2={p2y} stroke="#a5b4fc" strokeWidth="1" strokeDasharray="4 2" />

            {/* Control points */}
            <circle cx={p1x} cy={p1y} r="8" fill="white" stroke="#6366f1" strokeWidth="2"
              onPointerDown={(e) => { e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging("p1"); }}
              className="cursor-grab active:cursor-grabbing hover:fill-indigo-50" />
            <circle cx={p2x} cy={p2y} r="8" fill="white" stroke="#ec4899" strokeWidth="2"
              onPointerDown={(e) => { e.preventDefault(); (e.target as Element).setPointerCapture?.(e.pointerId); setDragging("p2"); }}
              className="cursor-grab active:cursor-grabbing hover:fill-pink-50" />

            {/* Ball track */}
            <line x1={PAD} y1={ballY} x2={PAD + INNER} y2={ballY} stroke="#e4e4e7" strokeWidth="1" />
            <circle cx={ballX} cy={ballY} r="6" fill="#6366f1" opacity="0.8" />
          </svg>

          {/* CSS value */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400">{cssValue}</span>
            <div className="flex gap-2">
              <button type="button" onClick={play}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">{playing ? "Stop" : t.easing.play}</button>
              <button type="button" onClick={() => applyPreset("linear")}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">{t.easing.reset}</button>
            </div>
          </div>

          {/* Numeric inputs */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {([
              ["x1", x1, setX1] as const, ["y1", y1, setY1] as const,
              ["x2", x2, setX2] as const, ["y2", y2, setY2] as const,
            ] as readonly [string, number, (v: number) => void][]).map(([label, val, set]) => (
              <div key={label as string}>
                <span className="text-[10px] text-zinc-400">{label}</span>
                <input type="number" min={0} max={1} step={0.01} value={(val as number).toFixed(2)}
                  onChange={(e) => (set as (v: number) => void)(clampPoint(Number(e.target.value) || 0))}
                  className="w-full px-1.5 py-1 text-xs font-mono rounded border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-center focus:outline-none focus:border-indigo-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Info + Preview */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">{t.easing.preview}</h3>
            <div className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden relative">
              <div
                className="w-10 h-10 bg-indigo-500 rounded-xl shadow-sm"
                style={{
                  animation: playing ? `none` : `moveX 2s cubic-bezier(${x1},${y1},${x2},${y2}) infinite alternate`,
                }}
              />
            </div>
            <style>{`@keyframes moveX { from { transform: translateX(-40px); } to { transform: translateX(40px); } }`}</style>
            <p className="text-[10px] text-zinc-400 mt-2 text-center">moveX 2s {cssValue} infinite alternate</p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Copy CSS</h3>
            <pre className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 p-3 rounded-lg whitespace-pre-wrap">
{`transition: all 300ms ${cssValue};`}
            </pre>
            <button type="button"
              onClick={() => navigator.clipboard.writeText(`transition: all 300ms ${cssValue};`)}
              className="mt-2 w-full py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors">Copy</button>
          </div>
        </div>
      </div>
    </div>
  );
}
