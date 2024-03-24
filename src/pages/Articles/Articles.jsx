import { useEffect, useState } from "react";
import ArticlesList from "../../components/ArticlesList/ArticlesList";
import axios from "axios";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Articles = () => {
  const [articles, setArticles] = useState([]);

  const handleDeleteArticle = async (articleId) => {
    try {
      await axios.delete(`http://localhost:3000/articles/${articleId}`);
      const updatedArticles = articles.filter(
        (article) => article.id !== articleId
      );
      setArticles(updatedArticles);
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      <ArticlesList list={articles} onDelete={handleDeleteArticle} />
    </div>
  );
};

export default Articles;
