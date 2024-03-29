import { useState } from "react";
import axios from "axios";
import constants from "../constants/constants";
import { useNavigate } from "react-router-dom";

const { FETCH_STATUS, SNACKBAR_INITIAL } = constants;

const useFetchArticle = () => {
  const navigate = useNavigate();
  const [article, setArticle] = useState({});
  const [articles, setArticles] = useState({});
  const [snackbarStatus, setSnackbarStatus] = useState(SNACKBAR_INITIAL);
  const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.INITIAL);

  const fetchArticle = async (id) => {
    try {
      setFetchStatus(FETCH_STATUS.LOADING);
      const response = await axios.get(`http://localhost:3000/articles/${id}`);
      const data = response.data;
      setArticle(data);
      setFetchStatus(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching article details:", error);
      setFetchStatus(FETCH_STATUS.ERROR);
    }
  };

  const fetchArticles = async () => {
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

  const updateArticle = async (updatedArticle, id) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/articles/${id}`,
        updatedArticle
      );
      const data = response.data;
      setArticle(data);
      setSnackbarStatus({
        open: true,
        message: "cambio guardado correctamente",
        state: "success",
      });
      return true;
    } catch (error) {
      console.error("Error updating article:", error);
      setSnackbarStatus({
        open: true,
        message: "error al guardar los cambios, inténtelo de nuevo",
        state: "error",
      });
      return false;
    }
  };

  const deleteArticle = async (articleId) => {
    try {
      await axios.delete(`http://localhost:3000/articles/${articleId}`);
      const updatedArticles = articles.filter(
        (article) => article.id !== articleId
      );
      setArticles(updatedArticles);
      setSnackbarStatus({
        open: true,
        articleId: "",
        message: "borrado correctamente el artículo",
        state: "success",
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      setSnackbarStatus({
        open: true,
        articleId,
        message: "error al borrar el artículo, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  const createArticle = async (newArticle) => {
    try {
      await axios.post("http://localhost:3000/articles", newArticle);
      navigate("/articulos");
    } catch (error) {
      console.error("Erro ao criar um novo artigo:", error);
      setSnackbarStatus({
        open: true,
        message: "error al crear el articulo, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  const onSnackBarClose = () => {
    setSnackbarStatus(SNACKBAR_INITIAL);
  };

  const loading = fetchStatus === FETCH_STATUS.LOADING;
  const done = fetchStatus === FETCH_STATUS.DONE;
  const error = fetchStatus === FETCH_STATUS.ERROR;

  return {
    articles,
    article,
    loading,
    done,
    error,
    snackbarStatus,
    onSnackBarClose,
    fetchArticle,
    updateArticle,
    deleteArticle,
    createArticle,
    fetchArticles,
  };
};

export default useFetchArticle;
