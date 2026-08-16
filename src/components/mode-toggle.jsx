import PropTypes from "prop-types";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export const ModeToggle = ({ mode, onChange }) => {
  const handleChange = (_event, value) => {
    if (value) onChange(value);
  };

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleChange}
      size="small"
      aria-label="Kaleidoscope mode"
      fullWidth
    >
      <ToggleButton value="generative" aria-label="Generative mode">
        Generative
      </ToggleButton>
      <ToggleButton value="camera" aria-label="Camera mode">
        Camera
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

ModeToggle.propTypes = {
  mode: PropTypes.oneOf(["camera", "generative"]).isRequired,
  onChange: PropTypes.func.isRequired,
};
