import { useEffect, useState } from "react";
import ArticlesList from "../../components/ArticlesList/ArticlesList";
import axios from "axios";
import { Alert, Button, Snackbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import constants from "../../constants/constants";

const { FETCH_STATUS } = constants;

const snackbarInitial = {
  open: false,
  message: "",
  articleId: "",
  state: "",
};

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.INITIAL);
  const [snackbar, setSnackbar] = useState(snackbarInitial);

  const error = fetchStatus === FETCH_STATUS.ERROR;
  const loading = fetchStatus === FETCH_STATUS.LOADING;
  const done = fetchStatus === FETCH_STATUS.DONE;

  const fetchData = async () => {
    try {
      setFetchStatus(FETCH_STATUS.LOADING);
      const response = await axios.get("http://localhost:3000/articles");
      setArticles(response.data);

      setFetchStatus(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching data:", error);
      setFetchStatus(FETCH_STATUS.ERROR);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    try {
      await axios.delete(`http://localhost:3000/articles/${articleId}`);
      const updatedArticles = articles.filter(
        (article) => article.id !== articleId
      );
      setArticles(updatedArticles);
      setSnackbar({
        open: true,
        articleId: "",
        message: "borrado correctamente el artículo",
        state: "success",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      setSnackbar({
        open: true,
        articleId,
        message: "error al borrar el artículo, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(snackbarInitial);
  };

  const handleRetry = () => {
    setFetchStatus(FETCH_STATUS.INITIAL);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Lista de Artículos</Typography>
      <Button
        component={Link}
        to="/nuevo-articulo"
        variant="contained"
        color="primary"
        sx={{ marginRight: 2 }}
      >
        Nuevo Artículo
      </Button>
      <Button component={Link} to={"/"} variant="contained" color="primary">
        Volver
      </Button>
      {error && (
        <div>
          <Typography variant="body1" color="error">
            Error en la búsqueda de artículos. Por favor, inténtelo de nuevo.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Inténtalo de nuevo
          </Button>
        </div>
      )}
      {done && (
        <>
          <ArticlesList list={articles} onDelete={handleDeleteArticle} />
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
                    onClick={() => handleDeleteArticle(snackbar.articleId)}
                  >
                    Retry
                  </Button>
                )
              }
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default Articles;
