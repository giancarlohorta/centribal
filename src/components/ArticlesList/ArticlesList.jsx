import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material"; // Importe os componentes do Material-UI necessários

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import parseFunctions from "../../utils/format";

const ArticlesList = ({ list }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Referencia</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Precio sin impuestos</TableCell>
          <TableCell>Acciones</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map((article) => (
          <TableRow key={article.id}>
            <TableCell>{article.ref}</TableCell>
            <TableCell>{article.name}</TableCell>
            <TableCell>
              {parseFunctions.formatedCurrency(article.price)}
            </TableCell>
            <TableCell>
              <Button
                component={Link}
                to={`/articulo/${article.id}`}
                variant="contained"
                color="primary"
              >
                Ver Detalles
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

ArticlesList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      ref: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ArticlesList;
