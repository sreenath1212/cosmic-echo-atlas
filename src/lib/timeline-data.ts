export type EpochTone = "foreground" | "ember" | "infrared" | "violet" | "cyan";

export interface Epoch {
  id: string;
  time: string;
  ago: string;
  title: string;
  era: string;
  redshift: string;
  temperature: string;
  description: string;
  observedBy: string;
  tone: EpochTone;
  haze: number; // opaque plasma / fog
  stars: number; // star density 0..1
  galaxies: number; // galaxy density 0..1
  scale: number; // relative size of the visible universe
}

export const EPOCHS: Epoch[] = [
  {
    id: "bigbang",
    time: "t = 0",
    ago: "13.8 billion years ago",
    title: "The Big Bang",
    era: "Planck epoch",
    redshift: "∞",
    temperature: "> 10³² K",
    description:
      "Space, time and energy emerge in a state of unimaginable density. The four fundamental forces are thought to be unified.",
    observedBy: "Beyond direct observation — inferred from physics",
    tone: "foreground",
    haze: 1,
    stars: 0,
    galaxies: 0,
    scale: 0.18,
  },
  {
    id: "inflation",
    time: "10⁻³⁶ – 10⁻³² s",
    ago: "13.8 billion years ago",
    title: "Cosmic Inflation",
    era: "Inflationary epoch",
    redshift: "~10²⁷",
    temperature: "~10²⁷ K",
    description:
      "Space expands by a factor of at least 10²⁶ in a sliver of a second, stretching quantum ripples into the seeds of all future structure.",
    observedBy: "Imprinted in the CMB polarisation (BICEP, Simons Observatory)",
    tone: "cyan",
    haze: 1,
    stars: 0,
    galaxies: 0,
    scale: 0.42,
  },
  {
    id: "bbn",
    time: "3 minutes",
    ago: "13.8 billion years ago",
    title: "First Nuclei",
    era: "Nucleosynthesis",
    redshift: "~4 × 10⁸",
    temperature: "~10⁹ K",
    description:
      "Protons and neutrons fuse into hydrogen, helium and a trace of lithium. The cosmic recipe — 75% hydrogen, 25% helium — is set.",
    observedBy: "Primordial abundances in pristine gas clouds",
    tone: "infrared",
    haze: 0.95,
    stars: 0,
    galaxies: 0,
    scale: 0.52,
  },
  {
    id: "cmb",
    time: "380,000 years",
    ago: "13.8 billion years ago",
    title: "First Light",
    era: "Recombination",
    redshift: "1,100",
    temperature: "3,000 K",
    description:
      "Electrons bind to nuclei and the universe turns transparent. The light released then is the cosmic microwave background we still detect.",
    observedBy: "COBE · WMAP · Planck",
    tone: "ember",
    haze: 0.55,
    stars: 0,
    galaxies: 0,
    scale: 0.62,
  },
  {
    id: "darkages",
    time: "0.4 – 100 Myr",
    ago: "13.7 billion years ago",
    title: "The Dark Ages",
    era: "Dark Ages",
    redshift: "1,100 – 30",
    temperature: "3,000 → 80 K",
    description:
      "No stars yet. Neutral hydrogen fills space while dark matter quietly pulls gas into ever-denser clumps.",
    observedBy: "21 cm hydrogen line (future lunar radio arrays)",
    tone: "violet",
    haze: 0.12,
    stars: 0,
    galaxies: 0,
    scale: 0.7,
  },
  {
    id: "dawn",
    time: "~100 Myr",
    ago: "13.7 billion years ago",
    title: "Cosmic Dawn",
    era: "First stars",
    redshift: "~30 – 20",
    temperature: "~60 K",
    description:
      "The first stars ignite — giants of hundreds of solar masses, living fast and seeding space with the first heavy elements.",
    observedBy: "James Webb Space Telescope (indirectly)",
    tone: "cyan",
    haze: 0.1,
    stars: 0.25,
    galaxies: 0,
    scale: 0.76,
  },
  {
    id: "galaxies",
    time: "~290 Myr",
    ago: "13.5 billion years ago",
    title: "First Galaxies",
    era: "Galaxy assembly",
    redshift: "14.3",
    temperature: "~42 K",
    description:
      "Small, bright galaxies appear. JWST has spotted JADES-GS-z14-0, seen as it was less than 300 million years after the Big Bang.",
    observedBy: "JWST NIRCam & NIRSpec",
    tone: "infrared",
    haze: 0.08,
    stars: 0.45,
    galaxies: 0.3,
    scale: 0.8,
  },
  {
    id: "reion",
    time: "~1 billion years",
    ago: "12.8 billion years ago",
    title: "Reionisation Ends",
    era: "Epoch of reionisation",
    redshift: "~6",
    temperature: "~19 K",
    description:
      "Ultraviolet light from stars and quasars strips electrons from hydrogen, clearing the cosmic fog across intergalactic space.",
    observedBy: "Quasar spectra · JWST · Planck",
    tone: "violet",
    haze: 0.04,
    stars: 0.6,
    galaxies: 0.5,
    scale: 0.85,
  },
  {
    id: "noon",
    time: "~3.5 billion years",
    ago: "10.3 billion years ago",
    title: "Cosmic Noon",
    era: "Peak star formation",
    redshift: "~2",
    temperature: "~8 K",
    description:
      "Galaxies form stars at their highest rate ever, and supermassive black holes grow fastest. Most of today's stars are born around now.",
    observedBy: "Hubble · Spitzer · ALMA",
    tone: "ember",
    haze: 0,
    stars: 0.85,
    galaxies: 0.85,
    scale: 0.9,
  },
  {
    id: "sun",
    time: "9.2 billion years",
    ago: "4.6 billion years ago",
    title: "Our Sun Is Born",
    era: "Solar System",
    redshift: "~0.43",
    temperature: "~3.9 K",
    description:
      "A cloud in the Milky Way's Orion Arm collapses to form the Sun. Within 100 million years, Earth assembles from the leftover disk.",
    observedBy: "Meteorite isotopes · solar models",
    tone: "infrared",
    haze: 0,
    stars: 0.9,
    galaxies: 0.9,
    scale: 0.94,
  },
  {
    id: "darkenergy",
    time: "~10 billion years",
    ago: "~4 billion years ago",
    title: "Dark Energy Takes Over",
    era: "Accelerating expansion",
    redshift: "~0.3",
    temperature: "~3.5 K",
    description:
      "Dark energy overtakes matter as the dominant ingredient and cosmic expansion begins to speed up.",
    observedBy: "Type Ia supernovae · DESI · Euclid",
    tone: "violet",
    haze: 0,
    stars: 0.95,
    galaxies: 0.95,
    scale: 0.97,
  },
  {
    id: "today",
    time: "13.8 billion years",
    ago: "Now",
    title: "Today",
    era: "Present epoch",
    redshift: "0",
    temperature: "2.725 K",
    description:
      "Two trillion galaxies spread across an observable universe 93 billion light-years wide — and we are learning to read their echoes.",
    observedBy: "JWST · Hubble · Euclid · Rubin Observatory",
    tone: "cyan",
    haze: 0,
    stars: 1,
    galaxies: 1,
    scale: 1,
  },
];
