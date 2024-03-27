import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";
import constants from "../../constants/constants";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";

const { FETCH_STATUS, SNACKBAR_INITIAL } = constants;

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [editedArticle, setEditedArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState(SNACKBAR_INITIAL);
  const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.INITIAL);

  const error = fetchStatus === FETCH_STATUS.ERROR;
  const loading = fetchStatus === FETCH_STATUS.LOADING;
  const done = fetchStatus === FETCH_STATUS.DONE;

  const fetchArticle = async () => {
    try {
      setFetchStatus(FETCH_STATUS.LOADING);
      const response = await axios.get(`http://localhost:3000/articles/${id}`);
      const data = response.data;
      setArticle(data);
      setEditedArticle(data);
      setOriginalArticle(data);
      setFetchStatus(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Erro ao buscar os detalhes do artigo:", error);
      setFetchStatus(FETCH_STATUS.ERROR);
    }
  };

  const handleEditArticle = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    const parsedData = parseFunctions.parsedValue(editedArticle);
    try {
      await axios.put(`http://localhost:3000/articles/${id}`, parsedData);
      setArticle(editedArticle);
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: "cambio guardado correctamente",
        state: "success",
      });
    } catch (error) {
      console.error("Erro ao salvar os detalhes do artigo:", error);
      setSnackbar({
        open: true,
        message: "error al guardar los cambios, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(SNACKBAR_INITIAL);
  };

  const handleCancelEdit = () => {
    setEditedArticle(originalArticle);
    setIsEditing(false);
  };

  const handleRetry = () => {
    setFetchStatus(FETCH_STATUS.INITIAL);
    fetchArticle();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedArticle({
      ...editedArticle,
      [name]: value,
    });
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
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
              <ArticleForm
                editedArticle={editedArticle}
                onInputChange={handleChange}
              />
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSaveChanges}
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
            data={snackbar}
            onClose={handleSnackbarClose}
            onRetry={handleSaveChanges}
          />
        </Grid>
      )}
    </div>
  );
};

export default ArticleDetails;
