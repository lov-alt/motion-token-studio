import { useState } from "react";
import { createStore } from "../engine/tokens";
import type { DurationToken } from "../engine/tokens";

const bar: React.CSSProperties = { borderRadius: 16, border: "1px solid #27272a", overflow: "hidden" };
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #27272a22" };
const sliderTrack: React.CSSProperties = { flex: 1, height: 4, background: "#27272a", borderRadius: 99, position: "relative" };
const inp: React.CSSProperties = { width: 72, padding: "6px 8px", fontSize: 12, borderRadius: 8, border: "1px solid #27272a", background: "transparent", color: "#e4e4e7", outline: "none", fontFamily: "monospace", textAlign: "right" };

export default function Durations() {
  const [durations, setDurations] = useState<DurationToken[]>(() => createStore().durations);

  const up = (id: string, ms: number) => setDurations((p) => p.map((d) => (d.id === id ? { ...d, ms } : d)));

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 48 }}>
      <h1 style={{ fontSize: 22, fontWeight: 300, color: "#f4f4f5", margin: "0 0 4px" }}>Duration Tokens</h1>
      <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 32px" }}>Define your animation timing scale</p>

      <div style={bar}>
        <div style={{ ...row, background: "rgba(255,255,255,0.02)" }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", width: 80 }}>Name</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", flex: 1 }}>Duration</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", width: 72, textAlign: "right" }}>Value</span>
        </div>
        {durations.map((d) => (
          <div key={d.id} style={row}>
            <span style={{ fontSize: 13, color: "#e4e4e7", fontWeight: 500, width: 80 }}>{d.name}</span>
            <div style={sliderTrack}>
              <input type="range" min={0} max={1200} step={10} value={d.ms}
                onChange={(e) => up(d.id, Number(e.target.value))}
                style={{ position: "absolute", inset: 0, width: "100%", opacity: 0, cursor: "pointer" }} />
              <div style={{ height: "100%", width: `${(d.ms / 1200) * 100}%`, background: "#6366f1", borderRadius: 99, transition: "width 0.1s" }} />
            </div>
            <input type="number" value={d.ms} min={0} max={5000} step={10} onChange={(e) => up(d.id, Number(e.target.value) || 0)} style={inp} />
            <span style={{ fontSize: 11, color: "#52525b" }}>ms</span>
          </div>
        ))}
      </div>
    </div>
  );
}
