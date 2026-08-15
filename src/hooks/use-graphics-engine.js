import { useCallback, useEffect, useRef } from "react";
import { KaleidoscopeEngine } from "@app/graphics/kaleidoscope-engine.js";

/**
 * React bridge — owns engine mount/dispose and settings sync.
 * @param {{ settings: object, onStatus?: (status: object) => void }} options
 */
export function useGraphicsEngine({ settings, onStatus }) {
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const settingsRef = useRef(settings);
  const onStatusRef = useRef(onStatus);

  useEffect(() => {
    settingsRef.current = settings;
    engineRef.current?.setSettings(settings);
  }, [settings]);

  useEffect(() => {
    onStatusRef.current = onStatus;
  }, [onStatus]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = new KaleidoscopeEngine(container, {
      onStatus: (status) => onStatusRef.current?.(status),
    });
    engineRef.current = engine;
    engine.setSettings(settingsRef.current);

    return () => {
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const snapshot = useCallback(() => engineRef.current?.snapshot() ?? null, []);

  const reseed = useCallback(() => engineRef.current?.reseed() ?? null, []);

  return { containerRef, snapshot, reseed };
}
