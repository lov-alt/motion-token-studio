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

  const [dark, setDark] = useState(() =>
    localStorage.getItem("motion-theme") === "dark"
  );

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("motion-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0f0f1a] transition-colors duration-300">
      <header className={`${isHome ? "" : "border-b border-zinc-200/60 dark:border-zinc-800/60"} bg-white/80 dark:bg-[#0f0f1a]/80 backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="font-medium tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 transition-colors">
            {t.app.title}
          </Link>
          <div className="flex items-center gap-1">
            {!isHome && NAV.map((n) => (
              <Link key={n.path} to={n.path}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                  loc.pathname === n.path
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                }`}>{t.nav[n.key]}</Link>
            ))}
            <select value={locale} onChange={(e) => setLocale(e.target.value as typeof locale)}
              className="ml-2 px-2 py-1 text-xs rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-500 dark:text-zinc-400 cursor-pointer">
              {available.map((l) => <option key={l.key} value={l.key}>{l.label}</option>)}
            </select>
            <button type="button" onClick={() => setDark(!dark)}
              className="w-7 h-7 flex items-center justify-center rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              aria-label={t.common.darkMode}>{dark ? "☀" : "☾"}</button>
          </div>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
    </div>
  );
}
