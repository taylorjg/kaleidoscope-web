import PropTypes from "prop-types";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export const PermissionPrompt = ({ status, onRetry, onSwitchGenerative }) => {
  if (
    status?.type !== "camera-denied" &&
    status?.type !== "camera-unavailable"
  ) {
    return null;
  }

  const message =
    status.type === "camera-unavailable"
      ? "Camera access is not available in this browser."
      : "Camera permission was denied. Allow camera access or switch to generative mode.";

  return (
    <Alert
      severity="warning"
      sx={{ mb: 2 }}
      action={
        <Stack direction="row" spacing={1}>
          {status.type === "camera-denied" && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
          <Button color="inherit" size="small" onClick={onSwitchGenerative}>
            Generative
          </Button>
        </Stack>
      }
    >
      {message}
    </Alert>
  );
};

PermissionPrompt.propTypes = {
  status: PropTypes.shape({ type: PropTypes.string }),
  onRetry: PropTypes.func.isRequired,
  onSwitchGenerative: PropTypes.func.isRequired,
};
