import { Grid, TextField } from "@mui/material";
import PropTypes from "prop-types";

const ArticleForm = ({ editedArticle, onInputChange }) => {
  return (
    <>
      <Grid item xs={12}>
        <TextField
          name="ref"
          label="Referencia"
          value={editedArticle.ref}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="name"
          label="Nombre"
          value={editedArticle.name}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="description"
          label="Descripción"
          value={editedArticle.description}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="price"
          label="Precio sin impuestos"
          value={editedArticle.price}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          name="tax"
          label="Impuesto aplicable"
          value={editedArticle.tax}
          onChange={onInputChange}
          fullWidth
        />
      </Grid>
    </>
  );
};

ArticleForm.propTypes = {
  editedArticle: PropTypes.shape({
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    tax: PropTypes.number.isRequired,
  }).isRequired,
  onInputChange: PropTypes.func.isRequired,
};

export default ArticleForm;
