// Astronomical reference data for the interactive sky map.
// Coordinates are J2000 equatorial: RA in hours, Dec in degrees.

export type Wavelength = "visible" | "infrared" | "radio";

export interface ConstellationStar {
  name?: string;
  ra: number;
  dec: number;
  mag: number;
}

export interface Constellation {
  id: string;
  name: string;
  stars: ConstellationStar[];
  lines: [number, number][];
}

export interface DeepSkyObject {
  id: string;
  name: string;
  catalog: string;
  type: string;
  ra: number;
  dec: number;
  distance: string;
  magnitude: string;
  size: number; // marker scale
  description: string;
  wavelengths: Record<Wavelength, string>;
}

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "ori",
    name: "Orion",
    stars: [
      { name: "Betelgeuse", ra: 5.919, dec: 7.41, mag: 0.5 },
      { name: "Bellatrix", ra: 5.419, dec: 6.35, mag: 1.6 },
      { name: "Alnitak", ra: 5.679, dec: -1.94, mag: 1.8 },
      { name: "Alnilam", ra: 5.604, dec: -1.2, mag: 1.7 },
      { name: "Mintaka", ra: 5.533, dec: -0.3, mag: 2.2 },
      { name: "Saiph", ra: 5.796, dec: -9.67, mag: 2.1 },
      { name: "Rigel", ra: 5.242, dec: -8.2, mag: 0.1 },
      { name: "Meissa", ra: 5.585, dec: 9.93, mag: 3.4 },
    ],
    lines: [
      [0, 2],
      [1, 4],
      [2, 3],
      [3, 4],
      [2, 5],
      [4, 6],
      [0, 7],
      [1, 7],
    ],
  },
  {
    id: "uma",
    name: "Ursa Major",
    stars: [
      { name: "Dubhe", ra: 11.062, dec: 61.75, mag: 1.8 },
      { name: "Merak", ra: 11.031, dec: 56.38, mag: 2.4 },
      { name: "Phecda", ra: 11.897, dec: 53.69, mag: 2.4 },
      { name: "Megrez", ra: 12.257, dec: 57.03, mag: 3.3 },
      { name: "Alioth", ra: 12.9, dec: 55.96, mag: 1.8 },
      { name: "Mizar", ra: 13.399, dec: 54.93, mag: 2.2 },
      { name: "Alkaid", ra: 13.792, dec: 49.31, mag: 1.9 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [3, 4],
      [4, 5],
      [5, 6],
    ],
  },
  {
    id: "cas",
    name: "Cassiopeia",
    stars: [
      { name: "Caph", ra: 0.153, dec: 59.15, mag: 2.3 },
      { name: "Schedar", ra: 0.675, dec: 56.54, mag: 2.2 },
      { name: "Navi", ra: 0.945, dec: 60.72, mag: 2.4 },
      { name: "Ruchbah", ra: 1.43, dec: 60.24, mag: 2.7 },
      { name: "Segin", ra: 1.906, dec: 63.67, mag: 3.4 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
  },
  {
    id: "cyg",
    name: "Cygnus",
    stars: [
      { name: "Deneb", ra: 20.69, dec: 45.28, mag: 1.3 },
      { name: "Sadr", ra: 20.37, dec: 40.26, mag: 2.2 },
      { name: "Gienah", ra: 20.77, dec: 33.97, mag: 2.5 },
      { name: "Fawaris", ra: 19.75, dec: 45.13, mag: 2.9 },
      { name: "Albireo", ra: 19.512, dec: 27.96, mag: 3.1 },
    ],
    lines: [
      [0, 1],
      [1, 4],
      [3, 1],
      [1, 2],
    ],
  },
  {
    id: "sco",
    name: "Scorpius",
    stars: [
      { name: "Acrab", ra: 16.091, dec: -19.81, mag: 2.6 },
      { name: "Dschubba", ra: 16.006, dec: -22.62, mag: 2.3 },
      { name: "Fang", ra: 15.981, dec: -26.11, mag: 2.9 },
      { name: "Antares", ra: 16.49, dec: -26.43, mag: 1.0 },
      { name: "Paikauhale", ra: 16.598, dec: -28.22, mag: 2.8 },
      { name: "Larawag", ra: 16.836, dec: -34.29, mag: 2.3 },
      { ra: 16.864, dec: -38.05, mag: 3.0 },
      { ra: 16.91, dec: -42.36, mag: 3.6 },
      { ra: 17.203, dec: -43.24, mag: 3.3 },
      { name: "Sargas", ra: 17.622, dec: -43.0, mag: 1.9 },
      { ra: 17.793, dec: -40.13, mag: 3.0 },
      { ra: 17.708, dec: -39.03, mag: 2.4 },
      { name: "Shaula", ra: 17.56, dec: -37.1, mag: 1.6 },
      { name: "Lesath", ra: 17.513, dec: -37.3, mag: 2.7 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [1, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
      [9, 10],
      [10, 11],
      [11, 12],
      [12, 13],
    ],
  },
  {
    id: "cru",
    name: "Crux",
    stars: [
      { name: "Acrux", ra: 12.443, dec: -63.1, mag: 0.8 },
      { name: "Gacrux", ra: 12.519, dec: -57.11, mag: 1.6 },
      { name: "Mimosa", ra: 12.795, dec: -59.69, mag: 1.3 },
      { name: "Imai", ra: 12.252, dec: -58.75, mag: 2.8 },
    ],
    lines: [
      [0, 1],
      [2, 3],
    ],
  },
  {
    id: "leo",
    name: "Leo",
    stars: [
      { name: "Regulus", ra: 10.139, dec: 11.97, mag: 1.4 },
      { name: "Eta Leo", ra: 10.122, dec: 16.76, mag: 3.5 },
      { name: "Algieba", ra: 10.333, dec: 19.84, mag: 2.0 },
      { name: "Adhafera", ra: 10.278, dec: 23.42, mag: 3.4 },
      { name: "Rasalas", ra: 9.879, dec: 26.01, mag: 3.9 },
      { name: "Zosma", ra: 11.235, dec: 20.52, mag: 2.6 },
      { name: "Denebola", ra: 11.818, dec: 14.57, mag: 2.1 },
      { name: "Chertan", ra: 11.237, dec: 15.43, mag: 3.3 },
    ],
    lines: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [2, 5],
      [5, 6],
      [6, 7],
      [7, 0],
    ],
  },
];

const fmt = (v: string) => v;

export const DEEP_SKY: DeepSkyObject[] = [
  {
    id: "m42",
    name: "Orion Nebula",
    catalog: "M42 · NGC 1976",
    type: "Emission nebula",
    ra: 5.588,
    dec: -5.39,
    distance: "1,344 ly",
    magnitude: "4.0",
    size: 1.4,
    description:
      "The nearest region of massive star formation to Earth, sculpted by the intense ultraviolet light of the Trapezium cluster.",
    wavelengths: {
      visible: "Glowing hydrogen gas ionised by young O-type stars.",
      infrared: "Hundreds of embedded protostars and proplyds hidden behind dust become visible.",
      radio: "Molecular clouds rich in CO and water masers trace the stellar nursery.",
    },
  },
  {
    id: "m31",
    name: "Andromeda Galaxy",
    catalog: "M31 · NGC 224",
    type: "Spiral galaxy",
    ra: 0.712,
    dec: 41.27,
    distance: "2.54 million ly",
    magnitude: "3.4",
    size: 1.8,
    description:
      "The nearest large galaxy to the Milky Way, home to roughly one trillion stars and on a collision course with us in ~4.5 billion years.",
    wavelengths: {
      visible: "Integrated starlight of an old stellar bulge and spiral disk.",
      infrared: "Warm dust rings reveal where new stars are forming across the disk.",
      radio: "Neutral hydrogen (21 cm) maps a warped disk far larger than the optical galaxy.",
    },
  },
  {
    id: "m45",
    name: "Pleiades",
    catalog: "M45",
    type: "Open star cluster",
    ra: 3.79,
    dec: 24.12,
    distance: "444 ly",
    magnitude: "1.6",
    size: 1.2,
    description:
      "A young cluster of hot blue stars drifting through an unrelated dust cloud that scatters their light into ghostly reflection nebulae.",
    wavelengths: {
      visible: "Blue reflection nebulosity around the brightest B-type stars.",
      infrared: "Cold dust grains glow as the cluster ploughs through the interstellar medium.",
      radio: "Faint; the cluster is mostly quiet at radio wavelengths.",
    },
  },
  {
    id: "m1",
    name: "Crab Nebula",
    catalog: "M1 · NGC 1952",
    type: "Supernova remnant",
    ra: 5.575,
    dec: 22.01,
    distance: "6,500 ly",
    magnitude: "8.4",
    size: 1,
    description:
      "The expanding debris of a supernova recorded by astronomers in 1054 CE, powered by a pulsar spinning 30 times per second.",
    wavelengths: {
      visible: "Filaments of ejected gas around a diffuse synchrotron glow.",
      infrared: "Dust formed in the explosion and synchrotron emission from the pulsar wind.",
      radio: "One of the brightest radio sources in the sky; the pulsar beams every 33 ms.",
    },
  },
  {
    id: "m16",
    name: "Eagle Nebula",
    catalog: "M16 · NGC 6611",
    type: "Star-forming region",
    ra: 18.313,
    dec: -13.78,
    distance: "5,700 ly",
    magnitude: "6.0",
    size: 1.2,
    description:
      "Home of the Pillars of Creation, columns of cold gas eroded by radiation from the young cluster NGC 6611.",
    wavelengths: {
      visible: "Dark dusty pillars silhouetted against glowing gas.",
      infrared: "The pillars turn translucent, exposing newborn stars and outflow jets.",
      radio: "Dense molecular gas inside the pillar tips.",
    },
  },
  {
    id: "m51",
    name: "Whirlpool Galaxy",
    catalog: "M51 · NGC 5194",
    type: "Interacting spiral",
    ra: 13.498,
    dec: 47.2,
    distance: "23 million ly",
    magnitude: "8.4",
    size: 1.1,
    description:
      "A grand-design spiral whose arms are being stirred by the gravitational pull of its small companion, NGC 5195.",
    wavelengths: {
      visible: "Crisp spiral arms dotted with pink HII regions.",
      infrared: "Dust lanes glow brightly along the arms, tracing star formation.",
      radio: "Polarised emission maps magnetic fields that follow the spiral pattern.",
    },
  },
  {
    id: "m57",
    name: "Ring Nebula",
    catalog: "M57 · NGC 6720",
    type: "Planetary nebula",
    ra: 18.893,
    dec: 33.03,
    distance: "2,570 ly",
    magnitude: "8.8",
    size: 0.9,
    description:
      "The glowing shell of gas shed by a dying Sun-like star, a preview of our own Sun's fate in about 5 billion years.",
    wavelengths: {
      visible: "A luminous ring of oxygen, hydrogen and nitrogen emission.",
      infrared: "Thousands of clumps of molecular hydrogen form the outer halo.",
      radio: "Weak free-free emission from the ionised shell.",
    },
  },
  {
    id: "m87",
    name: "Messier 87",
    catalog: "M87 · Virgo A",
    type: "Giant elliptical",
    ra: 12.514,
    dec: 12.39,
    distance: "53 million ly",
    magnitude: "8.6",
    size: 1.1,
    description:
      "A supergiant elliptical galaxy whose central black hole was the first ever imaged by the Event Horizon Telescope in 2019.",
    wavelengths: {
      visible: "A smooth ball of old stars with a faint relativistic jet.",
      infrared: "The jet and nucleus shine; little star formation remains.",
      radio: "A 6.5-billion-solar-mass black hole shadow resolved at 1.3 mm.",
    },
  },
  {
    id: "sgra",
    name: "Sagittarius A*",
    catalog: "Sgr A*",
    type: "Supermassive black hole",
    ra: 17.761,
    dec: -29.01,
    distance: "26,700 ly",
    magnitude: "—",
    size: 1.3,
    description:
      "The 4-million-solar-mass black hole at the heart of the Milky Way, imaged by the Event Horizon Telescope in 2022.",
    wavelengths: {
      visible: "Hidden behind ~30 magnitudes of dust extinction.",
      infrared: "Stars orbiting the black hole at thousands of km/s are tracked in the near-IR.",
      radio: "A compact, flickering radio source surrounded by a glowing ring.",
    },
  },
  {
    id: "lmc",
    name: "Large Magellanic Cloud",
    catalog: "LMC",
    type: "Satellite galaxy",
    ra: 5.392,
    dec: -69.75,
    distance: "163,000 ly",
    magnitude: "0.9",
    size: 1.7,
    description:
      "A dwarf satellite of the Milky Way containing the Tarantula Nebula, the most active starburst region in the Local Group.",
    wavelengths: {
      visible: "A bright irregular smudge visible to the naked eye from the south.",
      infrared: "Cool dust and the Tarantula's young super star clusters.",
      radio: "Hydrogen gas streams linking it to the Small Magellanic Cloud.",
    },
  },
  {
    id: "car",
    name: "Carina Nebula",
    catalog: "NGC 3372",
    type: "Emission nebula",
    ra: 10.75,
    dec: -59.87,
    distance: "8,500 ly",
    magnitude: "1.0",
    size: 1.4,
    description:
      "One of the largest nebulae in the sky, hosting Eta Carinae, an unstable hypergiant that may soon explode.",
    wavelengths: {
      visible: "Towering cliffs of gas lit by massive star clusters.",
      infrared: "JWST's 'Cosmic Cliffs' reveal hundreds of previously hidden stars.",
      radio: "Ionised gas and colliding stellar winds.",
    },
  },
  {
    id: "m104",
    name: "Sombrero Galaxy",
    catalog: "M104 · NGC 4594",
    type: "Spiral galaxy",
    ra: 12.666,
    dec: -11.62,
    distance: "31 million ly",
    magnitude: "8.0",
    size: 1,
    description:
      "An edge-on galaxy with a brilliant bulge and a prominent dust lane, giving it the look of a wide-brimmed hat.",
    wavelengths: {
      visible: "A bright bulge bisected by a dark dust lane.",
      infrared: "The dust ring glows as a smooth, clumpy halo.",
      radio: "A compact active nucleus at the core.",
    },
  },
  {
    id: "m13",
    name: "Hercules Cluster",
    catalog: "M13 · NGC 6205",
    type: "Globular cluster",
    ra: 16.695,
    dec: 36.46,
    distance: "22,200 ly",
    magnitude: "5.8",
    size: 1,
    description:
      "A dense ball of around 300,000 ancient stars, and the target of the 1974 Arecibo message.",
    wavelengths: {
      visible: "A sparkling sphere of old yellow and red giants.",
      infrared: "Evolved red giants dominate the infrared light.",
      radio: "Millisecond pulsars hide in the crowded core.",
    },
  },
].map((o) => ({ ...o, distance: fmt(o.distance) }));

// --- Coordinate helpers ---------------------------------------------------

const DEG = Math.PI / 180;
const RA_NGP = 192.85948 * DEG;
const DEC_NGP = 27.12825 * DEG;
const L_NCP = 122.93192 * DEG;

/** Convert galactic (l, b) in degrees to equatorial RA (hours) / Dec (degrees). */
export function galacticToEquatorial(l: number, b: number): { ra: number; dec: number } {
  const lr = l * DEG;
  const br = b * DEG;
  const sinDec =
    Math.sin(DEC_NGP) * Math.sin(br) + Math.cos(DEC_NGP) * Math.cos(br) * Math.cos(L_NCP - lr);
  const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));
  const y = Math.cos(br) * Math.sin(L_NCP - lr);
  const x =
    Math.cos(DEC_NGP) * Math.sin(br) - Math.sin(DEC_NGP) * Math.cos(br) * Math.cos(L_NCP - lr);
  let ra = RA_NGP + Math.atan2(y, x);
  ra = ((ra % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  return { ra: ra / DEG / 15, dec: dec / DEG };
}

export function formatRA(ra: number): string {
  const h = Math.floor(ra);
  const m = Math.floor((ra - h) * 60);
  const s = Math.round(((ra - h) * 60 - m) * 60);
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s % 60).padStart(2, "0")}s`;
}

export function formatDec(dec: number): string {
  const sign = dec < 0 ? "−" : "+";
  const a = Math.abs(dec);
  const d = Math.floor(a);
  const m = Math.floor((a - d) * 60);
  return `${sign}${String(d).padStart(2, "0")}° ${String(m).padStart(2, "0")}′`;
}

/** Deterministic PRNG so the star field is identical on server and client. */
export function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FieldStar {
  ra: number;
  dec: number;
  mag: number; // 0 bright … 1 faint
  temp: number; // 0 cool/red … 1 hot/blue
  phase: number;
  galactic: number; // 0..1 how close to the galactic plane
}

export function generateStarField(count: number, seed = 7): FieldStar[] {
  const rnd = mulberry32(seed);
  const stars: FieldStar[] = [];
  for (let i = 0; i < count; i++) {
    let ra: number;
    let dec: number;
    let galactic = 0;
    if (rnd() < 0.55) {
      // Concentrated toward the galactic plane
      const l = rnd() * 360;
      const g = (rnd() + rnd() + rnd() - 1.5) * 9;
      const eq = galacticToEquatorial(l, g);
      ra = eq.ra;
      dec = eq.dec;
      galactic = 1 - Math.min(1, Math.abs(g) / 12);
    } else {
      ra = rnd() * 24;
      dec = (Math.asin(2 * rnd() - 1) * 180) / Math.PI;
    }
    stars.push({
      ra,
      dec,
      mag: Math.pow(rnd(), 0.45),
      temp: rnd(),
      phase: rnd() * Math.PI * 2,
      galactic,
    });
  }
  return stars;
}

/** Physical star colours by temperature (cool → hot) for each observing band. */
export const STAR_PALETTE: Record<Wavelength, string[]> = {
  visible: [
    "oklch(0.8 0.1 50)",
    "oklch(0.88 0.08 75)",
    "oklch(0.96 0.02 90)",
    "oklch(0.93 0.03 250)",
    "oklch(0.85 0.08 245)",
  ],
  infrared: [
    "oklch(0.82 0.15 60)",
    "oklch(0.74 0.17 50)",
    "oklch(0.68 0.19 38)",
    "oklch(0.9 0.08 80)",
    "oklch(0.95 0.04 90)",
  ],
  radio: [
    "oklch(0.7 0.15 295)",
    "oklch(0.75 0.12 260)",
    "oklch(0.8 0.12 220)",
    "oklch(0.84 0.14 200)",
    "oklch(0.7 0.18 300)",
  ],
};
