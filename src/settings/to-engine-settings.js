import { clampSettings } from "./clamp-settings.js";

/**
 * Map flat URL settings to the engine's nested settings shape.
 * @param {import('./clamp-settings.js').clampSettings extends (r: infer R) => unknown ? ReturnType<typeof clampSettings> : never} params
 */
export const toEngineSettings = (params) => {
  const s = clampSettings(params);
  return {
    mode: s.mode,
    segments: s.segments,
    mirror: s.mirror,
    rotation: s.rotation,
    ambient: {
      flow: s.flow,
      rotation: s.rotation,
      colourShift: s.colourShift,
      complexity: s.complexity,
      saturation: s.saturation,
      seed: s.seed,
    },
    showControls: s.controls,
    requestFullscreen: s.fullscreen,
  };
};
