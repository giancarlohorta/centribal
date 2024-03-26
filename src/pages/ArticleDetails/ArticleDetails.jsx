import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Button, Grid, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";
import constants from "../../constants/constants";

const { FETCH_STATUS } = constants;

const snackbarInitial = {
  open: false,
  message: "",
  state: "",
};

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);
  const [snackbar, setSnackbar] = useState(snackbarInitial);
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
  useEffect(() => {
    fetchArticle();
  }, [id]);

  const handleEditButtonClick = () => {
    setIsEditing(true);
  };

  const handleSaveButtonClick = async () => {
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
    setSnackbar(snackbarInitial);
  };

  const handleCancelButtonClick = () => {
    setEditedArticle(originalArticle);
    setIsEditing(false);
  };

  const handleRetry = () => {
    setFetchStatus(FETCH_STATUS.INITIAL);
    fetchArticle();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedArticle({
      ...editedArticle,
      [name]: value,
    });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Detalhes do Artigo</Typography>
      {error && (
        <div>
          <Typography variant="body1" color="error">
            Error en la búsqueda del artículo. Por favor, inténtelo de nuevo.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Inténtalo de nuevo
          </Button>
        </div>
      )}
      {done && (
        <Grid container spacing={2}>
          {isEditing ? (
            <>
              <ArticleForm
                editedArticle={editedArticle}
                onInputChange={handleInputChange}
              />
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSaveButtonClick}
                  sx={{ marginRight: 2 }}
                >
                  Salvar
                </Button>
                <Button variant="contained" onClick={handleCancelButtonClick}>
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
                  onClick={handleEditButtonClick}
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
        </Grid>
      )}
    </div>
  );
};

export default ArticleDetails;
