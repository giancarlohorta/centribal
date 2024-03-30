import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Button, Grid, Container } from "@mui/material";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";
import useArticleManagement from "../../hooks/useArticleManagement";
import { ArticleContainer, FormContainer } from "./ArticleDetailsStyles";

const ArticleDetails = () => {
  const { id } = useParams();
  const {
    article,
    loading,
    done,
    error,
    snackbarStatus,
    updateArticle,
    fetchArticle,
    onSnackBarClose,
  } = useArticleManagement();

  const [editedArticle, setEditedArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const articleChanged =
    JSON.stringify(editedArticle) !== JSON.stringify(originalArticle);

  const handleEditArticle = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    const parsedData = parseFunctions.parsedValue(editedArticle);
    await updateArticle(parsedData, id);
  };

  const handleCancelEdit = () => {
    setEditedArticle(originalArticle);
    setIsEditing(false);
  };

  const handleRetry = async () => {
    await fetchArticle(id);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedArticle({
      ...editedArticle,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchArticle(id);
  }, [id]);

  useEffect(() => {
    if (article) {
      setEditedArticle(article);
      setOriginalArticle(article);
      setIsEditing(false);
    }
  }, [article]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <Typography variant="h2">Detalhes do Artigo</Typography>
      {error && (
        <ErrorMessage
          message="Error en la búsqueda del artículo. Por favor, inténtelo de nuevo."
          onRetray={handleRetry}
        />
      )}
      {done && (
        <Grid container spacing={2}>
          {isEditing ? (
            <>
              <FormContainer elevation={4}>
                <ArticleForm
                  editedArticle={editedArticle}
                  onInputChange={handleChange}
                />
              </FormContainer>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSaveChanges}
                  disabled={!articleChanged}
                  sx={{ marginRight: 2 }}
                >
                  Salvar
                </Button>
                <Button variant="contained" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <ArticleContainer elevation={4}>
                <Grid item xs={12}>
                  <Typography>Referencia: {article.ref}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Nombre: {article.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Descripción: {article.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>
                    Precio sin impuestos:
                    {parseFunctions.formatedCurrency(article.price)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Impuesto aplicable: {article.tax}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography>Cantidad: {article.quantity}</Typography>
                </Grid>
              </ArticleContainer>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleEditArticle}
                  sx={{ marginRight: 2 }}
                >
                  Editar
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
            </>
          )}
          <SnackbarNotification
            data={snackbarStatus}
            onClose={onSnackBarClose}
            onRetry={handleSaveChanges}
          />
        </Grid>
      )}
    </Container>
  );
};

export default ArticleDetails;
