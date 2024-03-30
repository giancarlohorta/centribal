import { useState } from "react";
import { Typography, Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";
import SnackbarNotification from "../../components/SnackbarNotification";

import useArticleManagement from "../../hooks/useArticleManagement";
import { Container, FormContainer } from "./NewArticleStyles";

const NewArticlePage = () => {
  const { snackbarStatus, createArticle, onSnackBarClose } =
    useArticleManagement();
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    description: "",
    price: 0,
    tax: 0,
    quantity: 0,
  });

  const isDisabled = !formData.ref || !formData.name;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedData = parseFunctions.parsedValue(formData);

    await createArticle(parsedData);
  };

  return (
    <Container>
      <Typography variant="h2">Crear Nuevo Artículo</Typography>
      <FormContainer elevation={4}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <ArticleForm
              editedArticle={formData}
              onInputChange={handleChange}
            />
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ marginRight: 2 }}
                disabled={isDisabled}
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
      </FormContainer>

      <SnackbarNotification
        data={snackbarStatus}
        onClose={onSnackBarClose}
        onRetry={handleSubmit}
      />
    </Container>
  );
};

export default NewArticlePage;
