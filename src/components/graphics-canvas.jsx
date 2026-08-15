import { forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { useGraphicsEngine } from "@app/hooks/use-graphics-engine.js";

export const GraphicsCanvas = forwardRef(function GraphicsCanvas(
  { settings, onStatus },
  ref
) {
  const { containerRef, snapshot, reseed } = useGraphicsEngine({
    settings,
    onStatus,
  });

  useImperativeHandle(ref, () => ({ snapshot, reseed }), [snapshot, reseed]);

  return (
    <Box
      ref={containerRef}
      aria-hidden="true"
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        bgcolor: "#0a0a0a",
      }}
    />
  );
});

GraphicsCanvas.propTypes = {
  settings: PropTypes.object.isRequired,
  onStatus: PropTypes.func,
};
