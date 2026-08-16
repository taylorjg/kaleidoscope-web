import { useCallback, useEffect, useRef, useState } from "react";
import Typography from "@mui/material/Typography";

import { useKaleidoscopeSettings } from "@app/hooks/use-kaleidoscope-settings.js";
import { GraphicsCanvas } from "@app/components/graphics-canvas.jsx";
import { ControlPanel } from "@app/components/control-panel.jsx";
import { StyledAppShell } from "@app/app.styles.jsx";

const downloadDataUrl = (dataUrl, filename) => {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
};

export const App = () => {
  const { settings, params, setImmediate, setSlider } =
    useKaleidoscopeSettings();
  const [status, setStatus] = useState({ type: "idle" });
  const [collapsed, setCollapsed] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const canvasRef = useRef(null);
  const fullscreenRequested = useRef(false);

  useEffect(() => {
    if (!settings.requestFullscreen || fullscreenRequested.current) return;
    fullscreenRequested.current = true;
    document.documentElement.requestFullscreen?.().catch(() => {});
  }, [settings.requestFullscreen]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const handleStatus = useCallback((next) => {
    setStatus(next);
    if (next.type === "camera-ready") setCameraActive(true);
    if (next.type === "camera-stopped" || next.type === "camera-denied") {
      setCameraActive(false);
    }
  }, []);

  const handleSnapshot = useCallback(() => {
    const dataUrl = canvasRef.current?.snapshot?.();
    if (dataUrl) {
      downloadDataUrl(dataUrl, `kaleidoscope-${Date.now()}.png`);
    }
  }, []);

  const handleReseed = useCallback(() => {
    const seed = canvasRef.current?.reseed?.();
    if (seed != null) {
      setImmediate({ seed });
    }
  }, [setImmediate]);

  const handleToggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen?.();
    } else {
      await document.documentElement.requestFullscreen?.();
    }
  }, []);

  return (
    <StyledAppShell>
      <GraphicsCanvas
        ref={canvasRef}
        settings={settings}
        onStatus={handleStatus}
        onTap={settings.mode === "generative" ? handleReseed : undefined}
      />

      {settings.showControls && (
        <ControlPanel
          settings={settings}
          params={params}
          setImmediate={setImmediate}
          setSlider={setSlider}
          status={status}
          onSnapshot={handleSnapshot}
          onReseed={handleReseed}
          collapsed={collapsed}
          onToggleCollapsed={() => setCollapsed((c) => !c)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          cameraActive={cameraActive && settings.mode === "camera"}
        />
      )}

      <Typography
        variant="caption"
        component="p"
        sx={{
          position: "fixed",
          bottom: 8,
          left: 8,
          zIndex: 1,
          opacity: 0.5,
          pointerEvents: "none",
        }}
      >
        Kaleidoscope
      </Typography>
    </StyledAppShell>
  );
};
