import { useState, useEffect } from "react";
import { Typography, Button, Grid } from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ArticleForm from "../../components/ArticleForm";
import parseFunctions from "../../utils/format";

const NewArticlePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ref: "",
    name: "",
    description: "",
    price: "",
    tax: "",
  });
  const [existingReferences, setExistingReferences] = useState([]);

  useEffect(() => {
    const fetchExistingReferences = async () => {
      try {
        const response = await axios.get("http://localhost:3000/articles");
        const references = response.data.map((article) => article.ref);
        setExistingReferences(references);
      } catch (error) {
        console.error("Error fetching existing references:", error);
      }
    };

    fetchExistingReferences();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { referencia } = formData;
    const parsedData = parseFunctions.parsedValue(formData);
    if (existingReferences.includes(referencia)) {
      alert("Esta referencia ya está en uso. Por favor, elija otra.");
      return;
    }
    try {
      await axios.post("http://localhost:3000/articles", parsedData);
      navigate("/articulos");
    } catch (error) {
      console.error("Erro ao criar um novo artigo:", error);
    }
  };

  return (
    <div>
      <Typography variant="h2">Crear Nuevo Artículo</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <ArticleForm
            editedArticle={formData}
            onInputChange={handleInputChange}
          />
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginRight: 2 }}
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
    </div>
  );
};

export default NewArticlePage;
