import { useState } from "react";
import { createStore } from "../engine/tokens";

const CATEGORIES = ["enter", "exit", "hover", "attention"] as const;

export default function Presets() {
  const store = createStore();
  const [cat, setCat] = useState<string>("enter");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const filtered = store.presets.filter((p) => p.category === cat);
  const selected = store.presets.find((p) => p.id === previewId);
  const timing = store.easings.find((e) => e.id === selected?.timing);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 48 }}>
      <h1 style={{ fontSize: 22, fontWeight: 300, color: "#f4f4f5", margin: "0 0 4px" }}>Motion Presets</h1>
      <p style={{ fontSize: 12, color: "#71717a", margin: "0 0 24px" }}>12 production-ready animation patterns, hover to preview</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            style={{ padding: "8px 18px", borderRadius: 10, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none", background: cat === c ? "#6366f1" : "rgba(255,255,255,0.04)", color: cat === c ? "#fff" : "#71717a" }}>
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
        {filtered.map((p) => (
          <div key={p.id} onClick={() => setPreviewId(p.id === previewId ? null : p.id)}
            onMouseEnter={() => setPreviewId(p.id)}
            style={{ padding: 16, borderRadius: 14, cursor: "pointer", border: `1px solid ${previewId === p.id ? "#6366f1" : "#27272a"}`, background: "linear-gradient(135deg, #18181b, #1e1e2e)", transition: "all 0.2s" }}>
            <div style={{ height: 56, borderRadius: 8, background: "rgba(255,255,255,0.03)", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: "#6366f1",
                animation: previewId === p.id ? `preview-${p.id} 1.5s ${timing?.css ?? "ease"} infinite alternate` : "none",
              }} />
            </div>
            <style>{previewId === p.id && timing ? `@keyframes preview-${p.id} { from { ${p.property.split(",").map((prop, i) => `${prop.trim()}: ${p.from.split(",")[i]?.trim() ?? p.from}`).join("; ")}; } to { ${p.property.split(",").map((prop, i) => `${prop.trim()}: ${p.to.split(",")[i]?.trim() ?? p.to}`).join("; ")}; } }` : ""}</style>
            <div style={{ fontSize: 13, color: "#e4e4e7", fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 11, color: "#71717a", marginTop: 2 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
