import { useMemo, useCallback } from "react";
import { useQueryStates, debounce } from "nuqs";
import { kaleidoscopeParsers } from "@app/settings/search-params.js";
import { toEngineSettings } from "@app/settings/to-engine-settings.js";
import { SLIDER_DEBOUNCE_MS, SLIDER_KEYS } from "@app/settings/defaults.js";

/**
 * URL-synced kaleidoscope settings (nuqs).
 * Chose nuqs over use-param-sync for per-control debounce and clearOnDefault.
 */
export function useKaleidoscopeSettings() {
  const [params, setParams] = useQueryStates(kaleidoscopeParsers);

  const settings = useMemo(() => toEngineSettings(params), [params]);

  const updateSettings = useCallback(
    (partial) => {
      setParams(partial);
    },
    [setParams]
  );

  const setSlider = useCallback(
    (key, value) => {
      setParams(
        { [key]: value },
        { limitUrlUpdates: debounce(SLIDER_DEBOUNCE_MS) }
      );
    },
    [setParams]
  );

  const setImmediate = useCallback(
    (partial) => {
      setParams(partial);
    },
    [setParams]
  );

  return {
    params,
    settings,
    updateSettings,
    setSlider,
    setImmediate,
    sliderKeys: SLIDER_KEYS,
  };
}
