import { Button, Typography } from "@mui/material";
import PropTypes from "prop-types";

const ErrorMessage = ({ message, onRetray }) => {
  return (
    <div>
      <Typography variant="body1" color="error">
        {message}
      </Typography>
      <Button variant="contained" color="primary" onClick={onRetray}>
        Inténtalo de nuevo
      </Button>
    </div>
  );
};

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetray: PropTypes.func.isRequired,
};

export default ErrorMessage;
