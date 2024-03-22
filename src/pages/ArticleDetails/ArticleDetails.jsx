import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedArticle, setEditedArticle] = useState(null);
  const [originalArticle, setOriginalArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/articles/${id}`
        );
        const data = response.data;
        setArticle(data);
        setEditedArticle(data);
        setOriginalArticle(data);
      } catch (error) {
        console.error("Erro ao buscar os detalhes do artigo:", error);
      }
    };

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
    } catch (error) {
      console.error("Erro ao salvar os detalhes do artigo:", error);
    }
  };

  const handleCancelButtonClick = () => {
    setEditedArticle(originalArticle);
    setIsEditing(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedArticle({
      ...editedArticle,
      [name]: value,
    });
  };

  if (!article) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Detalhes do Artigo</Typography>
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
      </Grid>
    </div>
  );
};

export default ArticleDetails;
