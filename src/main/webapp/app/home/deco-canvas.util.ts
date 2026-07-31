// ================================================================
// MEDILINK — DECORATIVE CANVAS ENGINE
// src/app/home/deco-canvas.util.ts
// ================================================================

export function initDecoCanvas2(): () => void {
  const canvas = document.getElementById('ml-deco-canvas2') as HTMLCanvasElement;
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d')!;

  const BLUE = (a: number) => `rgba(38,128,255,${a})`;
  const GREEN = (a: number) => `rgba(0,200,140,${a})`;
  const ORANGE = (a: number) => `rgba(255,95,64,${a})`;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // ── Polyfill for roundRect ────────────────────────────────
  function fillRoundRect(x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  }

  // ── DNA helix ─────────────────────────────────────────────
  function drawDNA(t: number, x: number, alpha: number) {
    const amp = 26,
      freq = 0.03,
      step = 6;
    for (let y = -40; y < H() + 40; y += step) {
      const phase = y * freq + t;
      const x1 = x + Math.sin(phase) * amp;
      const x2 = x + Math.sin(phase + Math.PI) * amp;

      ctx.beginPath();
      ctx.arc(x1, y, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = BLUE(alpha * 0.45);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x2, y, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = GREEN(alpha * 0.45);
      ctx.fill();

      if (Math.round(y / step) % 4 === 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.strokeStyle = BLUE(alpha * 0.18);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  // ── ECG heartbeat ─────────────────────────────────────────
  function ecgY(x: number, offset: number): number {
    const t = (((x + offset) % 200) + 200) % 200;
    if (t < 40) return 0;
    if (t < 50) return -(t - 40) * 4;
    if (t < 60) return -(50 - t) * 4;
    if (t < 80) return 0;
    if (t < 85) return -(t - 80) * 10;
    if (t < 90) return (t - 85) * 30 - 50;
    if (t < 95) return (90 - t) * 30 + 100;
    if (t < 100) return (t - 95) * 8 - 50;
    if (t < 110) return -(t - 100) * 2.5;
    if (t < 130) return -25 + Math.sin(((t - 110) / 20) * Math.PI) * 16;
    return 0;
  }

  function drawECG(t: number, baseY: number, color: (a: number) => string, alpha: number, speed: number, scale: number) {
    ctx.beginPath();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = color(alpha);
    for (let x = 0; x <= W(); x += 2) {
      const y = baseY + ecgY(x, t * speed * 80) * scale;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // ── Molecules ─────────────────────────────────────────────
  interface Molecule {
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    color: (a: number) => string;
    phase: number;
  }

  const mols: Molecule[] = Array.from({ length: 10 }, (_, i) => ({
    x: 80 + Math.random() * (window.innerWidth - 160),
    y: 80 + Math.random() * (window.innerHeight - 160),
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    r: 13 + Math.random() * 9,
    color: [BLUE, GREEN, ORANGE][i % 3],
    phase: Math.random() * Math.PI * 2,
  }));

  function drawMolecules(t: number) {
    const w = W(),
      h = H();
    mols.forEach(m => {
      m.x += m.vx;
      m.y += m.vy;
      if (m.x < 30 || m.x > w - 30) m.vx *= -1;
      if (m.y < 30 || m.y > h - 30) m.vy *= -1;

      const pulse = 1 + Math.sin(t * 1.1 + m.phase) * 0.07;

      mols.forEach(n => {
        if (n === m) return;
        const dx = n.x - m.x,
          dy = n.y - m.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = m.color((1 - dist / 130) * 0.1);
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      });

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * pulse * 1.6, 0, Math.PI * 2);
      ctx.strokeStyle = m.color(0.07);
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(m.x, m.y, m.r * pulse * 0.42, 0, Math.PI * 2);
      ctx.fillStyle = m.color(0.14);
      ctx.fill();
      ctx.strokeStyle = m.color(0.28);
      ctx.lineWidth = 1.1;
      ctx.stroke();
    });
  }

  // ── Floating crosses ──────────────────────────────────────
  const crosses = [
    { rx: 0.03, ry: 0.12, size: 20, phase: 0.0, color: BLUE },
    { rx: 0.96, ry: 0.2, size: 16, phase: 1.3, color: GREEN },
    { rx: 0.04, ry: 0.78, size: 18, phase: 2.5, color: ORANGE },
    { rx: 0.97, ry: 0.7, size: 14, phase: 0.9, color: BLUE },
    { rx: 0.5, ry: 0.04, size: 12, phase: 1.7, color: GREEN },
    { rx: 0.5, ry: 0.96, size: 11, phase: 3.0, color: ORANGE },
  ];

  function drawCrosses(t: number) {
    const w = W(),
      h = H();
    crosses.forEach(c => {
      const fx = Math.cos(t * 0.35 + c.phase) * 7;
      const fy = Math.sin(t * 0.5 + c.phase) * 10;
      const cx = c.rx * w + fx;
      const cy = c.ry * h + fy;
      const s = c.size,
        thick = s * 0.3;

      ctx.fillStyle = c.color(0.1);
      // horizontal bar
      fillRoundRect(cx - s, cy - thick / 2, s * 2, thick, 2);
      // vertical bar
      fillRoundRect(cx - thick / 2, cy - s, thick, s * 2, 2);
    });
  }

  // ── Spinning rings ────────────────────────────────────────
  const rings = [
    { rx: 0.08, ry: 0.25, r: 55, speed: 0.004, color: BLUE, alpha: 0.1 },
    { rx: 0.92, ry: 0.75, r: 45, speed: -0.005, color: GREEN, alpha: 0.1 },
    { rx: 0.92, ry: 0.22, r: 38, speed: 0.006, color: ORANGE, alpha: 0.08 },
    { rx: 0.08, ry: 0.78, r: 42, speed: -0.004, color: BLUE, alpha: 0.08 },
  ];

  function drawRings(t: number) {
    const w = W(),
      h = H();
    rings.forEach(ring => {
      ctx.save();
      ctx.translate(ring.rx * w, ring.ry * h);
      ctx.rotate(t * ring.speed * 60);
      ctx.beginPath();
      ctx.arc(0, 0, ring.r, 0, Math.PI * 2);
      ctx.setLineDash([6, 8]);
      ctx.strokeStyle = ring.color(ring.alpha);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.rotate(-t * ring.speed * 90);
      ctx.beginPath();
      ctx.arc(0, 0, ring.r * 0.55, 0, Math.PI * 2);
      ctx.strokeStyle = ring.color(ring.alpha * 0.7);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.restore();
    });
  }

  // ── Render loop ───────────────────────────────────────────
  let tick = 0;
  let raf: number;

  function draw() {
    ctx.clearRect(0, 0, W(), H());
    drawDNA(tick * 0.38, 36, 0.85);
    drawDNA(tick * 0.38, W() - 36, 0.85);
    drawECG(tick, H() * 0.3, GREEN, 0.18, 0.28, 0.38);
    drawECG(tick, H() * 0.7, BLUE, 0.15, 0.22, 0.35);
    drawRings(tick);
    drawMolecules(tick);
    drawCrosses(tick);
    tick += 0.012;
    raf = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}

export function initDecoCanvas(): () => void {
  const canvas = document.getElementById('ml-deco-canvas') as HTMLCanvasElement;
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d')!;

  // ── Colors ───────────────────────────────────────────────────
  const BLUE = (a: number) => `rgba(38,128,255,${a})`;
  const TEAL = (a: number) => `rgba(0,200,140,${a})`;

  // ── Resize ───────────────────────────────────────────────────
  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    rebuildStaticElements();
  }

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // ── 1. Breath rings ──────────────────────────────────────────
  interface BreathRing {
    rx: number;
    ry: number;
    baseR: number;
    color: (a: number) => string;
    phase: number;
    speed: number;
  }

  let breathRings: BreathRing[] = [];

  // ── 2. Dot grid ──────────────────────────────────────────────
  interface Dot {
    x: number;
    y: number;
    phase: number;
  }
  let dots: Dot[] = [];
  const DOT_SPACING = 36;

  // ── 3. Pills ─────────────────────────────────────────────────
  interface Pill {
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    angle: number;
    vAngle: number;
    color: (a: number) => string;
    phase: number;
  }

  let pills: Pill[] = [];

  // ── 4. Plus symbols ──────────────────────────────────────────
  interface Plus {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    phase: number;
    color: (a: number) => string;
  }

  let plusSymbols: Plus[] = [];

  function rebuildStaticElements() {
    const w = W(),
      h = H();

    breathRings = [
      { rx: 0.18, ry: 0.3, baseR: 90, color: BLUE, phase: 0.0, speed: 0.008 },
      { rx: 0.82, ry: 0.65, baseR: 110, color: TEAL, phase: 2.1, speed: 0.007 },
      { rx: 0.5, ry: 0.5, baseR: 75, color: BLUE, phase: 1.2, speed: 0.009 },
      { rx: 0.85, ry: 0.18, baseR: 60, color: TEAL, phase: 3.0, speed: 0.01 },
      { rx: 0.14, ry: 0.78, baseR: 65, color: BLUE, phase: 1.7, speed: 0.008 },
    ];

    dots = [];
    for (let x = DOT_SPACING; x < w; x += DOT_SPACING) {
      for (let y = DOT_SPACING; y < h; y += DOT_SPACING) {
        dots.push({ x, y, phase: Math.random() * Math.PI * 2 });
      }
    }

    pills = Array.from({ length: 9 }, (_, i) => ({
      x: 80 + Math.random() * (w - 160),
      y: 60 + Math.random() * (h - 120),
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      w: 28 + Math.random() * 20,
      h: 11 + Math.random() * 6,
      angle: Math.random() * Math.PI,
      vAngle: (Math.random() - 0.5) * 0.004,
      color: i % 2 === 0 ? BLUE : TEAL,
      phase: Math.random() * Math.PI * 2,
    }));

    plusSymbols = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      size: 5 + Math.random() * 8,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? TEAL : BLUE,
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  // ── ECG shape ────────────────────────────────────────────────
  function ecgY(x: number, offset: number): number {
    const t = (((x + offset) % 240) + 240) % 240;
    if (t < 50) return 0;
    if (t < 58) return -(t - 50) * 2.5;
    if (t < 66) return -(58 - (t - 58)) * 2.5;
    if (t < 90) return 0;
    if (t < 95) return -(t - 90) * 9;
    if (t < 100) return (t - 95) * 34 - 45;
    if (t < 105) return (100 - t) * 34 + 120;
    if (t < 110) return (t - 105) * 7 - 50;
    if (t < 120) return -(t - 110) * 2;
    if (t < 145) return -20 + Math.sin(((t - 120) / 25) * Math.PI) * 14;
    return 0;
  }

  interface EcgLine {
    ry: number;
    speed: number;
    scale: number;
    color: (a: number) => string;
    alpha: number;
  }

  const ecgLines: EcgLine[] = [
    { ry: 0.38, speed: 0.3, scale: 0.32, color: TEAL, alpha: 0.18 },
    { ry: 0.62, speed: 0.22, scale: 0.28, color: BLUE, alpha: 0.14 },
  ];

  // ── Draw helpers ─────────────────────────────────────────────
  function drawBreathRing(b: BreathRing, t: number) {
    const cx = b.rx * W(),
      cy = b.ry * H();
    const pulse = Math.sin(t * b.speed * 60 + b.phase);
    const r1 = b.baseR * (1 + pulse * 0.08);
    const a = 0.06 + Math.abs(pulse) * 0.04;

    [r1 * 2.1, r1 * 1.55, r1].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = b.color(a * (1 - i * 0.22));
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = b.color(0.25);
    ctx.fill();
  }

  function drawConnectionArc(x1: number, y1: number, x2: number, y2: number, color: (a: number) => string, alpha: number) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.18;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(mx, my, x2, y2);
    ctx.strokeStyle = color(alpha);
    ctx.lineWidth = 0.6;
    ctx.stroke();
  }

  function drawPill(p: Pill, t: number) {
    const pulse = 1 + Math.sin(t + p.phase) * 0.06;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    const pw = p.w * pulse,
      ph = p.h * pulse,
      r = ph / 2;
    ctx.beginPath();
    ctx.moveTo(-pw / 2 + r, -ph / 2);
    ctx.arcTo(pw / 2, -ph / 2, pw / 2, ph / 2, r);
    ctx.arcTo(pw / 2, ph / 2, -pw / 2, ph / 2, r);
    ctx.arcTo(-pw / 2, ph / 2, -pw / 2, -ph / 2, r);
    ctx.arcTo(-pw / 2, -ph / 2, pw / 2, -ph / 2, r);
    ctx.closePath();
    ctx.strokeStyle = p.color(0.2);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -ph / 2 + 1.5);
    ctx.lineTo(0, ph / 2 - 1.5);
    ctx.strokeStyle = p.color(0.1);
    ctx.lineWidth = 0.7;
    ctx.stroke();
    ctx.restore();
  }

  function drawPlus(p: Plus, t: number) {
    const pulse = 0.8 + Math.sin(t * 0.9 + p.phase) * 0.2;
    const s = p.size * pulse;
    const thick = s * 0.28;
    ctx.fillStyle = p.color(0.12);
    ctx.fillRect(p.x - s, p.y - thick / 2, s * 2, thick);
    ctx.fillRect(p.x - thick / 2, p.y - s, thick, s * 2);
  }

  function drawECGLine(line: EcgLine, t: number) {
    const baseY = line.ry * H();
    ctx.beginPath();
    ctx.lineWidth = 1.3;
    for (let x = 0; x <= W(); x += 2) {
      const y = baseY + ecgY(x, t * line.speed * 120) * line.scale;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = line.color(line.alpha);
    ctx.stroke();

    // travelling glow dot
    const glowX = (((t * line.speed * 60) % W()) + W()) % W();
    const glowY = baseY + ecgY(glowX, t * line.speed * 120) * line.scale;
    ctx.beginPath();
    ctx.arc(glowX, glowY, 3, 0, Math.PI * 2);
    ctx.fillStyle = line.color(0.6);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(glowX, glowY, 6, 0, Math.PI * 2);
    ctx.fillStyle = line.color(0.15);
    ctx.fill();
  }

  // ── Render loop ──────────────────────────────────────────────
  let tick = 0;
  let raf: number;

  function draw() {
    const w = W(),
      h = H();
    ctx.clearRect(0, 0, w, h);

    // dot grid
    dots.forEach(d => {
      const a = 0.04 + Math.sin(tick * 0.5 + d.phase) * 0.02;
      ctx.beginPath();
      ctx.arc(d.x, d.y, 1, 0, Math.PI * 2);
      ctx.fillStyle = BLUE(a);
      ctx.fill();
    });

    // connection arcs
    const bx = (i: number) => breathRings[i].rx * w;
    const by = (i: number) => breathRings[i].ry * h;
    drawConnectionArc(bx(0), by(0), bx(2), by(2), BLUE, 0.05);
    drawConnectionArc(bx(2), by(2), bx(1), by(1), TEAL, 0.05);
    drawConnectionArc(bx(3), by(3), bx(2), by(2), BLUE, 0.04);
    drawConnectionArc(bx(4), by(4), bx(2), by(2), TEAL, 0.04);

    // breath rings
    breathRings.forEach(b => drawBreathRing(b, tick));

    // ECG lines
    ecgLines.forEach(line => drawECGLine(line, tick));

    // pills
    pills.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.vAngle;
      if (p.x < -50) p.x = w + 50;
      if (p.x > w + 50) p.x = -50;
      if (p.y < -50) p.y = h + 50;
      if (p.y > h + 50) p.y = -50;
      drawPill(p, tick);
    });

    // plus symbols
    plusSymbols.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
      drawPlus(p, tick);
    });

    tick += 0.012;
    raf = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}

// ================================================================
// MEDILINK — DECORATIVE CANVAS v14 (Simple Medical)
// src/app/home/deco-canvas.util.ts
//
// Integration:
// 1. HTML — place OUTSIDE .homeContainer:
//    <canvas id="ml-deco-canvas"></canvas>
//
// 2. CSS:
//    #ml-deco-canvas {
//      position: fixed; top: 0; left: 0;
//      width: 100vw; height: 100vh;
//      pointer-events: none; z-index: 0;
//    }
//
// 3. home.component.ts:
//    private destroyCanvas!: () => void;
//    ngAfterViewInit() { this.destroyCanvas = initDecoCanvas(); }
//    ngOnDestroy()     { if (this.destroyCanvas) this.destroyCanvas(); }
// ================================================================

export function initDecoCanvas3(): () => void {
  const canvas = document.getElementById('ml-deco-canvas3') as HTMLCanvasElement;
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d')!;

  const B = (a: number) => `rgba(38,128,255,${a})`;
  const T = (a: number) => `rgba(0,200,140,${a})`;

  // ── resize ────────────────────────────────────────
  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    rebuild();
  }

  const W = () => window.innerWidth;
  const H = () => window.innerHeight;

  // ── types ─────────────────────────────────────────
  interface Cross {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    phase: number;
    color: (a: number) => string;
  }

  interface Pill {
    x: number;
    y: number;
    vx: number;
    vy: number;
    w: number;
    h: number;
    angle: number;
    vA: number;
    phase: number;
    color: (a: number) => string;
  }

  interface Orb {
    rx: number;
    ry: number;
    r: number;
    phase: number;
    color: (a: number) => string;
  }

  let crosses: Cross[] = [];
  let pills: Pill[] = [];

  const orbs: Orb[] = [
    { rx: 0.15, ry: 0.25, r: 220, color: B, phase: 0.0 },
    { rx: 0.85, ry: 0.7, r: 250, color: T, phase: 2.2 },
    { rx: 0.5, ry: 0.1, r: 190, color: B, phase: 4.1 },
  ];

  function rebuild() {
    const w = W(),
      h = H();

    crosses = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      size: 6 + Math.random() * 14,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? T : B,
    }));

    pills = Array.from({ length: 10 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      w: 20 + Math.random() * 16,
      h: 9 + Math.random() * 5,
      angle: Math.random() * Math.PI,
      vA: (Math.random() - 0.5) * 0.002,
      phase: Math.random() * Math.PI * 2,
      color: i % 2 === 0 ? B : T,
    }));
  }

  resize();
  window.addEventListener('resize', resize);

  // ── ECG ───────────────────────────────────────────
  function ecg(x: number): number {
    const t = ((x % 240) + 240) % 240;
    if (t < 60) return 0;
    if (t < 68) return -(t - 60) * 2.5;
    if (t < 76) return -(68 - (t - 68)) * 2.5;
    if (t < 98) return 0;
    if (t < 103) return -(t - 98) * 10;
    if (t < 108) return (t - 103) * 36 - 50;
    if (t < 113) return (108 - t) * 36 + 130;
    if (t < 118) return (t - 113) * 8 - 50;
    if (t < 130) return -(t - 118) * 2;
    if (t < 155) return -24 + Math.sin(((t - 130) / 25) * Math.PI) * 14;
    return 0;
  }

  // ── render loop ───────────────────────────────────
  let tick = 0;
  let tape = 0;
  let raf: number;

  function draw() {
    const w = W(),
      h = H();
    ctx.clearRect(0, 0, w, h);

    // soft background orbs
    orbs.forEach(o => {
      const cx = o.rx * w + Math.sin(tick * 0.3 + o.phase) * 18;
      const cy = o.ry * h + Math.cos(tick * 0.25 + o.phase) * 14;
      const r = o.r * (1 + Math.sin(tick * 0.4 + o.phase) * 0.08);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, o.color(0.05));
      g.addColorStop(1, o.color(0));
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });

    // crosses
    crosses.forEach(c => {
      c.x += c.vx;
      c.y += c.vy;
      if (c.x < -20) c.x = w + 20;
      if (c.x > w + 20) c.x = -20;
      if (c.y < -20) c.y = h + 20;
      if (c.y > h + 20) c.y = -20;
      const a = 0.05 + Math.abs(Math.sin(tick * 0.5 + c.phase)) * 0.07;
      const s = c.size,
        th = s * 0.22;
      ctx.fillStyle = c.color(a);
      ctx.fillRect(c.x - s, c.y - th / 2, s * 2, th);
      ctx.fillRect(c.x - th / 2, c.y - s, th, s * 2);
    });

    // pills
    pills.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.vA;
      if (p.x < -30) p.x = w + 30;
      if (p.x > w + 30) p.x = -30;
      if (p.y < -30) p.y = h + 30;
      if (p.y > h + 30) p.y = -30;
      const pulse = 1 + Math.sin(tick + p.phase) * 0.04;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      const pw = p.w * pulse,
        ph = p.h * pulse,
        r = ph / 2;
      ctx.beginPath();
      ctx.moveTo(-pw / 2 + r, -ph / 2);
      ctx.arcTo(pw / 2, -ph / 2, pw / 2, ph / 2, r);
      ctx.arcTo(pw / 2, ph / 2, -pw / 2, ph / 2, r);
      ctx.arcTo(-pw / 2, ph / 2, -pw / 2, -ph / 2, r);
      ctx.arcTo(-pw / 2, -ph / 2, pw / 2, -ph / 2, r);
      ctx.closePath();
      ctx.strokeStyle = p.color(0.15);
      ctx.lineWidth = 0.8;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -ph / 2 + 1.5);
      ctx.lineTo(0, ph / 2 - 1.5);
      ctx.strokeStyle = p.color(0.08);
      ctx.lineWidth = 0.6;
      ctx.stroke();
      ctx.restore();
    });

    // ECG line at bottom
    tape += 0.85;
    const baseY = h - 32;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const y = baseY + ecg(tape - (w - x)) * 0.17;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = T(0.18);
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // glowing scan dot
    const gx = (tape * 0.4) % w;
    const gy = baseY + ecg(tape) * 0.17;
    ctx.beginPath();
    ctx.arc(gx, gy, 3, 0, Math.PI * 2);
    ctx.fillStyle = T(0.55);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(gx, gy, 7, 0, Math.PI * 2);
    ctx.fillStyle = T(0.1);
    ctx.fill();

    tick += 0.012;
    raf = requestAnimationFrame(draw);
  }

  draw();

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
  };
}
