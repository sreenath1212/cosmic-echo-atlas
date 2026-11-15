import { useCallback, useEffect, useMemo, useRef } from "react";
import { Crosshair, Minus, Plus } from "lucide-react";

import {
  CONSTELLATIONS,
  DEEP_SKY,
  STAR_PALETTE,
  formatDec,
  formatRA,
  galacticToEquatorial,
  generateStarField,
  type Wavelength,
} from "@/lib/sky-data";

export interface SkyLayers {
  constellations: boolean;
  grid: boolean;
  milkyway: boolean;
  labels: boolean;
}

interface SkyMapProps {
  wavelength: Wavelength;
  layers: SkyLayers;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

const W0 = 2400;
const H0 = 1200;
const MAX_ZOOM_FACTOR = 14;

const toWorld = (ra: number, dec: number) => ({
  x: ((24 - ra) / 24) * W0,
  y: ((90 - dec) / 180) * H0,
});
const fromWorld = (x: number, y: number) => ({
  ra: (((24 - (x / W0) * 24) % 24) + 24) % 24,
  dec: 90 - (y / H0) * 180,
});
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const withAlpha = (c: string, a: number) => c.replace(/\)\s*$/, ` / ${a})`);

type View = { x: number; y: number; k: number };

export function SkyMap({ wavelength, layers, selectedId, onSelect }: SkyMapProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const view = useRef<View>({ x: 0, y: 0, k: 1 });
  const target = useRef<View | null>(null);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const hover = useRef<string | null>(null);
  const drag = useRef<{ x: number; y: number; moved: number; id: number } | null>(null);
  const props = useRef({ wavelength, layers, selectedId });
  props.current = { wavelength, layers, selectedId };

  const stars = useMemo(() => generateStarField(5200), []);
  const galaxyBand = useMemo(() => {
    const pts: { x: number; y: number; core: number }[] = [];
    for (let l = 0; l < 360; l += 1.5) {
      for (const b of [-4, 0, 4]) {
        const eq = galacticToEquatorial(l, b);
        const p = toWorld(eq.ra, eq.dec);
        const core = Math.pow(Math.max(0, Math.cos((l * Math.PI) / 180)), 3);
        pts.push({ x: p.x, y: p.y, core: b === 0 ? core : core * 0.5 });
      }
    }
    return pts;
  }, []);
  const ecliptic = useMemo(() => {
    const eps = (23.44 * Math.PI) / 180;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 360; i += 2) {
      const lam = (i * Math.PI) / 180;
      const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
      let ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
      if (ra < 0) ra += 2 * Math.PI;
      pts.push(toWorld((ra * 12) / Math.PI, (dec * 180) / Math.PI));
    }
    return pts;
  }, []);

  const baseZoom = () => Math.max(size.current.w / W0, size.current.h / H0);

  const clampView = useCallback((v: View): View => {
    const { w, h } = size.current;
    const kMin = Math.max(w / W0, h / H0);
    const k = clamp(v.k, kMin, kMin * MAX_ZOOM_FACTOR);
    return {
      k,
      x: clamp(v.x, w - W0 * k, 0),
      y: clamp(v.y, h - H0 * k, 0),
    };
  }, []);

  const centeredView = useCallback(
    (ra: number, dec: number, k: number) => {
      const p = toWorld(ra, dec);
      const { w, h } = size.current;
      return clampView({ k, x: w / 2 - p.x * k, y: h / 2 - p.y * k });
    },
    [clampView],
  );

  const zoomAt = useCallback(
    (factor: number, px: number, py: number) => {
      const v = view.current;
      const next = clampView({ ...v, k: v.k * factor });
      const ratio = next.k / v.k;
      view.current = clampView({
        k: next.k,
        x: px - (px - v.x) * ratio,
        y: py - (py - v.y) * ratio,
      });
      target.current = null;
    },
    [clampView],
  );

  // Fly to the selected object
  useEffect(() => {
    if (!selectedId) return;
    const obj = DEEP_SKY.find((o) => o.id === selectedId);
    if (!obj || !size.current.w) return;
    const k = Math.max(view.current.k, baseZoom() * 4.5);
    target.current = centeredView(obj.ra, obj.dec, k);
  }, [selectedId, centeredView]);

  // Canvas sizing + render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const css = getComputedStyle(document.documentElement);
    const token = (n: string) => css.getPropertyValue(n).trim() || "oklch(0.9 0 0)";
    const C = {
      cyan: token("--cyan"),
      violet: token("--violet"),
      infrared: token("--infrared"),
      ember: token("--ember"),
      fg: token("--foreground"),
      muted: token("--muted-foreground"),
    };

    let initialised = false;
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prev = size.current;
      size.current = { w: width, h: height, dpr };
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      if (!initialised) {
        view.current = centeredView(5.6, 5, baseZoom() * 2.4);
        initialised = true;
      } else if (prev.w) {
        view.current = clampView(view.current);
      }
    });
    ro.observe(wrap);

    let raf = 0;
    let last = 0;
    const render = (time: number) => {
      raf = requestAnimationFrame(render);
      if (time - last < 1000 / 45) return;
      last = time;
      const { w, h, dpr } = size.current;
      if (!w) return;
      const { wavelength: wl, layers: ly, selectedId: sel } = props.current;

      if (target.current) {
        const t = target.current;
        const v = view.current;
        const e = 0.09;
        view.current = {
          x: v.x + (t.x - v.x) * e,
          y: v.y + (t.y - v.y) * e,
          k: v.k + (t.k - v.k) * e,
        };
        if (Math.abs(t.x - v.x) < 0.5 && Math.abs(t.y - v.y) < 0.5 && Math.abs(t.k - v.k) < 0.001) {
          view.current = t;
          target.current = null;
        }
      }
      const { x: ox, y: oy, k } = view.current;
      const zoomRel = k / baseZoom();
      if (zoomRef.current) zoomRef.current.textContent = `${zoomRel.toFixed(1)}×`;
      const sx = (wx: number) => wx * k + ox;
      const sy = (wy: number) => wy * k + oy;
      const t = time / 1000;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Milky Way
      if (ly.milkyway) {
        const band = wl === "visible" ? C.fg : wl === "infrared" ? C.infrared : C.violet;
        const strength = wl === "visible" ? 0.05 : wl === "infrared" ? 0.11 : 0.13;
        for (const p of galaxyBand) {
          const x = sx(p.x);
          const y = sy(p.y);
          const r = (38 + p.core * 50) * k;
          if (x < -r || x > w + r || y < -r || y > h + r) continue;
          const a = strength * (0.45 + p.core * 1.4);
          const g = ctx.createRadialGradient(x, y, 0, x, y, r);
          g.addColorStop(0, withAlpha(band, a));
          g.addColorStop(1, withAlpha(band, 0));
          ctx.fillStyle = g;
          ctx.fillRect(x - r, y - r, r * 2, r * 2);
        }
      }

      // Field stars
      const palette = STAR_PALETTE[wl];
      const sizeScale = Math.min(1.8, Math.sqrt(zoomRel));
      const limit = clamp(0.25 - Math.log2(zoomRel) * 0.06, 0.02, 0.25);
      for (const s of stars) {
        const x = sx(toWorldX(s.ra));
        const y = sy(((90 - s.dec) / 180) * H0);
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4) continue;
        let b = 1 - s.mag;
        if (wl === "infrared") b = Math.min(1, b * (1 + s.galactic * 0.9) + (1 - s.temp) * 0.15);
        if (wl === "radio") b *= 0.35;
        if (b < limit) continue;
        const tw = 0.7 + 0.3 * Math.sin(t * (1.2 + s.temp * 2) + s.phase);
        ctx.globalAlpha = clamp(b * b * 1.6 * tw, 0, 1);
        ctx.fillStyle = palette[Math.min(4, Math.floor(s.temp * 5))] ?? C.fg;
        const r = (0.35 + b * 1.4) * sizeScale;
        if (r < 1) ctx.fillRect(x - r, y - r, r * 2, r * 2);
        else {
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // Coordinate grid + ecliptic
      if (ly.grid) {
        ctx.lineWidth = 1;
        ctx.strokeStyle = withAlpha(C.cyan, 0.09);
        ctx.fillStyle = withAlpha(C.cyan, 0.55);
        ctx.font = "10px 'IBM Plex Mono', monospace";
        const raStep = zoomRel > 3 ? 1 : 2;
        for (let ra = 0; ra < 24; ra += raStep) {
          const x = sx(toWorldX(ra));
          if (x < 0 || x > w) continue;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
          ctx.fillText(`${ra}h`, x + 4, h - 10);
        }
        const decStep = zoomRel > 3 ? 15 : 30;
        for (let dec = -90 + decStep; dec < 90; dec += decStep) {
          const y = sy(((90 - dec) / 180) * H0);
          if (y < 0 || y > h) continue;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
          ctx.fillText(`${dec > 0 ? "+" : ""}${dec}°`, 8, y - 4);
        }
        // Ecliptic
        ctx.setLineDash([4, 6]);
        ctx.strokeStyle = withAlpha(C.violet, 0.5);
        ctx.beginPath();
        let prevX = 0;
        ecliptic.forEach((p, i) => {
          const x = sx(p.x);
          const y = sy(p.y);
          if (i === 0 || Math.abs(x - prevX) > w * 0.5) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          prevX = x;
        });
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Constellations
      if (ly.constellations) {
        const lineColor = wl === "infrared" ? C.infrared : C.cyan;
        for (const c of CONSTELLATIONS) {
          const pts = c.stars.map((s) => ({
            x: sx(toWorldX(s.ra)),
            y: sy(((90 - s.dec) / 180) * H0),
            s,
          }));
          ctx.strokeStyle = withAlpha(lineColor, 0.38);
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (const [a, b] of c.lines) {
            const pa = pts[a];
            const pb = pts[b];
            if (!pa || !pb) continue;
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
          }
          ctx.stroke();
          for (const p of pts) {
            const r = (3.2 - p.s.mag * 0.6) * Math.min(1.5, sizeScale);
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
            g.addColorStop(0, withAlpha(C.fg, 0.9));
            g.addColorStop(0.25, withAlpha(lineColor, 0.4));
            g.addColorStop(1, withAlpha(lineColor, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
            ctx.fill();
            if (ly.labels && p.s.name && zoomRel > 3.2) {
              ctx.fillStyle = withAlpha(C.fg, 0.55);
              ctx.font = "10px Manrope, sans-serif";
              ctx.fillText(p.s.name, p.x + 7, p.y + 3);
            }
          }
          if (ly.labels) {
            const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
            const cy = Math.min(...pts.map((p) => p.y)) - 14;
            ctx.fillStyle = withAlpha(lineColor, 0.85);
            ctx.font = "600 10px 'IBM Plex Mono', monospace";
            ctx.letterSpacing = "3px";
            ctx.textAlign = "center";
            ctx.fillText(c.name.toUpperCase(), cx, cy);
            ctx.textAlign = "left";
            ctx.letterSpacing = "0px";
          }
        }
      }

      // Deep-sky objects
      const accent = wl === "visible" ? C.cyan : wl === "infrared" ? C.infrared : C.violet;
      for (const o of DEEP_SKY) {
        const p = toWorld(o.ra, o.dec);
        const x = sx(p.x);
        const y = sy(p.y);
        if (x < -40 || x > w + 40 || y < -40 || y > h + 40) continue;
        const isSel = sel === o.id;
        const isHover = hover.current === o.id;
        const r = (5 + o.size * 3) * (isHover || isSel ? 1.25 : 1);
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
        glow.addColorStop(0, withAlpha(accent, 0.55));
        glow.addColorStop(1, withAlpha(accent, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = withAlpha(accent, isHover || isSel ? 1 : 0.75);
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = withAlpha(C.fg, 0.95);
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();

        if (isSel) {
          for (let i = 0; i < 2; i++) {
            const ph = (t * 0.6 + i * 0.5) % 1;
            ctx.strokeStyle = withAlpha(accent, 0.6 * (1 - ph));
            ctx.beginPath();
            ctx.arc(x, y, r + ph * 38, 0, Math.PI * 2);
            ctx.stroke();
          }
          const b = r + 14;
          const L = 7;
          ctx.strokeStyle = withAlpha(C.fg, 0.9);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (const [dx, dy] of [
            [-1, -1],
            [1, -1],
            [1, 1],
            [-1, 1],
          ] as const) {
            ctx.moveTo(x + dx * b, y + dy * (b - L));
            ctx.lineTo(x + dx * b, y + dy * b);
            ctx.lineTo(x + dx * (b - L), y + dy * b);
          }
          ctx.stroke();
        }
        if (ly.labels || isHover || isSel) {
          ctx.font = "600 11px Manrope, sans-serif";
          ctx.fillStyle = withAlpha(C.fg, isHover || isSel ? 1 : 0.8);
          ctx.fillText(o.name, x + r + 8, y - 2);
          ctx.font = "9px 'IBM Plex Mono', monospace";
          ctx.fillStyle = withAlpha(accent, 0.85);
          ctx.fillText(o.catalog.split(" · ")[0] ?? o.catalog, x + r + 8, y + 10);
        }
      }
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [stars, galaxyBand, ecliptic, centeredView, clampView]);

  // Native non-passive wheel zoom
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      zoomAt(Math.exp(-dy * 0.0018), e.clientX - rect.left, e.clientY - rect.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const hitTest = (px: number, py: number) => {
    const { x: ox, y: oy, k } = view.current;
    let best: string | null = null;
    let bestD = 22;
    for (const o of DEEP_SKY) {
      const p = toWorld(o.ra, o.dec);
      const d = Math.hypot(p.x * k + ox - px, p.y * k + oy - py);
      if (d < bestD) {
        bestD = d;
        best = o.id;
      }
    }
    return best;
  };

  const local = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { px: e.clientX - rect.left, py: e.clientY - rect.top };
  };

  return (
    <div ref={wrapRef} className="relative h-full w-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none select-none"
        style={{ cursor: "grab" }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId };
          e.currentTarget.style.cursor = "grabbing";
        }}
        onPointerMove={(e) => {
          const { px, py } = local(e);
          const v = view.current;
          const c = fromWorld((px - v.x) / v.k, (py - v.y) / v.k);
          if (readoutRef.current)
            readoutRef.current.textContent = `RA ${formatRA(c.ra)}   DEC ${formatDec(c.dec)}`;
          const d = drag.current;
          if (d && d.id === e.pointerId) {
            const dx = e.clientX - d.x;
            const dy = e.clientY - d.y;
            d.x = e.clientX;
            d.y = e.clientY;
            d.moved += Math.abs(dx) + Math.abs(dy);
            target.current = null;
            view.current = clampView({ ...v, x: v.x + dx, y: v.y + dy });
            return;
          }
          const hit = hitTest(px, py);
          hover.current = hit;
          e.currentTarget.style.cursor = hit ? "pointer" : "grab";
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          e.currentTarget.style.cursor = "grab";
          if (d && d.moved < 5) {
            const { px, py } = local(e);
            onSelect(hitTest(px, py));
          }
        }}
        onPointerLeave={() => {
          hover.current = null;
        }}
        aria-label="Interactive sky map. Drag to pan, scroll to zoom, click an object to inspect it."
        role="img"
      />

      {/* HUD overlays */}
      <div className="pointer-events-none absolute inset-0 hud-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 opacity-30">
        <div className="absolute left-1/2 top-0 h-full w-px bg-primary" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-primary" />
      </div>

      <div className="absolute bottom-4 left-4 glass rounded-full px-4 py-2 font-mono text-[11px] tracking-wider text-muted-foreground">
        <span ref={readoutRef}>RA — DEC —</span>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-1 glass rounded-full p-1">
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => zoomAt(1 / 1.5, size.current.w / 2, size.current.h / 2)}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span ref={zoomRef} className="w-12 text-center font-mono text-[11px] text-primary">
          1.0×
        </span>
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => zoomAt(1.5, size.current.w / 2, size.current.h / 2)}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Reset view"
          onClick={() => {
            onSelect(null);
            target.current = centeredView(5.6, 5, baseZoom() * 2.4);
          }}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-primary/15 hover:text-primary"
        >
          <Crosshair className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function toWorldX(ra: number) {
  return ((24 - ra) / 24) * W0;
}
