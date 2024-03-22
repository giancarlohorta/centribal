import { CircularProgress, Typography } from "@mui/material";

const LoadingPage = () => {
  return (
    <div>
      <Typography variant="h1">Carregando...</Typography>
      <CircularProgress />
    </div>
  );
};

export default LoadingPage;
