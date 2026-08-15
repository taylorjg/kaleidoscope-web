import {
  parseAsBoolean,
  parseAsInteger,
  parseAsStringEnum,
  createParser,
} from "nuqs";
import { DEFAULT_URL_SETTINGS, MODES } from "./defaults.js";

const clampParser = (min, max, fallback) =>
  createParser({
    parse: (value) => {
      const n = Number(value);
      if (Number.isNaN(n)) return fallback;
      return Math.min(max, Math.max(min, Math.round(n)));
    },
    serialize: (value) => String(value),
  }).withDefault(fallback);

export const kaleidoscopeParsers = {
  mode: parseAsStringEnum(MODES).withDefault(DEFAULT_URL_SETTINGS.mode),
  segments: clampParser(3, 12, DEFAULT_URL_SETTINGS.segments),
  mirror: parseAsBoolean.withDefault(DEFAULT_URL_SETTINGS.mirror),
  rotation: clampParser(0, 100, DEFAULT_URL_SETTINGS.rotation),
  flow: clampParser(0, 100, DEFAULT_URL_SETTINGS.flow),
  colourShift: clampParser(0, 100, DEFAULT_URL_SETTINGS.colourShift),
  complexity: clampParser(0, 100, DEFAULT_URL_SETTINGS.complexity),
  saturation: clampParser(0, 100, DEFAULT_URL_SETTINGS.saturation),
  seed: parseAsInteger,
  controls: parseAsBoolean.withDefault(DEFAULT_URL_SETTINGS.controls),
  fullscreen: parseAsBoolean.withDefault(DEFAULT_URL_SETTINGS.fullscreen),
};
