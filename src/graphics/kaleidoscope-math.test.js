import { describe, it, expect } from "vitest";
import { foldAngle, foldUv } from "@app/graphics/kaleidoscope-math.js";

describe("foldAngle", () => {
  it("folds full circle into one segment", () => {
    const folded = foldAngle(Math.PI, 6, true);
    expect(folded).toBeGreaterThanOrEqual(0);
    expect(folded).toBeLessThanOrEqual((Math.PI * 2) / 6);
  });

  it("mirror folds symmetrically", () => {
    const a = foldAngle(0.1, 8, true);
    const b = foldAngle((Math.PI * 2) / 8 - 0.1, 8, true);
    expect(Math.abs(a - b)).toBeLessThan(0.001);
  });
});

describe("foldUv", () => {
  it("preserves radius from centre", () => {
    const { r } = foldUv(0.7, 0.5, 6, true);
    expect(r).toBeCloseTo(0.2, 5);
  });

  it("maps centre to centre", () => {
    const { x, y } = foldUv(0.5, 0.5, 6, true);
    expect(x).toBeCloseTo(0.5, 5);
    expect(y).toBeCloseTo(0.5, 5);
  });
});
