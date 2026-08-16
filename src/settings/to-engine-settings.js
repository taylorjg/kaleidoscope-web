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
    generated: {
      motion: s.motion,
      rotation: s.rotation,
      detail: s.detail,
      seed: s.seed,
    },
    showControls: s.controls,
    requestFullscreen: s.fullscreen,
  };
};
