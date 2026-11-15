import { Link } from "@tanstack/react-router";

const NAV = [
  { to: "/", label: "Observatory" },
  { to: "/explore", label: "Sky Map" },
  { to: "/timeline", label: "Cosmic Timeline" },
  { to: "/spectrum", label: "Spectrum Lab" },
  { to: "/spherex", label: "SPHEREx Mission" },
  { to: "/blink", label: "Planet X Hunter" },
] as const;

export function Logo() {
  return (
    <span className="relative grid h-8 w-8 place-items-center">
      <span className="absolute inset-0 rounded-full border border-white/20" />
      <span className="absolute inset-0 animate-orbit">
        <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-sky-400" />
      </span>
      <span className="h-2.5 w-2.5 rounded-full bg-white shadow-sm" />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/10 bg-zinc-950/70 backdrop-blur-md px-4 py-2.5 shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-display text-sm font-semibold tracking-[0.22em] text-white">
            COSMIC<span className="text-zinc-400 font-normal"> ECHO</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-[13px] text-zinc-400 transition-all duration-200 hover:text-white data-[status=active]:bg-white/10 data-[status=active]:text-white"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400 lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Deep field active
        </div>
      </div>
      <nav className="mx-auto mt-2 flex max-w-7xl gap-1 overflow-x-auto rounded-full border border-white/10 bg-zinc-950/70 backdrop-blur-md p-1 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/" }}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs text-zinc-400 data-[status=active]:bg-white/10 data-[status=active]:text-white"
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <p className="font-display text-sm tracking-[0.22em]">COSMIC ECHO</p>
            <p className="text-xs text-muted-foreground">Every photon is an echo from the past.</p>
          </div>
        </div>
        <p className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
          Educational visualisation · Imagery is artistic rendering · Coordinates J2000
        </p>
      </div>
    </footer>
  );
}
