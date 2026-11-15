import { createFileRoute } from "@tanstack/react-router";
import { useState, useTransition } from "react";
import {
  Sparkles,
  Search,
  Radio,
  Sliders,
  ExternalLink,
  Flame,
  Orbit,
  Compass,
  ArrowRight,
  Database,
  Layers,
  Atom,
  HelpCircle,
  Loader2,
  Trophy,
  Zap,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlinkComparator } from "@/components/blink-comparator";
import { SiteFooter } from "@/components/site-header";
import {
  PRESET_TARGETS,
  type PresetTarget,
  type MostObservation,
  queryMostByName,
  queryMostByOrbit,
  type PlanetXOrbitParams,
} from "@/lib/irsa-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blink")({
  head: () => ({
    meta: [
      { title: "Planet X Hunter — SPHEREx Citizen Science Blink Comparator | Cosmic Echo" },
      {
        name: "description",
        content:
          "Spot moving asteroids, comets, and hypothetical Planet X candidates using the historic blink comparator method across NASA SPHEREx multi-epoch infrared sky scans.",
      },
      { property: "og:title", content: "Planet X Hunter — SPHEREx Citizen Science Blink Comparator" },
      {
        property: "og:description",
        content:
          "Spot the difference in space! Connects to NASA/IPAC IRSA MOST and SPHEREx DR1 Level 2 multi-epoch data to detect moving solar system bodies.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlinkPage,
});

function BlinkPage() {
  const [selectedPreset, setSelectedPreset] = useState<PresetTarget>(PRESET_TARGETS[0]!);
  const [epochA, setEpochA] = useState<MostObservation>(PRESET_TARGETS[0]!.observations[0]!);
  const [epochB, setEpochB] = useState<MostObservation>(PRESET_TARGETS[0]!.observations[1]!);
  const [observationsList, setObservationsList] = useState<MostObservation[]>(
    PRESET_TARGETS[0]!.observations
  );

  // Search input state
  const [searchTargetName, setSearchTargetName] = useState("Victoria");
  const [isSearching, startSearchTransition] = useTransition();

  // Orbital simulation state (Hypothetical Planet X / Planet 9)
  const [orbitA, setOrbitA] = useState(420);
  const [orbitE, setOrbitE] = useState(0.55);
  const [orbitI, setOrbitI] = useState(18);

  const [activeTab, setActiveTab] = useState<"presets" | "custom_name" | "orbit_sim">("presets");

  // Handle Preset selection
  const handleSelectPreset = (preset: PresetTarget) => {
    setSelectedPreset(preset);
    setObservationsList(preset.observations);
    setEpochA(preset.observations[0]!);
    setEpochB(preset.observations[1]!);
  };

  // Handle Dynamic MOST search by target name
  const handleLiveSearch = () => {
    if (!searchTargetName.trim()) return;
    startSearchTransition(async () => {
      const results = await queryMostByName(searchTargetName);
      if (results.length >= 2) {
        setObservationsList(results);
        setEpochA(results[0]!);
        setEpochB(results[1]!);
        setSelectedPreset({
          id: "custom",
          name: searchTargetName,
          type: "asteroid",
          difficulty: "Custom Target 🔭",
          story: `Live search queried from NASA's Moving Object Search Tool (MOST) across real 2025 SPHEREx survey scan paths.`,
          whatToLookFor: `Watch for any pixel shift between the two observations of ${searchTargetName}.`,
          distanceInMiles: `${results[0]?.distAu ? Math.round(results[0].distAu * 92.96) + "M miles" : "Solar System Orbit"}`,
          description: `Custom target queried from live NASA IRSA MOST database across 2025 SPHEREx scans.`,
          motionRate: `Ephemeris calculated by IRSA`,
          observations: results,
        });
      } else if (results.length === 1) {
        setObservationsList(results);
        setEpochA(results[0]!);
        setEpochB(results[0]!);
      }
    });
  };

  // Handle Orbital Simulation search
  const handleOrbitSimulation = () => {
    startSearchTransition(async () => {
      const simParams: PlanetXOrbitParams = {
        name: "Planet_X_Sim",
        semimajorAxis: orbitA,
        eccentricity: orbitE,
        inclination: orbitI,
      };
      const results = await queryMostByOrbit(simParams);
      if (results.length >= 2) {
        setObservationsList(results);
        setEpochA(results[0]!);
        setEpochB(results[1]!);
        setSelectedPreset({
          id: "planetx-custom",
          name: `Planet X Candidate (a=${orbitA} AU)`,
          type: "planet_x",
          difficulty: "Deep Space Sim 🪐",
          story: `Simulated distant trans-Neptunian planet at ${orbitA} AU (${Math.round(orbitA * 92.96).toLocaleString()} million miles from the Sun) tested against SPHEREx scan paths.`,
          whatToLookFor: `Slow 15-year drift between NASA WISE (2010) and SPHEREx (2025).`,
          distanceInMiles: `~${Math.round(orbitA * 92.96).toLocaleString()}M miles`,
          description: `Simulated Keplerian trans-Neptunian orbit tested against SPHEREx and WISE infrared scan intersections.`,
          motionRate: `~1.2 arcsec/yr shift over 15-year baseline`,
          observations: results,
        });
      }
    });
  };

  return (
    <main className="relative min-h-[100svh] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Challenge & Mission Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400">
            <span>NASA Space Apps 2026 Challenge</span>
            <span>/</span>
            <span className="text-zinc-200 font-semibold">Planet X and SPHEREx</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>LIVE IRSA MOST & SPHEREx DR1 LEVEL 2 ENGINE</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-6 sm:p-10 relative overflow-hidden">
          {/* High-Resolution Planet X Visual in Background */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-3/5 overflow-hidden">
            <img
              src="/planet-x.jpg"
              alt="Cinematic visualization of Planet X in the outer solar system"
              className="h-full w-full object-cover object-center lg:object-right opacity-30 lg:opacity-45 filter contrast-110 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070712] via-[#070712]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070712] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-300">
              <Sparkles className="h-3.5 w-3.5 text-zinc-400" />
              <span>Citizen Science Discovery Game</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-light tracking-tight leading-tight text-white">
              Spot the Difference: <span className="font-semibold text-zinc-100">Hunt Planet X</span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-300">
              In 1930, 24-year-old Clyde Tombaugh discovered Pluto by rapidly flipping between two
              photographs of the night sky taken days apart. When two images flash back and forth,{" "}
              <strong className="text-white">stars trillions of miles away stay frozen</strong>,
              while <strong className="text-sky-300">asteroids and planets hop across space</strong>!
              Now it’s your turn to spot the moving space rocks across NASA's SPHEREx infrared sky scans.
            </p>
          </div>
        </div>

        {/* 30-Second Space Detective Quick Guide */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/30 p-6 sm:p-8 backdrop-blur-md">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-300 font-semibold mb-4">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>30-Second Quick Start Guide: How to Spot a Space Rock</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-semibold text-white">
                  1
                </span>
                <span className="font-semibold text-sm text-zinc-100">Pick a Target Below</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Start with <strong>Asteroid Victoria</strong> (easiest to spot!). Or try dwarf planet Ceres or the 15-year Planet X time machine.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-semibold text-white">
                  2
                </span>
                <span className="font-semibold text-sm text-zinc-100">Watch the Blink Flipbook</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The viewer will alternate between Photo 1 and Photo 2 every 0.5 seconds. You can also drag the split slider manually!
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 font-mono text-xs font-semibold text-white">
                  3
                </span>
                <span className="font-semibold text-sm text-zinc-100">Spot What Jumps & Flag It!</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Notice the dot hopping back and forth? Click <strong>"⭐ I Found It!"</strong> to log your verified citizen science discovery!
              </p>
            </div>
          </div>
        </div>

        {/* Target Selector Tabs */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            {[
              { id: "presets", label: "Ready-to-Spot Targets", icon: Sparkles },
              { id: "custom_name", label: "Search by Asteroid Name", icon: Search },
              { id: "orbit_sim", label: "Planet X Orbit Simulator", icon: Orbit },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs transition-all",
                  activeTab === tab.id
                    ? "bg-white text-zinc-950 font-semibold shadow-sm"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <tab.icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: PRESET TARGETS */}
          {activeTab === "presets" && (
            <div className="mt-5 space-y-3">
              <p className="text-xs text-muted-foreground">
                Click any of these 3 verified targets to load their authentic NASA infrared photos into the blink comparator:
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {PRESET_TARGETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={cn(
                      "flex flex-col justify-between rounded-2xl border p-4 text-left transition-all",
                      selectedPreset.id === preset.id
                        ? "border-white/40 bg-white/10 shadow-md ring-1 ring-white/20"
                        : "border-white/10 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-white/20"
                    )}
                  >
                    <div>
                      {preset.id === "planetx-sim" && (
                        <div className="mb-2.5 h-20 w-full overflow-hidden rounded-xl relative border border-white/10">
                          <img
                            src="/planet-x.jpg"
                            alt="Planet X scientific illustration"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute bottom-1.5 left-2 text-[10px] font-mono text-zinc-300 font-medium">
                            Outer Kuiper Belt Visualization
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">{preset.name}</span>
                        <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[9px] uppercase text-zinc-300 font-medium">
                          {preset.difficulty || preset.type}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-zinc-400 line-clamp-2">
                        {preset.story || preset.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between font-mono text-[10px]">
                      <span className="text-zinc-400">Dist: {preset.distanceInMiles || "Solar System"}</span>
                      <span className="text-zinc-200 font-medium">{preset.motionRate}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: SEARCH BY NAME */}
          {activeTab === "custom_name" && (
            <div className="mt-5 space-y-4">
              <p className="text-xs text-muted-foreground">
                Search any known asteroid, comet, or planet in NASA/IPAC IRSA's Moving Object Search Tool (MOST) across 2025 SPHEREx scans:
              </p>
              <div className="flex flex-wrap gap-2 max-w-xl">
                <input
                  type="text"
                  value={searchTargetName}
                  onChange={(e) => setSearchTargetName(e.target.value)}
                  placeholder="Enter asteroid name (e.g. Victoria, Ceres, Bamberga, Eros)..."
                  className="flex-1 rounded-xl border border-glass-border bg-background/60 px-4 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button
                  onClick={handleLiveSearch}
                  disabled={isSearching}
                  variant="hero"
                  className="gap-2 font-mono text-xs"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span>Search NASA MOST</span>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
                <span>Try these popular rocks:</span>
                {["Victoria", "Ceres", "Bamberga", "Eros"].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setSearchTargetName(name);
                    }}
                    className="rounded bg-white/5 px-2 py-1 hover:bg-white/15 hover:text-white"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PLANET X ORBIT SIMULATOR */}
          {activeTab === "orbit_sim" && (
            <div className="mt-5 space-y-4">
              <p className="text-xs text-muted-foreground">
                Astronomers believe a giant 9th planet might be orbiting far beyond Pluto. Enter hypothetical orbital parameters to simulate where it would appear across NASA SPHEREx scans:
              </p>
              <div className="grid gap-4 sm:grid-cols-3 max-w-2xl">
                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-muted-foreground">
                    Distance from Sun (AU)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={orbitA}
                      onChange={(e) => setOrbitA(Number(e.target.value))}
                      className="w-full rounded-xl border border-glass-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground"
                    />
                    <span className="font-mono text-xs text-muted-foreground">AU</span>
                  </div>
                  <span className="block text-[10px] text-muted-foreground">
                    1 AU = 93M miles. 420 AU = 39 billion miles!
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-muted-foreground">
                    Orbit Ovalness (Eccentricity)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="0.99"
                    value={orbitE}
                    onChange={(e) => setOrbitE(Number(e.target.value))}
                    className="w-full rounded-xl border border-glass-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground"
                  />
                  <span className="block text-[10px] text-muted-foreground">
                    0 = circle, 0.55 = elongated oval
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-muted-foreground">
                    Orbit Tilt (Inclination)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={orbitI}
                      onChange={(e) => setOrbitI(Number(e.target.value))}
                      className="w-full rounded-xl border border-glass-border bg-background/60 px-3 py-1.5 font-mono text-xs text-foreground"
                    />
                    <span className="font-mono text-xs text-muted-foreground">deg</span>
                  </div>
                  <span className="block text-[10px] text-muted-foreground">
                    Tilt relative to Earth's orbital plane
                  </span>
                </div>
              </div>

              <Button
                onClick={handleOrbitSimulation}
                disabled={isSearching}
                variant="hero"
                className="gap-2 font-mono text-xs"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Orbit className="h-4 w-4" />
                )}
                <span>Simulate & Intersect SPHEREx Scans</span>
              </Button>
            </div>
          )}
        </div>

        {/* Observations Selector (if more than 2) */}
        {observationsList.length > 2 && (
          <div className="rounded-2xl border border-glass-border glass p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Database className="h-4 w-4 text-primary" />
              <span>
                Found {observationsList.length} observation photos for {selectedPreset.name}:
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">Photo 1:</span>
                <select
                  value={epochA.id}
                  onChange={(e) => {
                    const match = observationsList.find((o) => o.id === e.target.value);
                    if (match) setEpochA(match);
                  }}
                  className="rounded-lg border border-glass-border bg-background/80 px-2.5 py-1 text-foreground"
                >
                  {observationsList.map((obs) => (
                    <option key={obs.id} value={obs.id}>
                      {obs.obsDate} ({obs.detector})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">Photo 2:</span>
                <select
                  value={epochB.id}
                  onChange={(e) => {
                    const match = observationsList.find((o) => o.id === e.target.value);
                    if (match) setEpochB(match);
                  }}
                  className="rounded-lg border border-glass-border bg-background/80 px-2.5 py-1 text-foreground"
                >
                  {observationsList.map((obs) => (
                    <option key={obs.id} value={obs.id}>
                      {obs.obsDate} ({obs.detector})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* The Blink Comparator Canvas */}
        <BlinkComparator
          epochA={epochA}
          epochB={epochB}
          targetName={selectedPreset.name}
          motionRate={selectedPreset.motionRate}
          difficulty={selectedPreset.difficulty}
          story={selectedPreset.story}
          whatToLookFor={selectedPreset.whatToLookFor}
          distanceInMiles={selectedPreset.distanceInMiles}
        />

        {/* The Science Behind The Blink Method */}
        <div className="grid gap-6 md:grid-cols-3 pt-4">
          <div className="rounded-2xl border border-glass-border glass p-5 space-y-2">
            <p className="font-mono text-xs font-semibold text-primary uppercase">
              1. The Optical Blink Method
            </p>
            <h3 className="text-base font-semibold">How Clyde Tombaugh Found Pluto</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Stars are light-years away and appear locked in place. Closer bodies in our solar system
              (like asteroids, comets, or undiscovered planets) orbit the Sun and appear to hop when two
              photos taken days or years apart are quickly alternated.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-2 backdrop-blur-sm">
            <p className="font-mono text-xs font-semibold text-zinc-300 uppercase">
              2. SPHEREx 102-Band Infrared
            </p>
            <h3 className="text-base font-semibold text-white">Seeing Through Cosmic Dust</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              NASA's SPHEREx telescope maps the entire sky in near-infrared (0.75 to 5.0 µm). Cold, dark
              outer solar system worlds don't shine in visible light, but glow in infrared heat, making
              SPHEREx ideal for spotting hidden worlds!
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-5 space-y-2 backdrop-blur-sm">
            <p className="font-mono text-xs font-semibold text-zinc-300 uppercase">
              3. 15-Year Time Machine
            </p>
            <h3 className="text-base font-semibold text-white">WISE (2010) vs SPHEREx (2025)</h3>
            <p className="text-xs leading-relaxed text-zinc-400">
              A hypothetical Planet X takes over 10,000 years to orbit the Sun, shifting slowly each year.
              By comparing 2010 NASA WISE surveys to 2025 SPHEREx scans, its 15-year positional shift
              becomes visibly detectable to human eyes!
            </p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
