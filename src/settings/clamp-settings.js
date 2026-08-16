import { DEFAULT_URL_SETTINGS, MODES } from "./defaults.js";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * Clamp and validate URL settings to safe ranges.
 * @param {Record<string, unknown>} raw
 * @returns {typeof DEFAULT_URL_SETTINGS}
 */
export const clampSettings = (raw) => {
  const s = { ...DEFAULT_URL_SETTINGS, ...raw };

  s.mode = MODES.includes(s.mode) ? s.mode : DEFAULT_URL_SETTINGS.mode;
  s.segments = clamp(
    Number(s.segments) || DEFAULT_URL_SETTINGS.segments,
    3,
    12
  );
  s.mirror = Boolean(s.mirror);
  s.rotation = clamp(
    Number(s.rotation) || DEFAULT_URL_SETTINGS.rotation,
    0,
    100
  );
  s.motion = clamp(Number(s.motion) || DEFAULT_URL_SETTINGS.motion, 0, 100);
  s.detail = clamp(Number(s.detail) || DEFAULT_URL_SETTINGS.detail, 0, 100);
  s.seed =
    s.seed == null || Number.isNaN(Number(s.seed))
      ? DEFAULT_URL_SETTINGS.seed
      : Math.floor(Number(s.seed));
  s.controls =
    s.controls !== false && s.controls !== "false" && s.controls !== 0;
  s.fullscreen =
    s.fullscreen === true || s.fullscreen === "true" || s.fullscreen === 1;

  return s;
};
