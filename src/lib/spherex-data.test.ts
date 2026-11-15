import { describe, expect, it } from "vitest";
import {
  SPHEREX_BANDS,
  TOTAL_NOMINAL_CHANNELS,
  buildCutoutUrl,
  generateAstroquerySnippet,
  generateSyntheticSpherexSpectrum,
} from "./spherex-data";

describe("SPHEREx Data Module", () => {
  it("defines all 6 spectral bands correctly covering 0.75 to 5.0 microns", () => {
    expect(SPHEREX_BANDS).toHaveLength(6);
    expect(SPHEREX_BANDS[0]?.minWavelength).toBe(0.75);
    expect(SPHEREX_BANDS[5]?.maxWavelength).toBe(5.0);

    const totalChannels = SPHEREX_BANDS.reduce((acc, b) => acc + b.channelCount, 0);
    expect(totalChannels).toBe(TOTAL_NOMINAL_CHANNELS);
    expect(totalChannels).toBe(102);
  });

  it("generates 102 channels in synthetic spectrophotometry spectra", () => {
    const ysoSpectrum = generateSyntheticSpherexSpectrum("yso");
    expect(ysoSpectrum).toHaveLength(102);

    // Verify first and last wavelengths
    expect(ysoSpectrum[0]?.wavelength).toBeGreaterThanOrEqual(0.75);
    expect(ysoSpectrum[101]?.wavelength).toBeLessThanOrEqual(5.0);

    // Verify presence of water ice absorption at 3.05 microns
    const icePoint = ysoSpectrum.find((p) => Math.abs(p.wavelength - 3.05) < 0.05);
    expect(icePoint).toBeDefined();
    expect(icePoint?.absorptionFeature).toContain("H2O");
  });

  it("builds valid cutout URLs with center and size parameters", () => {
    const url = buildCutoutUrl({
      ra: 156.093282,
      dec: -41.644663,
      sizeDeg: 0.1,
      release: "dr1",
    });

    expect(url).toContain("https://irsa.ipac.caltech.edu/ibe/data/spherex/dr1/level2/");
    expect(url).toContain("center=156.093282,-41.644663");
    expect(url).toContain("size=0.1000");
  });

  it("generates correct Astroquery python snippet", () => {
    const code = generateAstroquerySnippet(83.822, -5.391, 3.5);
    expect(code).toContain("from astroquery.ipac.irsa import Irsa");
    expect(code).toContain("ra=83.8220*u.deg");
    expect(code).toContain("dec=-5.3910*u.deg");
    expect(code).toContain("radius=3.5*u.arcmin");
  });
});
