export type BandId =
  "radio" | "microwave" | "infrared" | "visible" | "ultraviolet" | "xray" | "gamma";

export interface Band {
  id: BandId;
  name: string;
  /** log10 of wavelength in metres: [long end, short end] */
  logRange: [number, number];
  range: string;
  emitters: string;
  reveals: string;
  telescopes: string;
  tone: "violet" | "ember" | "infrared" | "foreground" | "cyan";
  render: "visible" | "infrared";
  filter: string;
}

/** Ordered from longest to shortest wavelength. */
export const BANDS: Band[] = [
  {
    id: "radio",
    name: "Radio",
    logRange: [3, -1],
    range: "> 10 cm",
    emitters: "Cold gas, pulsars, black-hole jets",
    reveals: "Neutral hydrogen, magnetic fields and the shadow of black holes.",
    telescopes: "VLA · MeerKAT · Event Horizon Telescope",
    tone: "violet",
    render: "infrared",
    filter: "band-radio",
  },
  {
    id: "microwave",
    name: "Microwave",
    logRange: [-1, -3],
    range: "1 mm – 10 cm",
    emitters: "The cosmic microwave background, cold molecular clouds",
    reveals: "The afterglow of the Big Bang and the coldest dust in galaxies.",
    telescopes: "Planck · ALMA · WMAP",
    tone: "ember",
    render: "infrared",
    filter: "band-microwave",
  },
  {
    id: "infrared",
    name: "Infrared",
    logRange: [-3, -6.155],
    range: "700 nm – 1 mm",
    emitters: "Warm dust, protostars, distant redshifted galaxies",
    reveals: "Penetrates dust to expose newborn stars and the first galaxies.",
    telescopes: "JWST · Spitzer · Herschel",
    tone: "infrared",
    render: "infrared",
    filter: "",
  },
  {
    id: "visible",
    name: "Visible",
    logRange: [-6.155, -6.4],
    range: "400 – 700 nm",
    emitters: "Stars like the Sun, glowing hydrogen gas",
    reveals: "The universe as our eyes evolved to see it.",
    telescopes: "Hubble · Rubin Observatory · Gaia",
    tone: "foreground",
    render: "visible",
    filter: "",
  },
  {
    id: "ultraviolet",
    name: "Ultraviolet",
    logRange: [-6.4, -8],
    range: "10 – 400 nm",
    emitters: "Hot young O and B stars, white dwarfs",
    reveals: "Where massive stars are forming right now.",
    telescopes: "GALEX · Hubble STIS · Swift UVOT",
    tone: "violet",
    render: "visible",
    filter: "band-uv",
  },
  {
    id: "xray",
    name: "X-ray",
    logRange: [-8, -11],
    range: "0.01 – 10 nm",
    emitters: "Million-degree gas, accretion disks, supernova remnants",
    reveals: "Matter heated to extreme temperatures around black holes.",
    telescopes: "Chandra · XMM-Newton · XRISM",
    tone: "cyan",
    render: "visible",
    filter: "band-xray",
  },
  {
    id: "gamma",
    name: "Gamma ray",
    logRange: [-11, -14],
    range: "< 0.01 nm",
    emitters: "Gamma-ray bursts, magnetars, particle collisions",
    reveals: "The most violent explosions in the universe.",
    telescopes: "Fermi · Swift BAT · INTEGRAL",
    tone: "cyan",
    render: "visible",
    filter: "band-gamma",
  },
];

/** Slider position 0..1 (equal width per band) → log10 wavelength in metres. */
export function positionToLogWavelength(pos: number): number {
  const p = Math.max(0, Math.min(0.99999, pos));
  const i = Math.floor(p * BANDS.length);
  const f = p * BANDS.length - i;
  const [a, b] = (BANDS[i] ?? BANDS[0]!).logRange;
  return a + (b - a) * f;
}

export function bandForWavelength(metres: number): Band {
  const lg = Math.log10(metres);
  return (
    BANDS.find((b) => lg <= b.logRange[0] && lg > b.logRange[1]) ??
    (lg > 0 ? BANDS[0]! : BANDS[BANDS.length - 1]!)
  );
}

/** Wien's displacement law: peak emission wavelength in metres for a black body at T kelvin. */
export function wienPeak(tempK: number): number {
  return 2.897771955e-3 / tempK;
}

export function formatWavelength(metres: number): string {
  const units: [number, string][] = [
    [1e3, "km"],
    [1, "m"],
    [1e-2, "cm"],
    [1e-3, "mm"],
    [1e-6, "µm"],
    [1e-9, "nm"],
    [1e-12, "pm"],
  ];
  for (const [scale, unit] of units) {
    if (metres >= scale) {
      const v = metres / scale;
      return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${unit}`;
    }
  }
  return `${(metres / 1e-15).toFixed(1)} fm`;
}
