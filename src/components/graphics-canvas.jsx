import { forwardRef, useCallback, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useGraphicsEngine } from "@app/hooks/use-graphics-engine.js";

export const GraphicsCanvas = forwardRef(function GraphicsCanvas(
  { settings, onStatus, onTap },
  ref
) {
  const { containerRef, snapshot, reseed } = useGraphicsEngine({
    settings,
    onStatus,
  });

  useImperativeHandle(ref, () => ({ snapshot, reseed }), [snapshot, reseed]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!onTap) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onTap();
      }
    },
    [onTap]
  );

  const interactive = Boolean(onTap);

  return (
    <Box
      ref={containerRef}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? "New pattern" : undefined}
      aria-hidden={interactive ? undefined : "true"}
      onClick={onTap}
      onKeyDown={handleKeyDown}
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        bgcolor: "#0a0a0a",
        cursor: interactive ? "pointer" : undefined,
      }}
    />
  );
});

GraphicsCanvas.propTypes = {
  settings: PropTypes.object.isRequired,
  onStatus: PropTypes.func,
  onTap: PropTypes.func,
};
