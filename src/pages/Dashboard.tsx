import { Link } from "react-router-dom";
import { createStore } from "../engine/tokens";
import { sampleCurve } from "../engine/bezier";

const CARDS = [
  { path: "/easing", label: "Easing Curves", icon: "⌁", color: "#6366f1", desc: "Interactive cubic-bezier curve editor with live preview ball" },
  { path: "/durations", label: "Durations", icon: "◎", color: "#10b981", desc: "Animation timing scale — instant to gentle" },
  { path: "/presets", label: "Motion Presets", icon: "✦", color: "#f59e0b", desc: "12 production-ready patterns across 4 categories" },
  { path: "/export", label: "Export", icon: "↓", color: "#0ea5e9", desc: "CSS, Framer Motion, SwiftUI, Flutter — one click" },
];

export default function Dashboard() {
  const store = createStore();

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 300, color: "#f4f4f5", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Motion Token Studio</h1>
      <p style={{ fontSize: 13, color: "#71717a", margin: "0 0 40px" }}>
        {store.easings.length} easing curves · {store.durations.length} durations · {store.presets.length} presets
      </p>

      {/* Easing miniatures */}
      <h3 style={{ fontSize: 10, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Easing Curves</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, marginBottom: 32 }}>
        {store.easings.map((c) => {
          const pts = sampleCurve(c.x1, c.y1, c.x2, c.y2, 15);
          const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${3 + p.x * 34} ${22 - p.y * 18}`).join(" ");
          return (
            <Link key={c.id} to="/easing" style={{
              background: "linear-gradient(135deg, #18181b, #1e1e2e)", borderRadius: 12,
              border: "1px solid #27272a", padding: "12px 10px", textDecoration: "none",
              transition: "all 0.15s",
            }}>
              <svg viewBox="0 0 40 24" style={{ width: "100%", height: 26 }}>
                <path d={d} fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 500, color: "#71717a", marginTop: 6, display: "block", textAlign: "center" }}>{c.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Duration bar */}
      <h3 style={{ fontSize: 10, fontWeight: 600, color: "#52525b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Durations</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 40 }}>
        {store.durations.map((d) => (
          <Link key={d.id} to="/durations" style={{
            flex: 1, textAlign: "center", padding: "14px 8px",
            background: "linear-gradient(135deg, #18181b, #1e1e2e)", borderRadius: 12,
            border: "1px solid #27272a", textDecoration: "none",
            transition: "all 0.15s",
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#f4f4f5", fontFamily: "monospace" }}>{d.ms}<span style={{ fontSize: 12, fontWeight: 400, color: "#71717a" }}>ms</span></div>
            <div style={{ fontSize: 10, color: "#71717a", marginTop: 2 }}>{d.name}</div>
            <div style={{ height: 2, background: "#27272a", borderRadius: 1, marginTop: 6 }}>
              <div style={{ height: "100%", background: "#6366f1", borderRadius: 1, width: `${(d.ms / 800) * 100}%` }} />
            </div>
          </Link>
        ))}
      </div>

      {/* Module cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
        {CARDS.map((m) => (
          <Link key={m.path} to={m.path} style={{
            display: "flex", alignItems: "flex-start", gap: 16, padding: 20,
            borderRadius: 16, border: "1px solid #27272a",
            background: "linear-gradient(135deg, #18181b 0%, #1a1a2e 100%)",
            textDecoration: "none", transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${m.color}20`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#27272a"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#fff", flexShrink: 0, boxShadow: `0 4px 12px ${m.color}40` }}>
              {m.icon}
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: "#f4f4f5", margin: "0 0 4px" }}>{m.label}</h3>
              <p style={{ fontSize: 12, color: "#71717a", margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
