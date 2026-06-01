export function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): { x: number; y: number } {
  const mt = 1 - t;
  const x = 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t;
  const y = 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t;
  return { x, y };
}

export function sampleCurve(x1: number, y1: number, x2: number, y2: number, steps = 60): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    points.push(cubicBezier(i / steps, x1, y1, x2, y2));
  }
  return points;
}

export function formatCSS(x1: number, y1: number, x2: number, y2: number): string {
  return `cubic-bezier(${[x1, y1, x2, y2].map((v) => v.toFixed(2)).join(", ")})`;
}

export function clampPoint(v: number): number {
  return Math.max(0, Math.min(1, Math.round(v * 100) / 100));
}
