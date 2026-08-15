/** Default URL / engine settings (single source of truth for defaults). */
export const DEFAULT_URL_SETTINGS = {
  mode: "ambient",
  segments: 6,
  mirror: true,
  rotation: 30,
  flow: 30,
  colourShift: 40,
  complexity: 50,
  saturation: 70,
  seed: Math.floor(Math.random() * 100000),
  controls: true,
  fullscreen: false,
};

export const SLIDER_DEBOUNCE_MS = 250;

export const MODES = ["camera", "ambient"];

export const SLIDER_KEYS = [
  "rotation",
  "flow",
  "colourShift",
  "complexity",
  "saturation",
];
