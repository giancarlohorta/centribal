import { useState } from "react";
import { Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";
import SnackbarNotification from "../../components/SnackbarNotification";
import constants from "../../constants/constants";

const { SNACKBAR_INITIAL } = constants;

const NewArticlePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    description: "",
    price: 0,
    tax: 0,
    quantity: 0,
  });
  const [snackbar, setSnackbar] = useState(SNACKBAR_INITIAL);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(SNACKBAR_INITIAL);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedData = parseFunctions.parsedValue(formData);

    try {
      await axios.post("http://localhost:3000/articles", parsedData);
      navigate("/articulos");
    } catch (error) {
      console.error("Erro ao criar um novo artigo:", error);
      setSnackbar({
        open: true,
        message: "error al crear el articulo, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  return (
    <div>
      <Typography variant="h2">Crear Nuevo Artículo</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <ArticleForm editedArticle={formData} onInputChange={handleChange} />
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
            >
              Crear Artículo
            </Button>
            <Button
              component={Link}
              to={"/articulos"}
              variant="contained"
              color="primary"
            >
              Volver
            </Button>
          </Grid>
        </Grid>
      </form>
      <SnackbarNotification
        data={snackbar}
        onClose={handleSnackbarClose}
        onRetry={handleSubmit}
      />
    </div>
  );
};

export default NewArticlePage;
