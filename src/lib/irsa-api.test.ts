import { describe, it, expect } from "vitest";
import { PRESET_TARGETS, queryMostByOrbit, type PlanetXOrbitParams } from "./irsa-api";

describe("IRSA & SPHEREx API Integration", () => {
  it("provides valid citizen science presets with multi-epoch scans", () => {
    expect(PRESET_TARGETS.length).toBeGreaterThanOrEqual(3);

    for (const preset of PRESET_TARGETS) {
      expect(preset.id).toBeTruthy();
      expect(preset.name).toBeTruthy();
      expect(preset.observations.length).toBeGreaterThanOrEqual(2);
      expect(preset.difficulty).toBeDefined();
      expect(preset.story).toBeDefined();
      expect(preset.whatToLookFor).toBeDefined();

      const [obsA, obsB] = preset.observations;
      expect(obsA?.ra).toBeTypeOf("number");
      expect(obsA?.dec).toBeTypeOf("number");
      expect(obsA?.cutoutUrl).toContain("irsa.ipac.caltech.edu/ibe");
      expect(obsB?.previewUrl).toContain("skyview.gsfc.nasa.gov");
    }
  });

  it("simulates Keplerian Planet X orbit intersections", async () => {
    const params: PlanetXOrbitParams = {
      name: "Planet_9_Test",
      semimajorAxis: 420,
      eccentricity: 0.55,
      inclination: 18,
    };

    const observations = await queryMostByOrbit(params);
    expect(observations.length).toBeGreaterThanOrEqual(2);
    expect(observations[0]?.obsDate).toBeDefined();
    expect(observations[1]?.obsDate).toBeDefined();
    expect(observations[0]?.cutoutUrl).toContain("irsa.ipac.caltech.edu");
  }, 10000);
});
