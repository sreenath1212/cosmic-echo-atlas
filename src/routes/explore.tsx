import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X } from "lucide-react";

import { SkyMap, type SkyLayers } from "@/components/sky-map";
import { Button } from "@/components/ui/button";
import { DEEP_SKY, formatDec, formatRA, type Wavelength } from "@/lib/sky-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Interactive Sky Map — Cosmic Echo" },
      {
        name: "description",
        content:
          "Pan and zoom across the celestial sphere, trace constellations and inspect nebulae, galaxies and black holes in visible, infrared and radio light.",
      },
      { property: "og:title", content: "Interactive Sky Map — Cosmic Echo" },
      {
        property: "og:description",
        content: "Navigate the night sky and inspect deep-sky objects across wavelengths.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

const BANDS: { id: Wavelength; label: string; hint: string }[] = [
  { id: "visible", label: "Visible", hint: "400–700 nm" },
  { id: "infrared", label: "Infrared", hint: "0.7–28 µm" },
  { id: "radio", label: "Radio", hint: "1 mm–10 m" },
];

const LAYER_LABELS: { key: keyof SkyLayers; label: string }[] = [
  { key: "constellations", label: "Constellations" },
  { key: "milkyway", label: "Milky Way" },
  { key: "grid", label: "Grid & ecliptic" },
  { key: "labels", label: "Labels" },
];

function ExplorePage() {
  const [wavelength, setWavelength] = useState<Wavelength>("visible");
  const [layers, setLayers] = useState<SkyLayers>({
    constellations: true,
    grid: true,
    milkyway: true,
    labels: true,
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = DEEP_SKY.find((o) => o.id === selectedId) ?? null;

  return (
    <main className="relative flex min-h-[100svh] flex-col pt-28 md:pt-24">
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 pb-4 lg:flex-row">
        {/* Control panel */}
        <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-72">
          <div className="rounded-2xl glass p-5">
            <p className="eyebrow">Module 01</p>
            <h1 className="mt-3 text-xl font-normal">Sky Map</h1>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Drag to pan, scroll to zoom. Click a marker to inspect it.
            </p>
          </div>

          <div className="rounded-2xl glass p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Observing band
            </p>
            <div className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-background/40 p-1">
              {BANDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setWavelength(b.id)}
                  className={cn(
                    "rounded-lg px-2 py-2 text-center transition-all duration-500 ease-cosmic",
                    wavelength === b.id
                      ? b.id === "infrared"
                        ? "bg-infrared/20 text-infrared"
                        : b.id === "radio"
                          ? "bg-violet/25 text-violet"
                          : "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="block text-xs font-semibold">{b.label}</span>
                  <span className="block font-mono text-[9px] opacity-70">{b.hint}</span>
                </button>
              ))}
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Layers
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {LAYER_LABELS.map((l) => (
                <Button
                  key={l.key}
                  variant="chip"
                  size="sm"
                  data-active={layers[l.key]}
                  onClick={() => setLayers((s) => ({ ...s, [l.key]: !s[l.key] }))}
                >
                  {l.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-2xl glass p-2">
            <p className="px-3 pb-2 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Catalogue · {DEEP_SKY.length} targets
            </p>
            <ul className="max-h-64 overflow-y-auto lg:max-h-none lg:flex-1">
              {DEEP_SKY.map((o) => (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(o.id)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-300",
                      selectedId === o.id
                        ? "bg-primary/12 text-primary"
                        : "text-foreground/85 hover:bg-foreground/5",
                    )}
                  >
                    <span>
                      <span className="block text-sm">{o.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{o.type}</span>
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {o.catalog.split(" · ")[0]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Map */}
        <section className="relative h-[70svh] min-h-[480px] flex-1 overflow-hidden rounded-3xl border border-glass-border bg-void lg:h-auto">
          <SkyMap
            wavelength={wavelength}
            layers={layers}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <div className="pointer-events-none absolute left-4 top-4 glass rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em]">
            <span
              className={cn(
                wavelength === "visible" && "text-primary",
                wavelength === "infrared" && "text-infrared",
                wavelength === "radio" && "text-violet",
              )}
            >
              ● {wavelength} survey
            </span>
          </div>

          {/* Detail panel */}
          <div
            className={cn(
              "absolute inset-x-3 bottom-16 rounded-2xl glass-strong p-6 transition-all duration-700 ease-cosmic sm:inset-x-auto sm:right-4 sm:top-4 sm:bottom-auto sm:w-80",
              selected
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-4 opacity-0",
            )}
          >
            {selected && (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">{selected.catalog}</p>
                    <h2 className="mt-2 text-lg font-normal">{selected.name}</h2>
                    <p className="text-xs text-muted-foreground">{selected.type}</p>
                  </div>
                  <button
                    type="button"
                    aria-label="Close details"
                    onClick={() => setSelectedId(null)}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <dl className="mt-5 grid grid-cols-2 gap-3 font-mono text-[11px]">
                  {[
                    ["Distance", selected.distance],
                    ["App. mag", selected.magnitude],
                    ["RA", formatRA(selected.ra)],
                    ["Dec", formatDec(selected.dec)],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-background/40 p-2.5">
                      <dt className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        {k}
                      </dt>
                      <dd className="mt-1 text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {selected.description}
                </p>
                <div className="mt-5 space-y-2.5 border-t border-border pt-4">
                  {BANDS.map((b) => (
                    <div
                      key={b.id}
                      className={cn(
                        "rounded-lg p-2.5 text-xs leading-relaxed transition-all duration-500",
                        wavelength === b.id
                          ? "bg-aurora-soft text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      <span className="mb-0.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-primary">
                        {b.label}
                      </span>
                      {selected.wavelengths[b.id]}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
