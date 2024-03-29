import { useEffect } from "react";
import ArticlesList from "../../components/ArticlesList/ArticlesList";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";
import useArticleManagement from "../../hooks/useArticleManagement";

const Articles = () => {
  const {
    articles,
    loading,
    done,
    error,
    snackbarStatus,
    fetchArticles,
    deleteArticle,
    onSnackBarClose,
  } = useArticleManagement();

  const handleDeleteArticle = async (articleId) => {
    await deleteArticle(articleId);
  };

  const handleRetry = () => {
    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
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
        <ErrorMessage
          message="Error en la búsqueda de artículos. Por favor, inténtelo de nuevo."
          onRetray={handleRetry}
        />
      )}
      {done && (
        <>
          <ArticlesList list={articles} onDelete={handleDeleteArticle} />
          <SnackbarNotification
            data={snackbarStatus}
            onClose={onSnackBarClose}
            onRetry={() => handleDeleteArticle(snackbarStatus.articleId)}
          />
        </>
      )}
    </div>
  );
};

export default Articles;
