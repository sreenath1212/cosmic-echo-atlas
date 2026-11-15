import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import pillarsVisible from "@/assets/pillars-visible.jpg";
import pillarsIr from "@/assets/pillars-infrared.jpg";
import { SiteFooter } from "@/components/site-header";
import {
  BANDS,
  bandForWavelength,
  formatWavelength,
  positionToLogWavelength,
  wienPeak,
} from "@/lib/spectrum";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/spectrum")({
  head: () => ({
    meta: [
      { title: "Spectrum Lab — Infrared & Multi-Wavelength | Cosmic Echo" },
      {
        name: "description",
        content:
          "Compare visible and infrared views of the Pillars of Creation and tune across the electromagnetic spectrum from radio to gamma rays.",
      },
      { property: "og:title", content: "Spectrum Lab — Infrared & Multi-Wavelength | Cosmic Echo" },
      {
        property: "og:description",
        content: "See through cosmic dust with interactive infrared wavelength visualisation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpectrumPage,
});

function ComparisonSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const update = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className="relative aspect-[3/2] w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-3xl border border-glass-border"
      onPointerDown={(e) => {
        dragging.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      <img
        src={pillarsIr}
        alt="Infrared view of the Pillars of Creation"
        width={1536}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={pillarsVisible}
        alt="Visible-light view of the Pillars of Creation"
        width={1536}
        height={1024}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      />
      <div className="absolute inset-y-0 w-px bg-primary glow-cyan" style={{ left: `${pos}%` }}>
        <div className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full glass-strong font-mono text-xs text-primary">
          ⟷
        </div>
      </div>
      <span className="absolute left-4 top-4 glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
        Visible · 0.4–0.7 µm
      </span>
      <span className="absolute right-4 top-4 glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-infrared">
        Infrared · 0.9–4.4 µm
      </span>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label="Compare visible and infrared"
        className="sr-only"
      />
    </div>
  );
}

function SpectrumPage() {
  const [pos, setPos] = useState(0.4);
  const [temp, setTemp] = useState(Math.log10(5772));
  const metres = 10 ** positionToLogWavelength(pos);
  const band = bandForWavelength(metres);
  const T = 10 ** temp;
  const peak = wienPeak(T);
  const peakBand = bandForWavelength(peak);

  const cycles = Math.round(2 + pos * 26);
  const wavePath = useMemo(() => {
    const W = 1200;
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 3) {
      const y = 50 + Math.sin((x / (W / 2)) * cycles * Math.PI * 2) * 30;
      pts.push(`${x},${y.toFixed(1)}`);
    }
    return `M${pts.join(" L")}`;
  }, [cycles]);

  return (
    <main className="relative pt-32">
      <section className="mx-auto max-w-7xl px-6">
        <p className="eyebrow">Module 03 · Spectrum Lab</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-light leading-tight sm:text-5xl">
          See through the dust in <span className="text-aurora">infrared</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Drag across the Pillars of Creation. Visible light is blocked by dust; infrared passes
          through and reveals the stars being born inside.
        </p>
        <div className="mt-10">
          <ComparisonSlider />
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6">
        <p className="eyebrow">Electromagnetic spectrum</p>
        <h2 className="mt-4 text-3xl font-light">Tune the wavelength</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-3xl glass p-6">
            <div className="relative h-28 overflow-hidden rounded-2xl bg-void">
              <svg
                viewBox="0 0 600 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-[200%] animate-wave"
              >
                <path
                  d={wavePath}
                  fill="none"
                  stroke={`var(--${band.tone})`}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  transform="scale(0.5 1)"
                />
              </svg>
              <span
                className="absolute bottom-3 right-4 font-mono text-sm"
                style={{ color: `var(--${band.tone})` }}
              >
                λ ≈ {formatWavelength(metres)}
              </span>
            </div>
            <div className="mt-6 h-3 rounded-full bg-spectrum" />
            <input
              type="range"
              min={0}
              max={1000}
              value={Math.round(pos * 1000)}
              onChange={(e) => setPos(Number(e.target.value) / 1000)}
              aria-label="Wavelength"
              className="mt-3 w-full accent-primary"
            />
            <div className="mt-2 grid grid-cols-7 gap-1">
              {BANDS.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setPos((i + 0.5) / BANDS.length)}
                  className={cn(
                    "rounded-lg px-1 py-1.5 text-center font-mono text-[10px] uppercase tracking-wider transition-all",
                    b.id === band.id
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {b.name}
                </button>
              ))}
            </div>
            <div key={band.id} className="mt-6 grid gap-4 animate-rise sm:grid-cols-3">
              {[
                ["Range", band.range],
                ["Emitted by", band.emitters],
                ["Telescopes", band.telescopes],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-background/40 p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                    {k}
                  </p>
                  <p className="mt-1.5 text-sm">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{band.reveals}</p>
          </div>

          <div className="relative overflow-hidden rounded-3xl glass">
            <img
              src={band.render === "infrared" ? pillarsIr : pillarsVisible}
              alt={`Pillars of Creation rendered in ${band.name}`}
              loading="lazy"
              className={cn(
                "h-full min-h-[320px] w-full object-cover transition-all duration-1000 ease-cosmic",
                band.filter,
              )}
            />
            <span className="absolute left-4 top-4 glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em]">
              {band.name} view{band.filter ? " · simulated" : ""}
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-6 pb-24">
        <div className="rounded-3xl glass p-6 sm:p-8">
          <p className="eyebrow">Wien's law</p>
          <h2 className="mt-4 text-2xl font-light">Hotter objects glow at shorter wavelengths</h2>
          <input
            type="range"
            min={0}
            max={4.6}
            step={0.01}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            aria-label="Temperature"
            className="mt-8 w-full accent-primary"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-background/40 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Temperature
              </p>
              <p className="mt-1.5 font-display text-2xl font-light">
                {T >= 100 ? Math.round(T).toLocaleString("en-US") : T.toFixed(1)} K
              </p>
            </div>
            <div className="rounded-xl bg-background/40 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Peak wavelength
              </p>
              <p className="mt-1.5 font-display text-2xl font-light text-aurora">
                {formatWavelength(peak)}
              </p>
            </div>
            <div className="rounded-xl bg-background/40 p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                Brightest in
              </p>
              <p className="mt-1.5 font-display text-2xl font-light">{peakBand.name}</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Try 2.7 K (the cosmic microwave background), 310 K (you) or 5,772 K (the Sun).
          </p>
        </div>

        {/* SPHEREx Infrared Callout */}
        <div className="mt-8 rounded-3xl border border-primary/40 bg-gradient-to-r from-primary/10 via-background to-aurora/10 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-xs font-mono text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                NASA SPHEREx Mission
              </div>
              <h3 className="mt-3 text-xl font-light sm:text-2xl">
                Explore All-Sky Infrared Spectroscopy (0.75 – 5.0 µm)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                SPHEREx is mapping the entire sky across 102 continuous infrared channels using 6
                Linear Variable Filter detectors, unlocking the biogenic ice mantle catalog
                (SPLICES) and Data Release 1 products.
              </p>
            </div>
            <Link
              to="/spherex"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition-all hover:bg-primary/90 glow-cyan"
            >
              Open SPHEREx Portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
