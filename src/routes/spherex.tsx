import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ExternalLink,
  Copy,
  Check,
  Download,
  Terminal,
  Database,
  Layers,
  Sparkles,
  Search,
  BookOpen,
  Code2,
  Cloud,
  Compass,
  FileText,
  Info,
  Radio,
  Share2,
  Atom,
  Flame,
} from "lucide-react";

import {
  SPHEREX_BANDS,
  MISSION_METADATA,
  CANONICAL_PAPERS,
  DATA_RELEASES,
  SPLICES_INFO,
  SAMPLE_SPLICES_SOURCES,
  COMET_3I_ATLAS,
  CLOUD_ACCESS,
  SPECTRAL_CALIBRATIONS,
  PYTHON_TUTORIALS,
  generateSyntheticSpherexSpectrum,
  buildCutoutUrl,
  generateAstroquerySnippet,
  type SplicesTarget,
} from "@/lib/spherex-data";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-header";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/spherex")({
  head: () => ({
    meta: [
      { title: "SPHEREx Mission Portal — All-Sky Spectral Survey | Cosmic Echo" },
      {
        name: "description",
        content:
          "NASA's SPHEREx mission resources: Data Release 1 (DR1), Quick Releases, SPLICES 9M ice source catalog, Comet 3I/ATLAS observations, spectrophotometry tools, and AWS Open Data cloud access.",
      },
      { property: "og:title", content: "SPHEREx Mission Portal — NASA All-Sky Spectral Survey" },
      {
        property: "og:description",
        content:
          "Explore SPHEREx 0.75–5.0 µm spectroscopy, DR1 data products, science tools, and cloud datasets from Caltech/IPAC IRSA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpherexPage,
});

type TabKey = "overview" | "releases" | "tools" | "splices" | "comet" | "cloud" | "tutorials";

function SpherexPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [selectedBandId, setSelectedBandId] = useState<number>(4);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Spectrophotometry Tool State
  const [spectrumTarget, setSpectrumTarget] = useState<
    "yso" | "galaxy" | "ice_grain" | "comet" | "flat"
  >("yso");
  const [activeChannelHover, setActiveChannelHover] = useState<number | null>(null);

  // Cutout Tool State
  const [cutoutRa, setCutoutRa] = useState<number>(83.822);
  const [cutoutDec, setCutoutDec] = useState<number>(-5.391);
  const [cutoutSize, setCutoutSize] = useState<number>(0.1);
  const [cutoutRelease, setCutoutRelease] = useState<"dr1" | "qr3" | "qr2">("dr1");

  // SPLICES State
  const [selectedSplices, setSelectedSplices] = useState<SplicesTarget>(SAMPLE_SPLICES_SOURCES[0]!);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const spectrumPoints = useMemo(
    () => generateSyntheticSpherexSpectrum(spectrumTarget),
    [spectrumTarget],
  );
  const activeBand = useMemo(
    () => SPHEREX_BANDS.find((b) => b.id === selectedBandId) ?? SPHEREX_BANDS[0]!,
    [selectedBandId],
  );

  const generatedCutoutUrl = useMemo(
    () =>
      buildCutoutUrl({ ra: cutoutRa, dec: cutoutDec, sizeDeg: cutoutSize, release: cutoutRelease }),
    [cutoutRa, cutoutDec, cutoutSize, cutoutRelease],
  );

  const generatedAstroquery = useMemo(
    () => generateAstroquerySnippet(cutoutRa, cutoutDec, cutoutSize * 60),
    [cutoutRa, cutoutDec, cutoutSize],
  );

  // Max flux in spectrum for scaling
  const maxFlux = useMemo(
    () => Math.max(...spectrumPoints.map((p) => p.flux), 1),
    [spectrumPoints],
  );

  return (
    <main className="relative min-h-[100svh] pt-24 pb-16">
      {/* Background glow effects */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-radial-vignette opacity-70" />
      <div className="pointer-events-none fixed top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
      <div className="pointer-events-none fixed bottom-12 right-1/4 -z-10 h-[450px] w-[600px] rounded-full bg-aurora/10 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Live Mission Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400">
            <span>NASA Astrophysics</span>
            <span>/</span>
            <span className="text-zinc-200 font-semibold">SPHEREx Mission Portal</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>SURVEY ACTIVE · 102 SPECTRAL CHANNELS · ALL-SKY</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="mt-6 rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md p-6 sm:p-10 relative overflow-hidden">
          {/* High-Resolution 3D SPHEREx Spacecraft Atmospheric Visual */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full lg:w-3/5 overflow-hidden">
            <img
              src="/spherex-observatory.jpg"
              alt="NASA SPHEREx Space Telescope in orbit"
              className="h-full w-full object-cover object-center lg:object-right opacity-30 lg:opacity-45 filter contrast-110 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070712] via-[#070712]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070712] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300 font-mono">
              <Atom className="h-3.5 w-3.5 text-zinc-400" />
              <span>Caltech / IPAC IRSA Archive Integration</span>
            </div>
            <h1 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-tight text-white">
              SPHEREx: <span className="font-semibold text-zinc-100">An All-Sky Spectral Survey</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-300 max-w-3xl">
              The Spectro-Photometer for the History of the Universe, Epoch of Reionization and Ices
              Explorer (SPHEREx) is mapping 100% of the celestial sphere in 102 infrared spectral
              channels from 0.75 to 5.0 µm, probing cosmic inflation, galaxy evolution, and
              interstellar biogenic ices.
            </p>

            {/* Quick Actions from IRSA Page */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <a
                  href="https://irsa.ipac.caltech.edu/applications/spherex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Launch SPHEREx Data Explorer
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a
                  href="https://irsa.ipac.caltech.edu/data/SPHEREx/docs/overview_dr1.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  IRSA DR1 Documentation
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a
                  href="https://registry.opendata.aws/spherex-dr1/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Cloud className="h-4 w-4" />
                  AWS Open Data (S3)
                  <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                </a>
              </Button>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="mt-10 grid grid-cols-2 gap-3 border-t border-glass-border/60 pt-8 sm:grid-cols-4 lg:grid-cols-6">
            <div className="rounded-xl bg-background/40 p-3.5 border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Sky Coverage
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-light text-primary">100%</p>
              <p className="text-[11px] text-muted-foreground">Full celestial sphere</p>
            </div>
            <div className="rounded-xl bg-background/40 p-3.5 border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Channels
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-light text-primary">102</p>
              <p className="text-[11px] text-muted-foreground">Nominal spectral channels</p>
            </div>
            <div className="rounded-xl bg-background/40 p-3.5 border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Wavelength
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-light text-primary">
                0.75–5.0
              </p>
              <p className="text-[11px] text-muted-foreground">Microns (6 LVF bands)</p>
            </div>
            <div className="rounded-xl bg-background/40 p-3.5 border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Resolution
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-light text-primary">
                R=35–128
              </p>
              <p className="text-[11px] text-muted-foreground">Linear variable filters</p>
            </div>
            <div className="rounded-xl bg-background/40 p-3.5 border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Lifetime
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-light text-primary">
                2025–2027
              </p>
              <p className="text-[11px] text-muted-foreground">Planned 2-yr baseline</p>
            </div>
            <div className="rounded-xl bg-background/40 p-3.5 border border-white/5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                SPLICES Targets
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-light text-primary">
                ~9 Million
              </p>
              <p className="text-[11px] text-muted-foreground">Ice source catalog</p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="mt-10 flex overflow-x-auto gap-2 border-b border-glass-border pb-3 scrollbar-none">
          {[
            { id: "overview", label: "Mission & Bands", icon: Compass },
            { id: "releases", label: "Data Releases (DR1 / QR)", icon: Database },
            { id: "tools", label: "Science Tools Studio", icon: Sparkles },
            { id: "splices", label: "SPLICES Ice Catalog", icon: Flame },
            { id: "comet", label: "Comet 3I/ATLAS", icon: Radio },
            { id: "cloud", label: "Cloud & APIs", icon: Cloud },
            { id: "tutorials", label: "Notebooks & Calibrations", icon: Code2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition-all duration-300",
                activeTab === tab.id
                  ? "bg-primary/20 text-primary border border-primary/40 shadow-sm"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW & BANDS */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-10 animate-rise">
            {/* 6 LVF Detector Bands Interactive Explorer */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Instrumentation</p>
                  <h2 className="mt-1 text-2xl font-light">
                    6 Detector Bands with Linear Variable Filters (LVFs)
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select a band to inspect resolving power, spectral coverage, and primary
                    astrophysical objectives.
                  </p>
                </div>
                <div className="font-mono text-xs text-primary bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-xl">
                  Total: 102 Nominal Channels
                </div>
              </div>

              {/* Band selector buttons */}
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {SPHEREX_BANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBandId(b.id)}
                    className={cn(
                      "rounded-2xl p-4 text-left transition-all duration-300 border",
                      selectedBandId === b.id
                        ? "border-primary bg-primary/15 glow-cyan"
                        : "border-glass-border bg-background/40 hover:border-white/20 hover:bg-background/60",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase font-semibold text-primary">
                        {b.name}
                      </span>
                      <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px]">
                        R={b.resolvingPower}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      {b.minWavelength}–{b.maxWavelength} µm
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {b.channelCount} channels
                    </p>
                  </button>
                ))}
              </div>

              {/* Active Band Detail Card */}
              <div className="mt-6 rounded-2xl border border-primary/30 bg-background/50 p-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg bg-primary/20 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                        {activeBand.name} Specifications
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        Filter: {activeBand.filterType}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      {activeBand.description}
                    </p>
                    <div className="pt-2">
                      <p className="font-mono text-xs font-semibold text-aurora uppercase tracking-wider">
                        Key Science Pillars
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {activeBand.keyScience.map((ks) => (
                          <li
                            key={ks}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {ks}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-4 space-y-3 font-mono text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        Wavelength Span
                      </span>
                      <span className="text-primary font-bold text-base">
                        {activeBand.minWavelength} to {activeBand.maxWavelength} µm
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        Resolving Power (R)
                      </span>
                      <span className="text-foreground text-sm font-semibold">
                        {activeBand.resolvingPower} (λ/Δλ)
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase">
                        Focal Plane Detector
                      </span>
                      <span className="text-foreground text-xs">{activeBand.detector}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contributing Institutions */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <p className="eyebrow">Collaboration</p>
              <h2 className="mt-1 text-2xl font-light">
                Contributing Institutions & Lead Partners
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                SPHEREx is a joint project of the Jet Propulsion Laboratory (JPL) and Caltech,
                funded by NASA, with an international science consortium.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {MISSION_METADATA.contributingInstitutions.map((inst) => (
                  <div
                    key={inst.name}
                    className="rounded-2xl border border-glass-border bg-background/40 p-4"
                  >
                    <p className="font-mono text-xs font-bold text-primary">{inst.name}</p>
                    <p className="mt-1 text-xs font-medium text-foreground">{inst.fullName}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">{inst.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Canonical Mission Papers */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <p className="eyebrow">Literature</p>
              <h2 className="mt-1 text-2xl font-light">Canonical SPHEREx Publications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Foundational papers detailing the mission design, data pipeline, all-sky simulator,
                and ground calibrations.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {CANONICAL_PAPERS.map((paper) => (
                  <div
                    key={paper.title}
                    className="flex flex-col justify-between rounded-2xl border border-glass-border bg-background/40 p-5 hover:border-primary/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary">
                          {paper.category}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {paper.year}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-semibold leading-snug">{paper.title}</h3>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {paper.authors} · {paper.journal}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {paper.summary}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-glass-border/60">
                      <a
                        href={paper.abstractUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                      >
                        Read ADS Abstract
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Acknowledgement Citation */}
            <div className="rounded-3xl border border-primary/30 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-primary">Citation Guidance</p>
                  <h3 className="mt-1 text-xl font-medium">Official Data Acknowledgement</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Please include this acknowledgement in any published scientific work that
                    utilizes SPHEREx data products:
                  </p>
                </div>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={() => copyToClipboard(MISSION_METADATA.acknowledgementText, "ack")}
                  className="shrink-0"
                >
                  {copiedKey === "ack" ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </Button>
              </div>

              <blockquote className="mt-4 rounded-xl border border-primary/20 bg-black/40 p-4 font-mono text-xs leading-relaxed text-foreground/90 italic">
                "{MISSION_METADATA.acknowledgementText}"
              </blockquote>
            </div>
          </div>
        )}

        {/* TAB 2: DATA RELEASES */}
        {activeTab === "releases" && (
          <div className="mt-8 space-y-10 animate-rise">
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <p className="eyebrow">Archival Products</p>
              <h2 className="mt-1 text-2xl font-light">SPHEREx Data Releases Timeline & DOIs</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                All public data products released through the NASA/IPAC Infrared Science Archive
                (IRSA).
              </p>

              <div className="mt-8 space-y-6">
                {DATA_RELEASES.map((rel) => (
                  <div
                    key={rel.id}
                    className={cn(
                      "rounded-2xl border p-6 transition-all",
                      rel.status === "active"
                        ? "border-primary/40 bg-primary/5"
                        : "border-glass-border bg-background/30 opacity-80",
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase font-bold",
                            rel.status === "active"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : rel.status === "reprocessed"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {rel.status}
                        </span>
                        <h3 className="text-xl font-semibold">{rel.name}</h3>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">{rel.date}</span>
                    </div>

                    <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
                      {rel.description}
                    </p>

                    {rel.doi && (
                      <div className="mt-3 flex items-center gap-2 font-mono text-xs text-primary">
                        <span className="text-muted-foreground">DOI:</span>
                        {rel.doiUrl ? (
                          <a
                            href={rel.doiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            {rel.doi}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span>{rel.doi}</span>
                        )}
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-glass-border/60">
                      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        Key Characteristics
                      </p>
                      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                        {rel.characteristics.map((c) => (
                          <li
                            key={c}
                            className="flex items-center gap-2 text-xs text-muted-foreground"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Access Methods */}
                    <div className="mt-4 flex flex-wrap gap-2 pt-3">
                      {rel.accessMethods.map((method) => (
                        <Button key={method.label} asChild variant="glass" size="sm">
                          <a
                            href={method.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs"
                          >
                            {method.type === "s3" && <Cloud className="h-3 w-3 text-amber-400" />}
                            {method.type === "api" && <Terminal className="h-3 w-3 text-primary" />}
                            {method.type === "web" && <Database className="h-3 w-3 text-aurora" />}
                            <span>{method.label}</span>
                            <ExternalLink className="h-3 w-3 opacity-60" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCIENCE TOOLS STUDIO */}
        {activeTab === "tools" && (
          <div className="mt-8 space-y-10 animate-rise">
            {/* Tool 1: Interactive Spectrophotometry Tool */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                    <Sparkles className="h-3.5 w-3.5" />
                    Science Tool 01
                  </div>
                  <h2 className="mt-1 text-2xl font-light">
                    Spectrophotometry Tool: 102-Channel Spectra
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Extracts multi-band spectra from SPHEREx Spectral Images using forced photometry
                    at specified celestial coordinates.
                  </p>
                </div>
                <Button asChild variant="glass" size="sm">
                  <a
                    href="https://irsa.ipac.caltech.edu/applications/spherex/tool-spectrophotometry"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Launch on IRSA
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>

              {/* Target Selector */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground mr-2">
                  Sample Targets:
                </span>
                {[
                  { id: "yso", label: "SPLICES YSO (Ice Abs)" },
                  { id: "galaxy", label: "Redshift z=0.3 Galaxy" },
                  { id: "ice_grain", label: "Dense Core (Pure Ice)" },
                  { id: "comet", label: "Comet 3I/ATLAS Coma" },
                  { id: "flat", label: "Standard Calibrator" },
                ].map((target) => (
                  <button
                    key={target.id}
                    onClick={() =>
                      setSpectrumTarget(
                        target.id as "yso" | "galaxy" | "ice_grain" | "comet" | "flat",
                      )
                    }
                    className={cn(
                      "rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
                      spectrumTarget === target.id
                        ? "bg-primary text-black font-semibold shadow-sm"
                        : "bg-background/40 text-muted-foreground hover:bg-white/10 hover:text-foreground border border-glass-border",
                    )}
                  >
                    {target.label}
                  </button>
                ))}
              </div>

              {/* Interactive Spectral Display */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/60 p-5">
                <div className="flex items-center justify-between border-b border-glass-border/60 pb-3 text-xs font-mono">
                  <span className="text-muted-foreground">
                    Flux Density $F_\nu$ (mJy) vs Wavelength $\lambda$ (µm)
                  </span>
                  <span className="text-primary font-semibold">102 Nominal Channels</span>
                </div>

                {/* Spectral Bar Chart Visualizer */}
                <div className="mt-4 flex h-56 w-full items-end gap-[2px] pt-4 pb-2">
                  {spectrumPoints.map((pt) => {
                    const heightPercent = Math.max(6, Math.min(100, (pt.flux / maxFlux) * 100));
                    const isHovered = activeChannelHover === pt.channelIndex;
                    const bandColor =
                      pt.bandId === 1
                        ? "bg-blue-400"
                        : pt.bandId === 2
                          ? "bg-cyan-400"
                          : pt.bandId === 3
                            ? "bg-teal-400"
                            : pt.bandId === 4
                              ? "bg-amber-400"
                              : pt.bandId === 5
                                ? "bg-orange-400"
                                : "bg-red-400";

                    return (
                      <div
                        key={pt.channelIndex}
                        onMouseEnter={() => setActiveChannelHover(pt.channelIndex)}
                        onMouseLeave={() => setActiveChannelHover(null)}
                        className="relative flex-1 cursor-pointer flex flex-col justify-end h-full group"
                      >
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={cn(
                            "w-full rounded-t-sm transition-all duration-150",
                            bandColor,
                            isHovered
                              ? "brightness-150 ring-2 ring-white"
                              : "opacity-80 group-hover:opacity-100",
                          )}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* X-axis band markers */}
                <div className="mt-2 grid grid-cols-6 border-t border-glass-border/60 pt-2 font-mono text-[10px] text-muted-foreground text-center">
                  <div>B1 (0.75-1.1µm)</div>
                  <div>B2 (1.1-1.6µm)</div>
                  <div>B3 (1.6-2.4µm)</div>
                  <div>B4 (2.4-3.8µm)</div>
                  <div>B5 (3.8-4.4µm)</div>
                  <div>B6 (4.4-5.0µm)</div>
                </div>

                {/* Channel inspection readout */}
                <div className="mt-4 rounded-xl bg-background/50 border border-white/5 p-3 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
                  {activeChannelHover !== null ? (
                    (() => {
                      const pt = spectrumPoints[activeChannelHover]!;
                      return (
                        <>
                          <div>
                            <span className="text-muted-foreground">Channel: </span>
                            <span className="text-primary font-bold">
                              #{pt.channelIndex + 1} (Band {pt.bandId})
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Wavelength: </span>
                            <span className="text-white font-bold">{pt.wavelength} µm</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Resolving Power: </span>
                            <span className="text-aurora font-bold">R={pt.resolvingPower}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Flux: </span>
                            <span className="text-green-400 font-bold">
                              {pt.flux} ± {pt.error} mJy
                            </span>
                          </div>
                          {pt.absorptionFeature && (
                            <div className="rounded-md bg-aurora/20 px-2 py-0.5 text-aurora font-bold text-[11px]">
                              {pt.absorptionFeature}
                            </div>
                          )}
                        </>
                      );
                    })()
                  ) : (
                    <span className="text-muted-foreground text-xs italic">
                      Hover over any of the 102 spectral channels above to inspect wavelength,
                      resolving power, and detected ice absorption features.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tool 2: Cutout Tool & Direct URL API Generator */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                    <Terminal className="h-3.5 w-3.5" />
                    Science Tool 02
                  </div>
                  <h2 className="mt-1 text-2xl font-light">
                    Cutout Tool & Direct URL API Generator
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Extract spatial subsets from large SPHEREx Multi-Extension FITS (MEF) files
                    preserving all HDUs and WCS geometry.
                  </p>
                </div>
                <Button asChild variant="glass" size="sm">
                  <a
                    href="https://irsa.ipac.caltech.edu/data/SPHEREx/docs/cutout_tool.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Cutout Documentation
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>

              {/* Input Form */}
              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="font-mono text-xs uppercase text-muted-foreground">
                    Right Ascension (RA deg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={cutoutRa}
                    onChange={(e) => setCutoutRa(parseFloat(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-muted-foreground">
                    Declination (Dec deg)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    value={cutoutDec}
                    onChange={(e) => setCutoutDec(parseFloat(e.target.value) || 0)}
                    className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-muted-foreground">
                    Cutout Size (degrees)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="2.0"
                    value={cutoutSize}
                    onChange={(e) => setCutoutSize(parseFloat(e.target.value) || 0.1)}
                    className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-mono text-xs uppercase text-muted-foreground">
                    Data Release
                  </label>
                  <select
                    value={cutoutRelease}
                    onChange={(e) => setCutoutRelease(e.target.value as "dr1" | "qr3" | "qr2")}
                    className="mt-1.5 w-full rounded-xl border border-glass-border bg-background/60 px-3 py-2 font-mono text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="dr1">DR1 (Uniformly Calibrated)</option>
                    <option value="qr3">QR3 (Weekly Quick Release)</option>
                    <option value="qr2">QR2 (Legacy / Reprocessed)</option>
                  </select>
                </div>
              </div>

              {/* Generated Commands */}
              <div className="mt-6 space-y-4">
                {/* Direct curl command */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      Direct curl Cutout Request
                    </span>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `curl -o spherex_cutout.fits "${generatedCutoutUrl}"`,
                          "curl_cutout",
                        )
                      }
                    >
                      {copiedKey === "curl_cutout" ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span className="ml-1 text-xs">Copy Command</span>
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto font-mono text-xs text-primary leading-relaxed">
                    curl -o spherex_cutout.fits "{generatedCutoutUrl}"
                  </pre>
                </div>

                {/* Python Astroquery snippet */}
                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      Python Astroquery Query
                    </span>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() => copyToClipboard(generatedAstroquery, "astroquery")}
                    >
                      {copiedKey === "astroquery" ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span className="ml-1 text-xs">Copy Python</span>
                    </Button>
                  </div>
                  <pre className="mt-2 overflow-x-auto font-mono text-xs text-foreground/90 leading-relaxed">
                    {generatedAstroquery}
                  </pre>
                </div>
              </div>
            </div>

            {/* Tool 3 & 4: Mosaic Tool & Source Discovery Tool */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-glass-border glass p-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                  <Layers className="h-3.5 w-3.5" />
                  Science Tool 03
                </div>
                <h3 className="mt-2 text-xl font-medium">Mosaic Tool</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Creates custom multiwavelength mosaics and spatial datacubes from overlapping
                  SPHEREx Spectral Images, essential for deep fields at the ecliptic poles.
                </p>
                <div className="mt-4 pt-4 border-t border-glass-border/60">
                  <Button asChild variant="glass" size="sm">
                    <a
                      href="https://irsa.ipac.caltech.edu/applications/spherex/tool-mosaic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      Open Mosaic Tool
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-glass-border glass p-6">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                  <Search className="h-3.5 w-3.5" />
                  Science Tool 04
                </div>
                <h3 className="mt-2 text-xl font-medium">Source Discovery Tool</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Identify and characterize significant detected astronomical sources within a
                  user-defined sky region using SPHEREx data alone, without requiring positional
                  priors from external catalogs.
                </p>
                <div className="mt-4 pt-4 border-t border-glass-border/60">
                  <Button asChild variant="glass" size="sm">
                    <a
                      href="https://caltech-ipac.github.io/irsa-tutorials/spherex-source-discovery-tool-demo/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      View Source Discovery Demo
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SPLICES ICE CATALOG */}
        {activeTab === "splices" && (
          <div className="mt-8 space-y-10 animate-rise">
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                    <Flame className="h-3.5 w-3.5" />
                    Astrophysical Ice Laboratory
                  </div>
                  <h2 className="mt-1 text-2xl font-light">{SPLICES_INFO.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    A compilation of nearly 9 million spatially isolated, IR-bright point sources
                    likely to exhibit ice absorption features.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="hero" size="sm">
                    <a
                      href={SPLICES_INFO.downloadFitsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download FITS ({SPLICES_INFO.downloadFitsSize})
                    </a>
                  </Button>
                  <Button asChild variant="glass" size="sm">
                    <a
                      href={SPLICES_INFO.gatorSearchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Search className="h-3.5 w-3.5" />
                      Gator Catalog Search
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Science Significance Card */}
              <div className="mt-6 rounded-2xl border border-aurora/30 bg-aurora/5 p-5">
                <p className="font-mono text-xs font-semibold text-aurora uppercase tracking-wider">
                  Biogenic Ice Chemistry
                </p>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-foreground/90">
                  {SPLICES_INFO.scientificSignificance}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span>
                    Citation: {SPLICES_INFO.primaryPaper.authors} ({SPLICES_INFO.primaryPaper.year})
                  </span>
                  <span>DOI: {SPLICES_INFO.primaryPaper.doi}</span>
                </div>
              </div>

              {/* Sample SPLICES Sources Explorer */}
              <div className="mt-8">
                <h3 className="text-lg font-medium">Sample High-Priority SPLICES Targets</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a representative target to inspect coordinates, multi-band broadband
                  photometry, and ice mantle optical depths:
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {SAMPLE_SPLICES_SOURCES.map((src) => (
                    <button
                      key={src.id}
                      onClick={() => setSelectedSplices(src)}
                      className={cn(
                        "rounded-2xl p-4 text-left border transition-all",
                        selectedSplices.id === src.id
                          ? "border-primary bg-primary/15 shadow-sm glow-cyan"
                          : "border-glass-border bg-background/40 hover:bg-background/70",
                      )}
                    >
                      <span className="font-mono text-[10px] text-primary uppercase">{src.id}</span>
                      <h4 className="mt-1 text-sm font-semibold truncate">{src.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{src.type}</p>
                      <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                        <span>Ks = {src.ksMag} mag</span>
                        <span className="text-aurora">τ(H2O)={src.opticalDepthH2O}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Selected Source Details */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/50 p-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <span className="rounded-lg bg-primary/20 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                        {selectedSplices.id}
                      </span>
                      <h4 className="text-xl font-semibold mt-2">{selectedSplices.name}</h4>
                      <p className="text-xs text-muted-foreground">{selectedSplices.type}</p>
                      <p className="mt-3 text-xs leading-relaxed text-foreground/90">
                        {selectedSplices.notes}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-background/40 p-4 space-y-2 font-mono text-xs">
                      <p className="font-bold text-primary uppercase text-[10px] tracking-wider">
                        Astrometry (J2000)
                      </p>
                      <p>RA: {selectedSplices.ra.toFixed(4)}°</p>
                      <p>Dec: {selectedSplices.dec.toFixed(4)}°</p>
                      <p>Galactic l: {selectedSplices.glon}°</p>
                      <p>Galactic b: {selectedSplices.glat}°</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-background/40 p-4 space-y-2 font-mono text-xs">
                      <p className="font-bold text-aurora uppercase text-[10px] tracking-wider">
                        Photometry & Ice Depth
                      </p>
                      <p>
                        2MASS: J={selectedSplices.jMag}, H={selectedSplices.hMag}, Ks=
                        {selectedSplices.ksMag}
                      </p>
                      <p>
                        WISE: W1={selectedSplices.w1Mag}, W2={selectedSplices.w2Mag}
                      </p>
                      <p className="text-primary font-bold">
                        H2O Ice (3.05µm) τ = {selectedSplices.opticalDepthH2O}
                      </p>
                      <p className="text-aurora font-bold">
                        CO2 Ice (4.27µm) τ = {selectedSplices.opticalDepthCO2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMET 3I/ATLAS */}
        {activeTab === "comet" && (
          <div className="mt-8 space-y-10 animate-rise">
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                    <Radio className="h-3.5 w-3.5" />
                    Interstellar Object
                  </div>
                  <h2 className="mt-1 text-2xl font-light">{COMET_3I_ATLAS.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    SPHEREx observed interstellar comet 3I/ATLAS in August and December 2025 during
                    its hyperbolic passage through our Solar System.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="hero" size="sm">
                    <a
                      href={COMET_3I_ATLAS.observationTableVoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Observation Table (VOTable)
                    </a>
                  </Button>
                </div>
              </div>

              {/* Photometry Guidance Warning */}
              <div className="mt-6 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-300">
                      Photometry Guidance for Extended Comas
                    </h4>
                    <p className="mt-1 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {COMET_3I_ATLAS.photometryGuidance}
                    </p>
                  </div>
                </div>
              </div>

              {/* Observation Epochs */}
              <div className="mt-8">
                <h3 className="text-lg font-medium">Observation Campaigns & Findings</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {COMET_3I_ATLAS.observationEpochs.map((epoch) => (
                    <div
                      key={epoch.period}
                      className="rounded-2xl border border-glass-border bg-background/40 p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-primary">
                          {epoch.period}
                        </span>
                        <span className="font-mono text-xs text-muted-foreground">
                          r = {epoch.distanceAU} AU
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-foreground/90 leading-relaxed">
                        {epoch.features}
                      </p>
                      <p className="mt-3 text-xs font-mono text-muted-foreground border-t border-glass-border/60 pt-3">
                        Paper: {epoch.citation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Download Scripts */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/50 p-6">
                <h3 className="text-base font-medium">Batch Download Scripts</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Shell scripts to retrieve all calibrated SPHEREx spectral images covering
                  3I/ATLAS:
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button asChild variant="glass" size="sm">
                    <a
                      href={COMET_3I_ATLAS.downloadWgetScriptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      3IATLASImages-wget.sh
                    </a>
                  </Button>
                  <Button asChild variant="glass" size="sm">
                    <a
                      href={COMET_3I_ATLAS.downloadCurlScriptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      3IATLASImages-curl.sh
                    </a>
                  </Button>
                  <Button asChild variant="glass" size="sm">
                    <a
                      href={COMET_3I_ATLAS.irsaViewerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Open in IRSA Viewer
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CLOUD & APIS */}
        {activeTab === "cloud" && (
          <div className="mt-8 space-y-10 animate-rise">
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-mono text-primary uppercase">
                    <Cloud className="h-3.5 w-3.5" />
                    Cloud Architecture
                  </div>
                  <h2 className="mt-1 text-2xl font-light">AWS S3 Cloud Storage & Open Data</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Direct high-throughput access to SPHEREx datasets hosted on Amazon Web Services
                    (AWS) Open Data Program in us-east-1.
                  </p>
                </div>
                <Button asChild variant="hero" size="sm">
                  <a
                    href={CLOUD_ACCESS.s3ConsoleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Browse S3 Bucket
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </div>

              {/* Bucket details */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-glass-border bg-background/40 p-4 font-mono text-xs">
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    S3 Bucket
                  </span>
                  <span className="text-primary font-bold text-sm">{CLOUD_ACCESS.s3Bucket}</span>
                </div>
                <div className="rounded-2xl border border-glass-border bg-background/40 p-4 font-mono text-xs">
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    AWS Region
                  </span>
                  <span className="text-foreground font-bold text-sm">{CLOUD_ACCESS.s3Region}</span>
                </div>
                <div className="rounded-2xl border border-glass-border bg-background/40 p-4 font-mono text-xs">
                  <span className="text-muted-foreground block text-[10px] uppercase">
                    Authentication
                  </span>
                  <span className="text-green-400 font-bold text-sm">
                    --no-sign-request (Public)
                  </span>
                </div>
              </div>

              {/* AWS CLI Example Generator */}
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      List Data Release 1 Contents
                    </span>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(CLOUD_ACCESS.awsCliExamples.listDr1, "aws_dr1")
                      }
                    >
                      {copiedKey === "aws_dr1" ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span className="ml-1 text-xs">Copy</span>
                    </Button>
                  </div>
                  <pre className="mt-2 font-mono text-xs text-primary leading-relaxed">
                    {CLOUD_ACCESS.awsCliExamples.listDr1}
                  </pre>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      List All-Sky Spectral Cube
                    </span>
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(CLOUD_ACCESS.awsCliExamples.listAllSkyCube, "aws_cube")
                      }
                    >
                      {copiedKey === "aws_cube" ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span className="ml-1 text-xs">Copy</span>
                    </Button>
                  </div>
                  <pre className="mt-2 font-mono text-xs text-primary leading-relaxed">
                    {CLOUD_ACCESS.awsCliExamples.listAllSkyCube}
                  </pre>
                </div>
              </div>

              {/* Moving Object Search Tool (MOST) & VO APIs */}
              <div className="mt-8 border-t border-glass-border/60 pt-6">
                <h3 className="text-lg font-medium">
                  Virtual Observatory (VO) & Solar System Services
                </h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-glass-border bg-background/40 p-5">
                    <h4 className="text-base font-semibold text-primary">
                      Moving Object Search Tool (MOST)
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Determine the orbital trajectory for any asteroid or comet, then automatically
                      search SPHEREx images covering the object's predicted positions at exact
                      observation epochs.
                    </p>
                    <div className="mt-4">
                      <Button asChild variant="glass" size="sm">
                        <a
                          href="https://irsa.ipac.caltech.edu/applications/MOST"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          Launch MOST Service
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-glass-border bg-background/40 p-5">
                    <h4 className="text-base font-semibold text-aurora">
                      Simple Image Access (SIA) & TAP
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      Standardized IVOA Simple Image Access protocol allowing automated discovery
                      and extraction of SPHEREx spectral images via astronomical tools like TOPCAT
                      and Astropy.
                    </p>
                    <div className="mt-4">
                      <Button asChild variant="glass" size="sm">
                        <a
                          href="https://irsa.ipac.caltech.edu/ibe/sia.html"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2"
                        >
                          SIA Protocol Guide
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: NOTEBOOKS & CALIBRATIONS */}
        {activeTab === "tutorials" && (
          <div className="mt-8 space-y-10 animate-rise">
            {/* Spectral Calibrations */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="eyebrow">Ground Characterization</p>
                  <h2 className="mt-1 text-2xl font-light">{SPECTRAL_CALIBRATIONS.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Laboratory cryogenic transmission curves delivered at 17, 34, 51, and 68
                    sub-channels per detector band.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="hero" size="sm">
                    <a
                      href={SPECTRAL_CALIBRATIONS.tarDownloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download Spectral Files (.tar)
                    </a>
                  </Button>
                  <Button asChild variant="glass" size="sm">
                    <a
                      href={SPECTRAL_CALIBRATIONS.pdfDocsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Calibration PDF Guide
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>

              {/* Cent vs Allpix response explanation */}
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-glass-border bg-background/40 p-5">
                  <h4 className="font-mono text-xs font-bold text-primary uppercase">
                    Middle-Pixel Response (Cent)
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {SPECTRAL_CALIBRATIONS.middleVsAllPixelExplanation.middlePixel}
                  </p>
                </div>
                <div className="rounded-2xl border border-glass-border bg-background/40 p-5">
                  <h4 className="font-mono text-xs font-bold text-aurora uppercase">
                    All-Pixel Response (Allpix)
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {SPECTRAL_CALIBRATIONS.middleVsAllPixelExplanation.allPixel}
                  </p>
                </div>
              </div>

              {/* Subdirectories in tar */}
              <div className="mt-6 border-t border-glass-border/60 pt-4">
                <p className="font-mono text-xs uppercase text-muted-foreground">
                  Tar Package Contents
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {SPECTRAL_CALIBRATIONS.subdirectories.map((dir) => (
                    <div
                      key={dir.name}
                      className="rounded-xl border border-white/5 bg-black/40 p-3 font-mono text-xs"
                    >
                      <span className="text-primary font-bold">{dir.name}</span>
                      <p className="mt-1 text-[11px] text-muted-foreground font-sans">
                        {dir.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Python Tutorials Library */}
            <div className="rounded-3xl border border-glass-border glass p-6 sm:p-8">
              <p className="eyebrow">Interactive Code</p>
              <h2 className="mt-1 text-2xl font-light">Official Caltech-IPAC Python Notebooks</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Step-by-step Jupyter notebooks for handling SPHEREx spectral images, cutouts, PSFs,
                source discovery, and HiPS cubes.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {PYTHON_TUTORIALS.map((tut) => (
                  <div
                    key={tut.title}
                    className="flex flex-col justify-between rounded-2xl border border-glass-border bg-background/40 p-5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-mono text-[10px] text-primary">
                          {tut.category}
                        </span>
                        <a
                          href={tut.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                        >
                          Open Notebook
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <h3 className="mt-3 text-base font-semibold">{tut.title}</h3>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        {tut.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tut.keyTopics.map((topic) => (
                          <span
                            key={topic}
                            className="rounded-md bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-glass-border/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          Python Snippet
                        </span>
                        <Button
                          variant="glass"
                          size="sm"
                          onClick={() => copyToClipboard(tut.codeSnippet, tut.title)}
                        >
                          {copiedKey === tut.title ? (
                            <Check className="h-3 w-3 text-green-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      <pre className="overflow-x-auto rounded-lg bg-black/60 p-3 font-mono text-[11px] text-foreground/90 leading-relaxed">
                        {tut.codeSnippet}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-20">
        <SiteFooter />
      </div>
    </main>
  );
}
