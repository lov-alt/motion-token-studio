import { useState } from "react";
import { useI18n } from "../i18n/index";
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
  const { t } = useI18n();
  const store = createStore();
  const [fmt, setFmt] = useState<Format>("css-transition");
  const [copied, setCopied] = useState(false);

  const ee = store.easings[3]; // ease-in-out
  const dd = store.durations[3]; // 300ms

  const codeMap: Record<Format, string> = {
    "css-transition": [
      `/* Duration tokens */`,
      `:root {`,
      ...store.durations.map((d) => `  --duration-${d.id}: ${d.ms}ms;`),
      `}`,
      ``,
      `/* Usage */`,
      `.button {`,
      `  transition: all var(--duration-md) ${ee.css};`,
      `}`,
    ].join("\n"),

    "css-keyframes": [
      `@keyframes fadeIn {`,
      `  from { opacity: 0; transform: translateY(8px); }`,
      `  to   { opacity: 1; transform: translateY(0);  }`,
      `}`,
      ``,
      `.animate-in {`,
      `  animation: fadeIn ${dd.ms}ms ${ee.css} both;`,
      `}`,
    ].join("\n"),

    framer: [
      `import { motion } from "framer-motion";`,
      ``,
      `const fadeIn = {`,
      `  hidden:  { opacity: 0, y: 8 },`,
      `  visible: {`,
      `    opacity: 1,`,
      `    y: 0,`,
      `    transition: { duration: ${(dd.ms / 1000).toFixed(1)}, ease: [${ee.x1}, ${ee.y1}, ${ee.x2}, ${ee.y2}] },`,
      `  },`,
      `};`,
      ``,
      `<motion.div variants={fadeIn} initial="hidden" animate="visible" />`,
    ].join("\n"),

    swiftui: [
      `import SwiftUI`,
      ``,
      `struct MyView: View {`,
      `  @State private var appear = false`,
      ``,
      `  var body: some View {`,
      `    Rectangle()`,
      `      .opacity(appear ? 1 : 0)`,
      `      .offset(y: appear ? 0 : 8)`,
      `      .animation(.timingCurve(${ee.x1}, ${ee.y1}, ${ee.x2}, ${ee.y2}, duration: ${(dd.ms / 1000).toFixed(1)}), value: appear)`,
      `      .onAppear { appear = true }`,
      `  }`,
      `}`,
    ].join("\n"),

    flutter: [
      `import 'package:flutter/material.dart';`,
      ``,
      `class FadeInWidget extends StatefulWidget {`,
      `  @override`,
      `  _FadeInWidgetState createState() => _FadeInWidgetState();`,
      `}`,
      ``,
      `class _FadeInWidgetState extends State<FadeInWidget>`,
      `    with SingleTickerProviderStateMixin {`,
      `  late AnimationController _ctrl;`,
      `  late Animation<double> _opacity;`,
      `  late Animation<Offset> _slide;`,
      ``,
      `  @override void initState() {`,
      `    super.initState();`,
      `    _ctrl = AnimationController(`,
      `      duration: Duration(milliseconds: ${dd.ms}),`,
      `      vsync: this,`,
      `    );`,
      `    _opacity = Tween(begin: 0.0, end: 1.0)`,
      `      .animate(CurvedAnimation(`,
      `        parent: _ctrl,`,
      `        curve: Cubic(${ee.x1}, ${ee.y1}, ${ee.x2}, ${ee.y2}),`,
      `      ));`,
      `    _slide = Tween(begin: Offset(0, 0.1), end: Offset.zero)`,
      `      .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut));`,
      `    _ctrl.forward();`,
      `  }`,
      ``,
      `  @override Widget build(BuildContext context) {`,
      `    return FadeTransition(`,
      `      opacity: _opacity,`,
      `      child: SlideTransition(position: _slide, child: child),`,
      `    );`,
      `  }`,
      `}`,
    ].join("\n"),
  };

  const code = codeMap[fmt];

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">{t.export.title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.export.desc}</p>
      </div>

      <div className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800">
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/60 border-b border-zinc-800">
          <div className="flex gap-0.5 flex-wrap">
            {(Object.keys(LABELS) as Format[]).map((f) => (
              <button key={f} type="button" onClick={() => setFmt(f)}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all ${
                  fmt === f ? "bg-indigo-600 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-200"
                }`}>{LABELS[f]}</button>
            ))}
          </div>
          <button type="button" onClick={copy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all">
            {copied ? t.export.copied : t.export.copy}
          </button>
        </div>
        <pre className="p-5 text-sm text-zinc-200 font-mono leading-relaxed overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
