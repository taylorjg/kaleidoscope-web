import { useCallback } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Collapse,
  FormControlLabel,
  IconButton,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

import { ModeToggle } from "./mode-toggle.jsx";
import { PermissionPrompt } from "./permission-prompt.jsx";

const SliderRow = ({ label, value, onChange, min = 0, max = 100 }) => (
  <Box sx={{ px: 0.5 }}>
    <Typography variant="caption" color="text.secondary">
      {label}: {value}
    </Typography>
    <Slider
      size="small"
      value={value}
      min={min}
      max={max}
      onChange={(_e, v) => onChange(v)}
      aria-label={label}
    />
  </Box>
);

SliderRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

export const ControlPanel = ({
  settings,
  params,
  setImmediate,
  setSlider,
  status,
  onSnapshot,
  onReseed,
  collapsed,
  onToggleCollapsed,
  isFullscreen,
  onToggleFullscreen,
  cameraActive,
}) => {
  const isAmbient = settings.mode === "ambient";

  const handleModeChange = useCallback(
    (mode) => setImmediate({ mode }),
    [setImmediate]
  );

  return (
    <Box
      component="aside"
      aria-label="Kaleidoscope controls"
      sx={{
        position: "fixed",
        top: { xs: 8, sm: 16 },
        right: { xs: 8, sm: 16 },
        zIndex: 2,
        width: { xs: "min(100% - 16px, 320px)", sm: 300 },
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {cameraActive && (
        <Stack
          direction="row"
          spacing={0.5}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ pb: 0.5 }}
        >
          <CameraAltIcon fontSize="small" color="error" aria-hidden />
          <Typography variant="caption">Camera active</Typography>
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={0.5}
        justifyContent="flex-end"
        sx={{ width: "100%" }}
      >
        <IconButton
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-pressed={isFullscreen}
          size="small"
          sx={{ bgcolor: "rgba(0,0,0,0.6)" }}
        >
          {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
        <IconButton
          onClick={onToggleCollapsed}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Show controls" : "Hide controls"}
          size="small"
          sx={{ bgcolor: "rgba(0,0,0,0.6)" }}
        >
          <TuneIcon />
        </IconButton>
      </Stack>

      <Collapse in={!collapsed}>
        <Box
          sx={{
            mt: 1.5,
            p: 2,
            borderRadius: 2,
            bgcolor: "rgba(0,0,0,0.72)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Stack spacing={2}>
            <PermissionPrompt
              status={status}
              onRetry={() => setImmediate({ mode: "camera" })}
              onSwitchAmbient={() => setImmediate({ mode: "ambient" })}
            />

            <ModeToggle mode={settings.mode} onChange={handleModeChange} />

            <SliderRow
              label="Segments"
              value={params.segments}
              min={3}
              max={12}
              onChange={(v) => setImmediate({ segments: v })}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={params.mirror}
                  onChange={(e) => setImmediate({ mirror: e.target.checked })}
                  inputProps={{ "aria-label": "Mirror symmetry" }}
                />
              }
              label="Mirror"
            />

            <SliderRow
              label="Rotation"
              value={params.rotation}
              onChange={(v) => setSlider("rotation", v)}
            />

            {isAmbient && (
              <>
                <SliderRow
                  label="Flow"
                  value={params.flow}
                  onChange={(v) => setSlider("flow", v)}
                />
                <SliderRow
                  label="Colour shift"
                  value={params.colourShift}
                  onChange={(v) => setSlider("colourShift", v)}
                />
                <SliderRow
                  label="Complexity"
                  value={params.complexity}
                  onChange={(v) => setSlider("complexity", v)}
                />
                <SliderRow
                  label="Saturation"
                  value={params.saturation}
                  onChange={(v) => setSlider("saturation", v)}
                />
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AutoFixHighIcon />}
                  onClick={onReseed}
                  fullWidth
                >
                  New pattern
                </Button>
              </>
            )}

            <Button
              variant="contained"
              size="small"
              startIcon={<PhotoCameraIcon />}
              onClick={onSnapshot}
              fullWidth
            >
              Snapshot
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
};

ControlPanel.propTypes = {
  settings: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  setImmediate: PropTypes.func.isRequired,
  setSlider: PropTypes.func.isRequired,
  status: PropTypes.object,
  onSnapshot: PropTypes.func.isRequired,
  onReseed: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  onToggleCollapsed: PropTypes.func.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired,
  cameraActive: PropTypes.bool.isRequired,
};
