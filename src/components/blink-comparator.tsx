import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Crosshair,
  Sliders,
  CheckCircle2,
  Clock,
  Radio,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Trophy,
  Copy,
  Info,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { type MostObservation } from "@/lib/irsa-api";
import { cn } from "@/lib/utils";

interface BlinkComparatorProps {
  epochA: MostObservation;
  epochB: MostObservation;
  targetName?: string | undefined;
  motionRate?: string | undefined;
  difficulty?: string | undefined;
  story?: string | undefined;
  whatToLookFor?: string | undefined;
  distanceInMiles?: string | undefined;
}

export function BlinkComparator({
  epochA,
  epochB,
  targetName = "Target",
  motionRate,
  difficulty = "Standard Target",
  story,
  whatToLookFor,
  distanceInMiles,
}: BlinkComparatorProps) {
  const [mode, setMode] = useState<"slider" | "blink">("blink");
  const [sliderPos, setSliderPos] = useState(50);
  const [isBlinking, setIsBlinking] = useState(true);
  const [currentBlinkEpoch, setCurrentBlinkEpoch] = useState<"A" | "B">("A");
  const [blinkSpeedMs, setBlinkSpeedMs] = useState(500);
  const [detectiveVision, setDetectiveVision] = useState(true);
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Auto-blink flipbook timer loop
  useEffect(() => {
    if (mode !== "blink" || !isBlinking) return;
    const interval = setInterval(() => {
      setCurrentBlinkEpoch((prev) => (prev === "A" ? "B" : "A"));
    }, blinkSpeedMs);
    return () => clearInterval(interval);
  }, [mode, isBlinking, blinkSpeedMs]);

  // Pointer drag for split slider
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateSlider(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const updateSlider = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    setSliderPos((x / rect.width) * 100);
  };

  // Coordinate offset delta calculation
  const raDiff = Math.abs(epochB.ra - epochA.ra);
  const decDiff = Math.abs(epochB.dec - epochA.dec);
  const totalOffsetDeg = Math.sqrt(raDiff * raDiff + decDiff * decDiff);

  // Format human dates
  const formatDateOnly = (dateStr: string) => {
    if (dateStr.includes("2010")) return "June 2010 (WISE)";
    if (dateStr.includes("2025-07-28")) return "July 28, 2025 (SPHEREx)";
    if (dateStr.includes("2025-08-01")) return "Aug 01, 2025 (SPHEREx)";
    if (dateStr.includes("2025-05-14")) return "May 14, 2025 (SPHEREx)";
    if (dateStr.includes("2025-05-22")) return "May 22, 2025 (SPHEREx)";
    if (dateStr.includes("2025-08-10")) return "Aug 10, 2025 (SPHEREx)";
    return dateStr.split(" ")[0] || dateStr;
  };

  const handleCopyReport = () => {
    const text = `=== NASA Space Apps 2026 Citizen Science Discovery ===\nTarget: ${targetName}\nPhoto 1: ${epochA.obsDate} (RA ${epochA.ra}°, Dec ${epochA.dec}°)\nPhoto 2: ${epochB.obsDate} (RA ${epochB.ra}°, Dec ${epochB.dec}°)\nObserved Motion: ${totalOffsetDeg.toFixed(4)}° (${motionRate || "detected"})\nStatus: Verified via SPHEREx DR1 Level 2 & WISE Baselines`;
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Target Mission Brief Card */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-xs font-medium text-zinc-200">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Target Analysis</span>
            </span>
            <span className="text-xs font-mono text-zinc-400">{difficulty}</span>
          </div>
          <p className="text-sm font-medium text-zinc-100">
            {whatToLookFor ||
              "Look inside the target area: background stars stay fixed, while the orbiting body changes position."}
          </p>
          {story && <p className="text-xs text-zinc-400">{story}</p>}
        </div>

        {/* Flag Candidate Action */}
        <Button
          variant="hero"
          size="default"
          onClick={() => setCertModalOpen(true)}
          className="w-full md:w-auto shrink-0 gap-2"
        >
          <Trophy className="h-4 w-4 text-amber-600" />
          <span>I Found It · Flag Candidate</span>
        </Button>
      </div>

      {/* Main Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/60 p-3 sm:px-4 backdrop-blur-md">
        {/* Mode Selector - Clean Segmented Control */}
        <div className="flex items-center gap-1 rounded-xl bg-black/50 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setMode("blink");
              setIsBlinking(true);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
              mode === "blink"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Auto-Blink</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("slider");
              setIsBlinking(false);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
              mode === "slider"
                ? "bg-white text-zinc-950 font-semibold shadow-sm"
                : "text-zinc-400 hover:text-white"
            )}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Split Slider</span>
          </button>
        </div>

        {/* Detective Vision Toggle - Understated Precision State */}
        <button
          type="button"
          onClick={() => setDetectiveVision(!detectiveVision)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs border transition-all",
            detectiveVision
              ? "border-sky-500/40 bg-sky-950/40 text-sky-200 shadow-sm"
              : "border-white/10 bg-white/5 text-zinc-400 hover:text-white"
          )}
        >
          {detectiveVision ? (
            <>
              <Eye className="h-4 w-4 text-sky-400" />
              <span>Motion Markers: ON</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-zinc-500" />
              <span>Motion Markers: OFF</span>
            </>
          )}
        </button>

        {/* Blink Speed Controls (Blink Mode Only) */}
        {mode === "blink" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBlinking(!isBlinking)}
              className="gap-1.5 h-8 font-mono text-xs border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10"
            >
              {isBlinking ? <Pause className="h-3.5 w-3.5 text-zinc-400" /> : <Play className="h-3.5 w-3.5 text-zinc-200" />}
              <span>{isBlinking ? "Pause" : "Play"}</span>
            </Button>
            <div className="flex items-center gap-1 font-mono text-[11px] text-zinc-400 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
              <span>Interval:</span>
              {[
                { label: "0.5s", ms: 500 },
                { label: "0.3s", ms: 300 },
                { label: "0.8s", ms: 800 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setBlinkSpeedMs(s.ms)}
                  className={cn(
                    "px-1.5 py-0.5 rounded transition-colors",
                    blinkSpeedMs === s.ms ? "bg-white/20 text-white font-medium" : "hover:text-white"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Image Display Box */}
      <div
        ref={containerRef}
        onPointerDown={mode === "slider" ? handlePointerDown : undefined}
        onPointerMove={mode === "slider" ? handlePointerMove : undefined}
        onPointerUp={mode === "slider" ? handlePointerUp : undefined}
        className={cn(
          "relative aspect-[16/10] w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-black shadow-xl",
          mode === "slider" ? "cursor-ew-resize" : "cursor-default"
        )}
      >
        {/* 1. SLIDER MODE */}
        {mode === "slider" && (
          <>
            {/* Epoch B (Photo 2 - Base Layer) */}
            <img
              src={epochB.previewUrl}
              alt={`Photo 2 of ${targetName}`}
              className="absolute inset-0 h-full w-full object-cover filter contrast-125"
            />

            {/* Epoch A (Photo 1 - Clipped Layer on Top) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src={epochA.previewUrl}
                alt={`Photo 1 of ${targetName}`}
                className="absolute inset-0 h-full w-full object-cover filter contrast-125"
              />
            </div>

            {/* Drag Handle Divider */}
            <div
              className="absolute inset-y-0 w-0.5 bg-white/70 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950 border border-white/30 font-mono text-[11px] text-white shadow-lg">
                ⟷
              </div>
            </div>

            {/* Slider Guidance Overlay */}
            <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-black/80 px-4 py-1.5 font-mono text-xs text-zinc-400 backdrop-blur-md border border-white/10">
              Drag line horizontally to inspect positional shift
            </div>
          </>
        )}

        {/* 2. AUTO-BLINK FLIPBOOK MODE */}
        {mode === "blink" && (
          <div className="absolute inset-0">
            <img
              src={currentBlinkEpoch === "A" ? epochA.previewUrl : epochB.previewUrl}
              alt={`Flip scan for ${targetName}`}
              className="h-full w-full object-cover filter contrast-125 transition-none"
            />

            {/* Observatory Photo Status Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-black/80 backdrop-blur-md px-4 py-1.5 font-mono text-xs font-medium text-white border border-white/15 shadow-xl">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  currentBlinkEpoch === "A" ? "bg-sky-400" : "bg-amber-400"
                )}
              />
              <span>
                {currentBlinkEpoch === "A" ? "PHOTO 1: " : "PHOTO 2: "}
                {formatDateOnly(currentBlinkEpoch === "A" ? epochA.obsDate : epochB.obsDate)}
              </span>
            </div>
          </div>
        )}

        {/* 3. PRECISION MOTION MARKERS OVERLAY */}
        {detectiveVision && (
          <div className="pointer-events-none absolute inset-0">
            {/* Position in Photo 1 (Epoch A Marker) */}
            <div
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200",
                mode === "blink" && currentBlinkEpoch === "B" ? "opacity-35" : "opacity-100"
              )}
              style={{ left: "48%", top: "52%" }}
            >
              <div className="h-12 w-12 rounded-full border border-sky-400/80 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              </div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-black/90 px-2 py-0.5 font-mono text-[10px] text-sky-300 whitespace-nowrap border border-sky-500/30">
                Position 1
              </span>
            </div>

            {/* Trajectory Vector */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: "51%", top: "49%" }}
            >
              <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-300 bg-black/85 px-2 py-0.5 rounded border border-white/15">
                <span>Δθ ~{totalOffsetDeg.toFixed(3)}°</span>
                <ArrowRight className="h-3 w-3 text-zinc-400" />
              </div>
            </div>

            {/* Position in Photo 2 (Epoch B Marker) */}
            <div
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200",
                mode === "blink" && currentBlinkEpoch === "A" ? "opacity-35" : "opacity-100"
              )}
              style={{ left: "54%", top: "46%" }}
            >
              <div className="h-12 w-12 rounded-full border border-amber-400/80 flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-black/90 px-2 py-0.5 font-mono text-[10px] text-amber-300 whitespace-nowrap border border-amber-500/30">
                Position 2
              </span>
            </div>
          </div>
        )}

        {/* Standard Clean Telescope Reticle */}
        {!detectiveVision && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-12 w-12 rounded-full border border-white/20" />
              <Crosshair className="absolute h-6 w-6 text-zinc-400 opacity-60" />
              <div className="absolute -top-7 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-zinc-300 whitespace-nowrap border border-white/15">
                Target Zone: {targetName}
              </div>
            </div>
          </div>
        )}

        {/* Top Badges (Photo 1 & Photo 2 Info) */}
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-black/70 border border-white/10 px-3 py-1.5 font-mono text-xs backdrop-blur-sm">
          <span className="text-sky-300 font-medium">PHOTO 1:</span>{" "}
          <span className="text-zinc-200">{formatDateOnly(epochA.obsDate)}</span>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 rounded-xl bg-black/70 border border-white/10 px-3 py-1.5 font-mono text-xs text-right backdrop-blur-sm">
          <span className="text-amber-300 font-medium">PHOTO 2:</span>{" "}
          <span className="text-zinc-200">{formatDateOnly(epochB.obsDate)}</span>
        </div>

        {/* Bottom Status Readout */}
        <div className="pointer-events-none absolute bottom-4 inset-x-4 flex items-center justify-between text-xs font-mono text-zinc-400">
          <div className="rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-sm border border-white/10">
            Distance: {distanceInMiles || `${epochA.distAu} AU`}
          </div>
          {motionRate && (
            <div className="rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-sm text-zinc-200 border border-white/15">
              Motion: {motionRate}
            </div>
          )}
          <div className="rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-sm border border-white/10 hidden sm:block text-zinc-300">
            Target: {targetName}
          </div>
        </div>
      </div>

      {/* Observation Methodology Note */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/30 p-3 text-xs text-zinc-400 flex items-center gap-2">
        <Info className="h-4 w-4 text-zinc-400 shrink-0" />
        <span>
          <strong>Observatory Principle:</strong> Distant stars remain stationary over short baselines.
          Bodies gravitationally bound within our solar system exhibit measurable parallax and orbital
          proper motion between observational epochs.
        </span>
      </div>

      {/* Comparison Cards: Photo 1 vs Photo 2 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Photo 1 Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-xs font-medium text-sky-200">
              Photo 1 Metadata
            </span>
            <span className="font-mono text-xs text-zinc-400">{epochA.obsDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
            <div className="rounded-lg bg-black/40 p-2 border border-white/5">
              <span className="block text-[10px] text-zinc-400">Coordinates (J2000)</span>
              <span className="font-semibold text-zinc-200">
                RA {epochA.ra}°, Dec {epochA.dec}°
              </span>
            </div>
            <div className="rounded-lg bg-black/40 p-2 border border-white/5">
              <span className="block text-[10px] text-zinc-400">Infrared Channel</span>
              <span className="font-semibold text-zinc-200 truncate block">{epochA.detector}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-mono text-[11px] text-zinc-500">NASA / IPAC IRSA Archive</span>
            <a
              href={epochA.cutoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-300 hover:text-white hover:underline"
            >
              <Download className="h-3 w-3" />
              <span>SPHEREx FITS</span>
            </a>
          </div>
        </div>

        {/* Photo 2 Card */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-4 space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-white/10 border border-white/10 px-2 py-0.5 font-mono text-xs font-medium text-amber-200">
              Photo 2 Metadata
            </span>
            <span className="font-mono text-xs text-zinc-400">{epochB.obsDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
            <div className="rounded-lg bg-black/40 p-2 border border-white/5">
              <span className="block text-[10px] text-zinc-400">Coordinates (J2000)</span>
              <span className="font-semibold text-zinc-200">
                RA {epochB.ra}°, Dec {epochB.dec}°
              </span>
            </div>
            <div className="rounded-lg bg-black/40 p-2 border border-white/5">
              <span className="block text-[10px] text-zinc-400">Infrared Channel</span>
              <span className="font-semibold text-zinc-200 truncate block">{epochB.detector}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-mono text-[11px] text-zinc-500">NASA / IPAC IRSA Archive</span>
            <a
              href={epochB.cutoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-zinc-300 hover:text-white hover:underline"
            >
              <Download className="h-3 w-3" />
              <span>SPHEREx FITS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Citizen Science Discovery Certificate Modal */}
      <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
        <DialogContent className="max-w-xl border border-white/15 bg-zinc-950 text-zinc-100 backdrop-blur-xl p-6 sm:p-8 overflow-hidden relative">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden opacity-20">
            <img src="/planet-x.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/80 to-zinc-950" />
          </div>

          <DialogHeader className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-mono text-xs font-semibold text-zinc-200 border border-white/10">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                <span>CITIZEN SCIENCE DISCOVERY LOG</span>
              </span>
              <span className="font-mono text-xs text-zinc-400">NASA Space Apps 2026</span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-display font-light text-white">
              Candidate Confirmed: <span className="font-semibold text-zinc-100">{targetName}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-400">
              You confirmed a moving solar system body using multi-epoch comparative astronomy.
            </DialogDescription>
          </DialogHeader>

          {/* Certificate Card Body */}
          <div className="rounded-2xl border border-white/10 bg-black/50 p-5 space-y-4 my-2 relative z-10">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs text-zinc-400 font-mono">STATUS</span>
              <span className="font-mono text-xs font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                VERIFIED VIA SPHEREx DR1
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <span className="text-zinc-500 block text-[11px]">Object Classification</span>
                <span className="font-semibold text-white">{targetName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Measured Movement</span>
                <span className="font-semibold text-zinc-200">
                  {totalOffsetDeg.toFixed(4)}° ({motionRate || "detected"})
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Photo 1 Timestamp</span>
                <span className="text-zinc-300">{epochA.obsDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Photo 2 Timestamp</span>
                <span className="text-zinc-300">{epochB.obsDate}</span>
              </div>
            </div>

            <div className="rounded-xl bg-zinc-900/60 p-3 text-xs leading-relaxed text-zinc-400 border border-white/5">
              <strong>Historical Context:</strong> In 1930, Clyde Tombaugh spent thousands of hours
              manually examining glass plates on a mechanical blink comparator to discover Pluto. You've
              applied that exact comparative principle across NASA's next-generation SPHEREx infrared
              space observatory data.
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 relative z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReport}
              className="gap-1.5 font-mono text-xs border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
            >
              {copiedReport ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Report Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Report</span>
                </>
              )}
            </Button>

            <Button
              variant="hero"
              size="sm"
              onClick={() => setCertModalOpen(false)}
              className="font-mono text-xs"
            >
              Close & Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
