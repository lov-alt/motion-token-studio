import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useI18n } from "./i18n/index";

const NAV = [
  { path: "/easing", key: "easing" as const },
  { path: "/durations", key: "durations" as const },
  { path: "/presets", key: "presets" as const },
  { path: "/export", key: "export" as const },
];

export default function App() {
  const { locale, t, setLocale, available } = useI18n();
  const loc = useLocation();
  const isHome = loc.pathname === "/";

  return (
    <div style={{ minHeight: "100vh", background: "#09090b", fontFamily: "system-ui, sans-serif" }}>
      <header style={{
        borderBottom: isHome ? "none" : "1px solid #27272a",
        background: "rgba(9,9,11,0.9)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50, padding: "0 24px",
      }}>
        <div style={{ maxWidth: 960, margin: "0 auto", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ fontWeight: 500, color: "#f4f4f5", textDecoration: "none", fontSize: 15, letterSpacing: "-0.01em" }}>
            {t.app.title}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {!isHome && NAV.map((n) => (
              <Link key={n.path} to={n.path} style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500, textDecoration: "none",
                color: loc.pathname === n.path ? "#818cf8" : "#71717a",
                background: loc.pathname === n.path ? "rgba(99,102,241,0.1)" : "transparent",
                transition: "all 0.15s",
              }}>{t.nav[n.key]}</Link>
            ))}
            <select value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)}
              style={{ padding: "4px 8px", fontSize: 11, borderRadius: 8, border: "1px solid #27272a", background: "transparent", color: "#71717a", cursor: "pointer", marginLeft: 8 }}>
              {available.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
            </select>
          </div>
        </div>
      </header>
      <main><Outlet /></main>
    </div>
  );
}
