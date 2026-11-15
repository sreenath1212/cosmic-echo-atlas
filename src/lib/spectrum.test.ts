import { describe, expect, it } from "vitest";

import { bandForWavelength, positionToLogWavelength, wienPeak } from "./spectrum";

describe("spectrum physics", () => {
  it("places the Sun's peak (5,772 K) at ~502 nm in visible light", () => {
    const peak = wienPeak(5772);
    expect(peak * 1e9).toBeCloseTo(502, 0);
    expect(bandForWavelength(peak).id).toBe("visible");
  });

  it("places the cosmic microwave background (2.725 K) peak at ~1.06 mm in microwaves", () => {
    const peak = wienPeak(2.725);
    expect(peak * 1e3).toBeCloseTo(1.063, 2);
    expect(bandForWavelength(peak).id).toBe("microwave");
  });

  it("puts human body heat (310 K) in the infrared", () => {
    expect(bandForWavelength(wienPeak(310)).id).toBe("infrared");
  });

  it("maps the slider ends to radio and gamma rays", () => {
    expect(bandForWavelength(10 ** positionToLogWavelength(0.01)).id).toBe("radio");
    expect(bandForWavelength(10 ** positionToLogWavelength(0.99)).id).toBe("gamma");
  });
});
