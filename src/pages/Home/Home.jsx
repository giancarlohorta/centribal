import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Typography variant="h3" color="primary">
        Bem-vindo ao Material-UI com Vite!
      </Typography>
      <Button
        component={Link}
        to="/articulos"
        variant="contained"
        color="secondary"
      >
        Articulos
      </Button>
    </div>
  );
};

export default Home;
