import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EPOCHS } from "@/lib/timeline-data";
import { mulberry32 } from "@/lib/sky-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timeline")({
  head: () => ({
    meta: [
      { title: "Cosmic Timeline — 13.8 Billion Years | Cosmic Echo" },
      {
        name: "description",
        content:
          "An animated journey through cosmic history: inflation, first light, cosmic dawn, the first galaxies and the birth of our Sun.",
      },
      { property: "og:title", content: "Cosmic Timeline — 13.8 Billion Years | Cosmic Echo" },
      {
        property: "og:description",
        content: "Scrub through the history of the universe, epoch by epoch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TimelinePage,
});

const STEP_MS = 5200;

function TimelinePage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const epoch = EPOCHS[index] ?? EPOCHS[0]!;
  const last = EPOCHS.length - 1;

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      setIndex((i) => (i >= last ? 0 : i + 1));
    }, STEP_MS);
    return () => clearTimeout(id);
  }, [playing, index, last]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setPlaying(false);
        setIndex((i) => Math.min(last, i + 1));
      } else if (e.key === "ArrowLeft") {
        setPlaying(false);
        setIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [last]);

  const particles = useMemo(() => {
    const r = mulberry32(42);
    return Array.from({ length: 140 }, (_, i) => ({
      x: r() * 100,
      y: r() * 100,
      s: 1 + r() * 2.2,
      threshold: r(),
      delay: r() * 3,
      galaxy: i < 22,
      rot: r() * 180,
    }));
  }, []);

  const toneVar = `var(--${epoch.tone})`;

  return (
    <main className="relative min-h-[100svh] overflow-hidden pt-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        {/* Visual */}
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <div
            className="absolute inset-0 rounded-full opacity-40 blur-3xl transition-all duration-[1600ms] ease-cosmic"
            style={{ background: `radial-gradient(circle, ${toneVar}, transparent 65%)` }}
          />
          <div
            className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border border-glass-border bg-void transition-all duration-[1600ms] ease-cosmic"
            style={{ width: `${epoch.scale * 100}%` }}
          >
            {/* plasma haze */}
            <div
              className="absolute inset-0 transition-all duration-[1600ms] ease-cosmic"
              style={{
                opacity: epoch.haze,
                background: `radial-gradient(circle at 50% 50%, var(--foreground), ${toneVar} 35%, transparent 80%)`,
              }}
            />
            {/* stars & galaxies */}
            {particles.map((p, i) => {
              const visible = p.galaxy ? p.threshold < epoch.galaxies : p.threshold < epoch.stars;
              return (
                <span
                  key={i}
                  className={cn(
                    "absolute rounded-full transition-all duration-[1400ms] ease-cosmic",
                    p.galaxy ? "bg-violet blur-[1.5px]" : "bg-foreground",
                  )}
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.galaxy ? p.s * 5 : p.s,
                    height: p.galaxy ? p.s * 2 : p.s,
                    opacity: visible ? (p.galaxy ? 0.75 : 0.9) : 0,
                    transform: `rotate(${p.rot}deg) scale(${visible ? 1 : 0.2})`,
                    transitionDelay: `${p.delay * 120}ms`,
                    boxShadow: p.galaxy ? "0 0 12px var(--violet)" : "0 0 6px var(--cyan)",
                  }}
                />
              );
            })}
            <div className="absolute inset-0 hud-grid opacity-60" />
          </div>
          {/* orbit rings */}
          <div className="absolute inset-[-4%] rounded-full border border-dashed border-primary/15 animate-orbit [animation-duration:80s]" />
          <div className="absolute inset-[8%] rounded-full border border-accent/10" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-2 glass rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Observable universe · {Math.round(epoch.scale * 100)}%
          </div>
        </div>

        {/* Copy */}
        <div key={epoch.id} className="animate-rise">
          <p className="eyebrow">
            {String(index + 1).padStart(2, "0")} / {String(EPOCHS.length).padStart(2, "0")} ·{" "}
            {epoch.era}
          </p>
          <h1 className="mt-4 text-4xl font-light leading-tight sm:text-5xl">{epoch.title}</h1>
          <p className="mt-3 font-display text-lg text-aurora">{epoch.time}</p>
          <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">{epoch.description}</p>
          <dl className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {[
              ["Redshift z", epoch.redshift],
              ["Temperature", epoch.temperature],
              ["Light-travel", epoch.ago],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl glass p-3">
                <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                  {k}
                </dt>
                <dd className="mt-1.5 text-sm">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 max-w-lg text-xs text-muted-foreground">
            <span className="font-mono uppercase tracking-[0.18em] text-primary">
              Observed by ·{" "}
            </span>
            {epoch.observedBy}
          </p>
        </div>
      </div>

      {/* Timeline track */}
      <section className="mx-auto mt-14 max-w-7xl px-6 pb-16">
        <div className="rounded-3xl glass p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="glass"
                size="icon"
                aria-label="Previous epoch"
                onClick={() => {
                  setPlaying(false);
                  setIndex((i) => Math.max(0, i - 1));
                }}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="hero"
                size="icon"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? <Pause /> : <Play />}
              </Button>
              <Button
                variant="glass"
                size="icon"
                aria-label="Next epoch"
                onClick={() => {
                  setPlaying(false);
                  setIndex((i) => Math.min(last, i + 1));
                }}
              >
                <ChevronRight />
              </Button>
            </div>
            <p className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              Use ← → keys to travel
            </p>
          </div>

          <div className="relative mt-8 overflow-x-auto pb-2">
            <div className="relative min-w-[880px]">
              <div className="absolute left-0 right-0 top-[7px] h-px bg-border" />
              <div
                className="absolute left-0 top-[6px] h-[3px] rounded-full bg-aurora glow-cyan transition-all duration-1000 ease-cosmic"
                style={{ width: `${(index / last) * 100}%` }}
              />
              {playing && (
                <div
                  key={`p-${index}`}
                  className="absolute top-[6px] h-[3px] rounded-full bg-primary/40"
                  style={{
                    left: `${(index / last) * 100}%`,
                    width: index < last ? `${100 / last}%` : 0,
                    animation: `progress-grow ${STEP_MS}ms linear both`,
                    transformOrigin: "left",
                  }}
                />
              )}
              <ol
                className="relative grid"
                style={{ gridTemplateColumns: `repeat(${EPOCHS.length}, 1fr)` }}
              >
                {EPOCHS.map((e, i) => (
                  <li
                    key={e.id}
                    className={cn(
                      i === last
                        ? "justify-self-end text-right"
                        : i === 0
                          ? ""
                          : "justify-self-center text-center",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setPlaying(false);
                        setIndex(i);
                      }}
                      className="group flex flex-col items-center gap-3"
                    >
                      <span className="relative grid h-4 w-4 place-items-center">
                        {i === index && (
                          <span className="absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
                        )}
                        <span
                          className={cn(
                            "h-3 w-3 rounded-full border transition-all duration-500",
                            i <= index
                              ? "border-primary bg-primary glow-cyan"
                              : "border-muted-foreground/50 bg-background group-hover:border-primary",
                          )}
                        />
                      </span>
                      <span
                        className={cn(
                          "max-w-[84px] text-[11px] leading-tight transition-colors",
                          i === index
                            ? "text-foreground"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {e.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
