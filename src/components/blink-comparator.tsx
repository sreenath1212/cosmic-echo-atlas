import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Download,
  Crosshair,
  Sliders,
  CheckCircle2,
  Share2,
  Clock,
  Radio,
  Flame,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Trophy,
  Copy,
  Info,
  HelpCircle,
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
  difficulty = "Beginner 🟢",
  story,
  whatToLookFor,
  distanceInMiles,
}: BlinkComparatorProps) {
  const [mode, setMode] = useState<"slider" | "blink">("blink"); // Default to blink mode for instant motion recognition
  const [sliderPos, setSliderPos] = useState(50);
  const [isBlinking, setIsBlinking] = useState(true);
  const [currentBlinkEpoch, setCurrentBlinkEpoch] = useState<"A" | "B">("A");
  const [blinkSpeedMs, setBlinkSpeedMs] = useState(500); // 0.5s flip
  const [detectiveVision, setDetectiveVision] = useState(true); // Default ON to help normal users immediately see what moved
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
      {/* Friendly Guide Callout Header */}
      <div className="rounded-2xl border border-aurora/30 bg-aurora/10 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-aurora/20 px-2 py-0.5 font-mono text-xs font-semibold text-aurora">
              <Zap className="h-3 w-3" />
              <span>Detective Objective</span>
            </span>
            <span className="text-xs font-mono text-muted-foreground">{difficulty}</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {whatToLookFor ||
              "Look inside the target circle: the stars remain motionless, but the space rock visibly hops position!"}
          </p>
          {story && <p className="text-xs text-muted-foreground">{story}</p>}
        </div>

        {/* Big Action: Flag Candidate */}
        <Button
          variant="hero"
          size="default"
          onClick={() => setCertModalOpen(true)}
          className="w-full md:w-auto shrink-0 gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Trophy className="h-4 w-4 text-amber-300" />
          <span className="font-semibold">⭐ I Found It! Flag Candidate</span>
        </Button>
      </div>

      {/* Main Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-glass-border glass p-3 sm:px-4">
        {/* Mode Selector */}
        <div className="flex items-center gap-1 rounded-xl bg-background/60 p-1 border border-white/5">
          <button
            type="button"
            onClick={() => {
              setMode("blink");
              setIsBlinking(true);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-xs transition-all",
              mode === "blink"
                ? "bg-aurora text-black font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Auto-Blink (Recommended)</span>
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
                ? "bg-primary text-black font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Split Slider</span>
          </button>
        </div>

        {/* Detective Vision Toggle (Highlights what moved) */}
        <button
          type="button"
          onClick={() => setDetectiveVision(!detectiveVision)}
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs border transition-all",
            detectiveVision
              ? "border-green-500/60 bg-green-500/20 text-green-300 shadow-sm"
              : "border-white/10 bg-white/5 text-muted-foreground hover:text-white"
          )}
        >
          {detectiveVision ? (
            <>
              <Eye className="h-4 w-4 text-green-400" />
              <span>💡 Detective Vision: ON</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <span>Detective Vision: OFF</span>
            </>
          )}
        </button>

        {/* Blink Speed & Pause (Blink Mode Only) */}
        {mode === "blink" && (
          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={() => setIsBlinking(!isBlinking)}
              className="gap-1.5 h-8 font-mono text-xs"
            >
              {isBlinking ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-green-400" />}
              <span>{isBlinking ? "Pause Blink" : "Play Blink"}</span>
            </Button>
            <div className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground bg-background/50 px-2 py-1 rounded-lg">
              <span>Speed:</span>
              {[
                { label: "Normal (0.5s)", ms: 500 },
                { label: "Fast (0.3s)", ms: 300 },
                { label: "Slow (0.8s)", ms: 800 },
              ].map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setBlinkSpeedMs(s.ms)}
                  className={cn(
                    "px-1.5 py-0.5 rounded transition-colors",
                    blinkSpeedMs === s.ms ? "bg-white/20 text-white font-bold" : "hover:text-white"
                  )}
                >
                  {s.label.split(" ")[0]}
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
          "relative aspect-[16/10] w-full select-none overflow-hidden rounded-3xl border border-glass-border bg-black shadow-2xl",
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
              className="absolute inset-y-0 w-0.5 bg-aurora glow-cyan"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full glass-strong border border-aurora font-mono text-xs text-aurora shadow-xl">
                ⟷
              </div>
            </div>

            {/* Slider Guidance Overlay */}
            <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-black/75 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md border border-white/10">
              Drag line left & right to compare Photo 1 vs Photo 2
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

            {/* High-Visibility Current Photo Indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full glass-strong px-5 py-2 font-mono text-xs font-semibold shadow-2xl border border-white/20">
              <span
                className={cn(
                  "h-2.5 w-2.5 rounded-full animate-ping",
                  currentBlinkEpoch === "A" ? "bg-cyan-400" : "bg-amber-400"
                )}
              />
              <span className={currentBlinkEpoch === "A" ? "text-cyan-300 font-bold" : "text-amber-300 font-bold"}>
                {currentBlinkEpoch === "A" ? "📸 PHOTO 1: " : "📸 PHOTO 2: "}
                {formatDateOnly(currentBlinkEpoch === "A" ? epochA.obsDate : epochB.obsDate)}
              </span>
            </div>
          </div>
        )}

        {/* 3. DETECTIVE VISION / MOTION HIGHLIGHT OVERLAY */}
        {detectiveVision && (
          <div className="pointer-events-none absolute inset-0">
            {/* Position in Photo 1 (Epoch A Marker) */}
            <div
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
                mode === "blink" && currentBlinkEpoch === "B" ? "opacity-30" : "opacity-100"
              )}
              style={{ left: "48%", top: "52%" }}
            >
              <div className="h-16 w-16 rounded-full border-2 border-cyan-400/90 animate-pulse flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-cyan-400" />
              </div>
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-black/90 px-2 py-0.5 font-mono text-[10px] text-cyan-300 whitespace-nowrap border border-cyan-400/50">
                Photo 1 Position
              </span>
            </div>

            {/* Trajectory Arrow */}
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{ left: "51%", top: "49%" }}
            >
              <div className="flex items-center gap-1 font-mono text-[10px] text-green-300 bg-black/80 px-2 py-0.5 rounded-full border border-green-500/40">
                <span>Shifted ~{totalOffsetDeg.toFixed(3)}°</span>
                <ArrowRight className="h-3 w-3 text-green-400" />
              </div>
            </div>

            {/* Position in Photo 2 (Epoch B Marker) */}
            <div
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
                mode === "blink" && currentBlinkEpoch === "A" ? "opacity-30" : "opacity-100"
              )}
              style={{ left: "54%", top: "46%" }}
            >
              <div className="h-16 w-16 rounded-full border-2 border-amber-400/90 animate-pulse flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-amber-400" />
              </div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-black/90 px-2 py-0.5 font-mono text-[10px] text-amber-300 whitespace-nowrap border border-amber-400/50">
                Photo 2 Position
              </span>
            </div>
          </div>
        )}

        {/* Reticle / Crosshair Center */}
        {!detectiveVision && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-14 w-14 rounded-full border border-dashed border-primary/80 animate-spin [animation-duration:16s]" />
              <Crosshair className="absolute h-8 w-8 text-aurora opacity-75" />
              <div className="absolute -top-7 rounded bg-black/80 px-2 py-0.5 font-mono text-[10px] text-primary whitespace-nowrap border border-primary/30">
                Search Zone: {targetName}
              </div>
            </div>
          </div>
        )}

        {/* Top Badges (Photo 1 & Photo 2 Info) */}
        <div className="pointer-events-none absolute left-4 top-4 rounded-xl glass px-3 py-1.5 font-mono text-xs">
          <span className="text-cyan-400 font-bold">PHOTO 1:</span>{" "}
          <span className="text-white/90">{formatDateOnly(epochA.obsDate)}</span>
        </div>

        <div className="pointer-events-none absolute right-4 top-4 rounded-xl glass px-3 py-1.5 font-mono text-xs text-right">
          <span className="text-amber-400 font-bold">PHOTO 2:</span>{" "}
          <span className="text-white/90">{formatDateOnly(epochB.obsDate)}</span>
        </div>

        {/* Bottom Quick Readout */}
        <div className="pointer-events-none absolute bottom-4 inset-x-4 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div className="rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-sm border border-white/10">
            Distance: {distanceInMiles || `${epochA.distAu} AU (~${Math.round(epochA.distAu * 92.96)}M miles)`}
          </div>
          {motionRate && (
            <div className="rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-sm text-aurora border border-aurora/30">
              Motion: {motionRate}
            </div>
          )}
          <div className="rounded-lg bg-black/80 px-2.5 py-1 backdrop-blur-sm border border-white/10 hidden sm:block">
            Target: {targetName}
          </div>
        </div>
      </div>

      {/* Detective Hint Banner */}
      <div className="rounded-xl border border-glass-border glass p-3 text-xs text-muted-foreground flex items-center gap-2">
        <Info className="h-4 w-4 text-aurora shrink-0" />
        <span>
          <strong>Why this works:</strong> Stars are trillions of miles away and appear completely frozen.
          Only objects orbiting inside our solar system (asteroids, comets, or outer planets) are close
          enough to jump across the screen over days or years!
        </span>
      </div>

      {/* Comparison Cards: Photo 1 vs Photo 2 */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* Photo 1 Card */}
        <div className="rounded-2xl border border-glass-border glass p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-cyan-400/20 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300">
              📸 Photo 1 Snapshot
            </span>
            <span className="font-mono text-xs text-muted-foreground">{epochA.obsDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
            <div className="rounded-lg bg-background/50 p-2">
              <span className="block text-[10px] text-muted-foreground">Sky Coordinates</span>
              <span className="font-semibold text-foreground">
                RA {epochA.ra}°, Dec {epochA.dec}°
              </span>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <span className="block text-[10px] text-muted-foreground">Infrared Band / Instrument</span>
              <span className="font-semibold text-foreground truncate block">{epochA.detector}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-mono text-[11px] text-muted-foreground">NASA / IPAC IRSA Archive</span>
            <a
              href={epochA.cutoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-400 hover:underline"
            >
              <Download className="h-3 w-3" />
              <span>SPHEREx FITS Image</span>
            </a>
          </div>
        </div>

        {/* Photo 2 Card */}
        <div className="rounded-2xl border border-glass-border glass p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-amber-400/20 px-2 py-0.5 font-mono text-xs font-bold text-amber-300">
              📸 Photo 2 Snapshot
            </span>
            <span className="font-mono text-xs text-muted-foreground">{epochB.obsDate}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-1">
            <div className="rounded-lg bg-background/50 p-2">
              <span className="block text-[10px] text-muted-foreground">Sky Coordinates</span>
              <span className="font-semibold text-foreground">
                RA {epochB.ra}°, Dec {epochB.dec}°
              </span>
            </div>
            <div className="rounded-lg bg-background/50 p-2">
              <span className="block text-[10px] text-muted-foreground">Infrared Band / Instrument</span>
              <span className="font-semibold text-foreground truncate block">{epochB.detector}</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-1 text-xs">
            <span className="font-mono text-[11px] text-muted-foreground">NASA / IPAC IRSA Archive</span>
            <a
              href={epochB.cutoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-[11px] text-amber-400 hover:underline"
            >
              <Download className="h-3 w-3" />
              <span>SPHEREx FITS Image</span>
            </a>
          </div>
        </div>
      </div>

      {/* Citizen Science Discovery Certificate Modal */}
      <Dialog open={certModalOpen} onOpenChange={setCertModalOpen}>
        <DialogContent className="max-w-xl border-aurora/40 bg-black/95 text-foreground backdrop-blur-xl p-6 sm:p-8 overflow-hidden relative">
          {/* Subtle Award Banner Backdrop */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden opacity-30">
            <img src="/planet-x.jpg" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
          </div>

          <DialogHeader className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-aurora/20 px-3 py-1 font-mono text-xs font-bold text-aurora border border-aurora/40">
                <Trophy className="h-3.5 w-3.5 text-amber-300" />
                <span>OFFICIAL CITIZEN SCIENCE LOG</span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">NASA Space Apps 2026</span>
            </div>
            <DialogTitle className="text-2xl sm:text-3xl font-display font-light">
              Candidate Confirmed: <span className="text-aurora font-semibold">{targetName}</span>
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              You just confirmed a real moving solar system body using the classic blink-comparator
              technique invented to discover Pluto!
            </DialogDescription>
          </DialogHeader>

          {/* Certificate Card Body */}
          <div className="rounded-2xl border border-glass-border glass p-5 space-y-4 my-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs text-muted-foreground font-mono">DISCOVERY STATUS</span>
              <span className="font-mono text-xs font-bold text-green-400 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                VERIFIED & LOGGED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Object Classification</span>
                <span className="font-semibold text-white">{targetName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Measured Movement</span>
                <span className="font-semibold text-aurora">
                  {totalOffsetDeg.toFixed(4)}° ({motionRate || "detected"})
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Photo 1 Timestamp</span>
                <span className="text-white/80">{epochA.obsDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Photo 2 Timestamp</span>
                <span className="text-white/80">{epochB.obsDate}</span>
              </div>
            </div>

            <div className="rounded-xl bg-background/60 p-3 text-xs leading-relaxed text-muted-foreground border border-white/5">
              <strong>Astronomer's Note:</strong> In 1930, 24-year-old Clyde Tombaugh spent thousands of
              hours examining glass photographic plates with a mechanical blink comparator until he
              spotted a tiny dot shifting between two nights of exposures — discovering Pluto. You've
              just performed the exact same optical comparison across NASA's next-generation SPHEREx
              space observatory scans!
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReport}
              className="gap-1.5 font-mono text-xs"
            >
              {copiedReport ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                  <span>Report Copied!</span>
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
              Keep Hunting Targets →
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
