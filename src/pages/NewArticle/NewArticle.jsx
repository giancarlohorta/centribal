import { useState, useEffect } from "react";
import { Typography, Button, Grid, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";

const snackbarInitial = {
  open: false,
  message: "",
  state: "",
};

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
  const [snackbar, setSnackbar] = useState(snackbarInitial);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(snackbarInitial);
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
          <ArticleForm
            editedArticle={formData}
            onInputChange={handleInputChange}
          />
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.state}
          variant="filled"
          sx={{ width: "100%" }}
          action={
            snackbar.state === "error" && (
              <Button
                color="inherit"
                size="small"
                onClick={() => handleSaveButtonClick()}
              >
                Retry
              </Button>
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NewArticlePage;
