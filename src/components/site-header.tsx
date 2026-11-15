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
      <span className="absolute inset-0 rounded-full border border-primary/40" />
      <span className="absolute inset-0 animate-orbit">
        <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary glow-cyan" />
      </span>
      <span className="h-3 w-3 rounded-full bg-aurora glow-violet" />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full glass px-4 py-2.5">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="font-display text-sm font-semibold tracking-[0.22em]">
            COSMIC<span className="text-aurora"> ECHO</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="rounded-full px-4 py-2 text-[13px] text-muted-foreground transition-all duration-300 hover:text-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Deep field link
        </div>
      </div>
      <nav className="mx-auto mt-2 flex max-w-7xl gap-1 overflow-x-auto rounded-full glass p-1 md:hidden">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            activeOptions={{ exact: n.to === "/" }}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs text-muted-foreground data-[status=active]:bg-primary/12 data-[status=active]:text-primary"
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

        {/* Project Links & PDF */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <a
            href="/Cosmic_Echo_Atlas_Project_Explanation.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white underline underline-offset-4"
          >
            <span>Project Summary PDF</span>
          </a>
          <a
            href="https://github.com/sreenath1212/cosmic-echo-atlas"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white underline underline-offset-4"
          >
            <span>GitHub</span>
          </a>
          <a
            href="https://cosmic-echo-atlas-tau.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white underline underline-offset-4"
          >
            <span>Live Web App</span>
          </a>
        </div>

        <p className="max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
          NASA Space Apps 2026 · SPHEREx & Planet X Citizen Science
        </p>
      </div>
    </footer>
  );
}
