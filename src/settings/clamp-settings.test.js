import { describe, it, expect } from "vitest";
import { clampSettings } from "@app/settings/clamp-settings.js";
import { DEFAULT_URL_SETTINGS } from "@app/settings/defaults.js";

describe("clampSettings", () => {
  it("returns defaults for empty input", () => {
    const result = clampSettings({});
    expect(result.mode).toBe(DEFAULT_URL_SETTINGS.mode);
    expect(result.segments).toBe(DEFAULT_URL_SETTINGS.segments);
  });

  it("clamps segments to 3–12", () => {
    expect(clampSettings({ segments: 1 }).segments).toBe(3);
    expect(clampSettings({ segments: 99 }).segments).toBe(12);
  });

  it("clamps sliders to 0–100", () => {
    expect(clampSettings({ motion: -5 }).motion).toBe(0);
    expect(clampSettings({ motion: 200 }).motion).toBe(100);
  });

  it("rejects invalid mode", () => {
    expect(clampSettings({ mode: "invalid" }).mode).toBe("generated");
  });

  it("parses controls boolean", () => {
    expect(clampSettings({ controls: false }).controls).toBe(false);
    expect(clampSettings({ controls: 0 }).controls).toBe(false);
  });
});
