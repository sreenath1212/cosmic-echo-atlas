import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Orbit, Clock3, Waves, Sparkles } from "lucide-react";

import heroImg from "@/assets/hero-nebula.jpg";
import pillarsIr from "@/assets/pillars-infrared.jpg";
import galaxyImg from "@/assets/spiral-galaxy.jpg";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cosmic Echo — Explore the Universe in Every Wavelength" },
      {
        name: "description",
        content:
          "A cinematic astronomy observatory: navigate the night sky, travel 13.8 billion years of cosmic history and see space in infrared.",
      },
      { property: "og:title", content: "Cosmic Echo — Explore the Universe in Every Wavelength" },
      {
        property: "og:description",
        content: "Interactive sky maps, an animated cosmic timeline and infrared visualisation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MODULES = [
  {
    to: "/explore",
    icon: Orbit,
    tag: "Module 01",
    title: "Interactive Sky Map",
    body: "Pan across the celestial sphere, trace constellations and inspect nebulae, galaxies and black holes.",
    img: heroImg,
  },
  {
    to: "/timeline",
    icon: Clock3,
    tag: "Module 02",
    title: "Cosmic Timeline",
    body: "Travel from the first fraction of a second to today, epoch by epoch, as the universe cools and lights up.",
    img: galaxyImg,
  },
  {
    to: "/spectrum",
    icon: Waves,
    tag: "Module 03",
    title: "Spectrum Lab",
    body: "Peel back cosmic dust. Compare visible and infrared views and tune across the electromagnetic spectrum.",
    img: pillarsIr,
  },
  {
    to: "/spherex",
    icon: Sparkles,
    tag: "Module 04",
    title: "SPHEREx Mission Portal",
    body: "NASA all-sky spectral survey. DR1 products, SPLICES 9M ice catalog, 102-channel spectrophotometry and AWS cloud data.",
    img: heroImg,
  },
] as const;

const STATS = [
  { value: "13.8", unit: "Gyr", label: "Age of the universe" },
  { value: "102", unit: "channels", label: "SPHEREx spectral survey" },
  { value: "100%", unit: "all-sky", label: "SPHEREx infrared mapping" },
  { value: "0.75–5.0", unit: "µm", label: "SPHEREx 6 LVF bands" },
];

function UtcClock() {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date().toISOString().slice(11, 19));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{now ?? "--:--:--"} UTC</span>;
}

function Index() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Glowing nebula with cyan and violet gas clouds and a distant spiral galaxy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover animate-drift"
        />
        <div className="absolute inset-0 bg-hero-fade" />
        <div className="absolute inset-0 bg-bottom-fade" />
        <div className="pointer-events-none absolute inset-0 hud-grid opacity-50" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 animate-scan bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

        <div className="relative mx-auto w-full max-w-7xl px-6 pt-28">
          <p className="eyebrow animate-rise">Deep Space Visualisation Platform</p>
          <h1
            className="mt-6 max-w-4xl font-display text-5xl font-light leading-[0.95] sm:text-7xl lg:text-8xl animate-rise"
            style={{ animationDelay: "120ms" }}
          >
            COSMIC
            <br />
            <span className="font-semibold text-aurora text-glow">ECHO</span>
          </h1>
          <p
            className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg animate-rise"
            style={{ animationDelay: "260ms" }}
          >
            Light that reaches us tonight left its source long ago. Explore the sky, its history and
            its hidden wavelengths in one observatory.
          </p>
          <div
            className="mt-10 flex flex-wrap gap-3 animate-rise"
            style={{ animationDelay: "400ms" }}
          >
            <Button asChild variant="hero" size="xl">
              <Link to="/explore">
                Launch Sky Map <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/spectrum">See in infrared</Link>
            </Button>
            <Button asChild variant="glass" size="xl">
              <Link to="/spherex">
                <Sparkles className="h-4 w-4 text-primary" />
                SPHEREx Mission
              </Link>
            </Button>
          </div>
        </div>

        {/* HUD corners */}
        <div className="absolute bottom-8 left-6 hidden font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
          <p className="text-primary">● Signal acquired</p>
          <p className="mt-1">RA 18h 18m 48s · DEC −13° 49′</p>
        </div>
        <div className="absolute bottom-8 right-6 hidden text-right font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
          <p>
            <UtcClock />
          </p>
          <p className="mt-1">Band · NIRCam F444W</p>
        </div>
      </section>

      {/* Stats */}
      <section className="relative mx-auto -mt-6 max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl glass lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-background/30 p-6">
              <p className="font-display text-3xl font-light">
                {s.value}
                <span className="ml-1.5 text-sm text-primary">{s.unit}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modules */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Instruments</p>
            <h2 className="mt-4 max-w-xl text-3xl font-light sm:text-4xl">
              Four ways to read the <span className="text-aurora">light of the cosmos</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Each module is a hands-on instrument. Drag, scrub and switch wavelengths to discover
            what the naked eye cannot see.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl glass transition-all duration-700 ease-cosmic hover:-translate-y-1 hover:glow-cyan"
            >
              <img
                src={m.img}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-1000 ease-cosmic group-hover:scale-110 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="relative p-7">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">{m.tag}</span>
                  <m.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-normal">{m.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm text-primary">
                  Open instrument
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Echo statement */}
      <section className="relative overflow-hidden py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-full bg-aurora opacity-20 blur-3xl" />
            <img
              src={galaxyImg}
              alt="Face-on spiral galaxy with golden core and violet arms"
              loading="lazy"
              width={1024}
              height={1024}
              className="relative h-full w-full rounded-full object-cover animate-orbit [animation-duration:120s]"
            />
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute -inset-6 rounded-full border border-dashed border-accent/25" />
          </div>
          <div>
            <p className="eyebrow">Why "echo"</p>
            <h2 className="mt-4 text-3xl font-light leading-tight sm:text-4xl">
              Looking out is <span className="text-aurora">looking back</span>.
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Sunlight is 8 minutes old. The Andromeda Galaxy appears as it was 2.5 million years
              ago. The faint glow of the cosmic microwave background left its source 13.8 billion
              years ago — the oldest echo we can detect.
            </p>
            <div className="mt-10 space-y-4">
              {[
                ["The Sun", "8.3 minutes", "w-[8%]"],
                ["Orion Nebula", "1,344 years", "w-[30%]"],
                ["Andromeda", "2.5 million years", "w-[58%]"],
                ["Cosmic microwave background", "13.8 billion years", "w-full"],
              ].map(([name, age, width]) => (
                <div key={name}>
                  <div className="flex justify-between text-xs">
                    <span>{name}</span>
                    <span className="font-mono text-muted-foreground">{age}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full bg-aurora ${width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
