import { useEffect } from "react";
import ArticlesList from "../../components/ArticlesList/ArticlesList";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";
import useArticleManagement from "../../hooks/useArticleManagement";
import {
  ArticlesContainer,
  ButtonsContainer,
  Container,
} from "./ArticlesStyles";

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
    <Container>
      <Typography variant="h2">Lista de Artículos</Typography>

      {error && (
        <ErrorMessage
          message="Error en la búsqueda de artículos. Por favor, inténtelo de nuevo."
          onRetray={handleRetry}
        />
      )}
      {done && (
        <ArticlesContainer elevation={4}>
          <ArticlesList list={articles} onDelete={handleDeleteArticle} />
          <SnackbarNotification
            data={snackbarStatus}
            onClose={onSnackBarClose}
            onRetry={() => handleDeleteArticle(snackbarStatus.articleId)}
          />
        </ArticlesContainer>
      )}
      <ButtonsContainer elevation={4}>
        <Button
          component={Link}
          to="/nuevo-articulo"
          variant="contained"
          color="primary"
        >
          Nuevo Artículo
        </Button>
        <Button component={Link} to={"/"} variant="contained" color="primary">
          Volver
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default Articles;
