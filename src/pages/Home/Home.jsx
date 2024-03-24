import { Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Typography variant="h2" color="primary" textAlign="center">
          Centribal
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="80vh"
      >
        <Button
          component={Link}
          to="/articulos"
          variant="contained"
          color="secondary"
          sx={{ marginRight: 2 }}
        >
          Articulos
        </Button>
        <Button
          component={Link}
          to="/pedidos"
          variant="contained"
          color="secondary"
        >
          Pedidos
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
