import { Alert, Button, Snackbar } from "@mui/material";
import PropTypes from "prop-types";

const SnackbarNotification = ({ data, onClose, onRetry }) => {
  return (
    <Snackbar open={data.open} autoHideDuration={3000} onClose={onClose}>
      <Alert
        onClose={onClose}
        severity={data.state}
        variant="filled"
        sx={{ width: "100%" }}
        action={
          data.state === "error" && (
            <Button color="inherit" size="small" onClick={() => onRetry()}>
              Retry
            </Button>
          )
        }
      >
        {data.message}
      </Alert>
    </Snackbar>
  );
};

SnackbarNotification.propTypes = {
  data: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    state: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default SnackbarNotification;
