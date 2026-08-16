/** Default URL / engine settings (single source of truth for defaults). */
export const DEFAULT_URL_SETTINGS = {
  mode: "generated",
  segments: 8,
  mirror: true,
  rotation: 25,
  motion: 50,
  detail: 10,
  seed: Math.floor(Math.random() * 100000),
  controls: true,
  fullscreen: false,
};

export const SLIDER_DEBOUNCE_MS = 250;

export const MODES = ["camera", "generated"];

export const SLIDER_KEYS = ["rotation", "motion", "detail"];
