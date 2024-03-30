import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Select,
  MenuItem,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
} from "@mui/material";
import { Link } from "react-router-dom";
import OrderItem from "../../components/OrderItem";
import OrderList from "../../components/OrderList";
import parseFunctions from "../../utils/format";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";
import useOrderManagement from "../../hooks/useOrderManagement";
import {
  ButtonsContainer,
  Container,
  OrderContainer,
  SelectContainer,
  SelectedArticleContainer,
} from "./NewOrderStyles";

const initialValue = {
  id: "",
};

const CreateOrderPage = () => {
  const {
    order,
    articles,
    availableArticles,
    loadingArticle,
    doneArticle,
    errorArticle,
    snackbar,
    onRemoveArticle,
    onAddArticle,
    onCreateOrder,
    onSnackbarClose,
    fetchArticles,
  } = useOrderManagement();
  const [selectedArticle, setSelectedArticle] = useState(initialValue);

  const handleChangeSelectArticle = (event) => {
    const selectedItem = articles.find(
      (item) => item.id === event.target.value
    );
    setSelectedArticle(selectedItem);
  };

  const handleAddArticle = (id, quantity) => {
    onAddArticle(id, quantity);
    setSelectedArticle(initialValue);
  };

  const handleCreateOrder = () => {
    onCreateOrder();
    setSelectedArticle(initialValue);
  };

  const handleRetry = () => {
    fetchArticles();
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const isDisabled = order.items.length === 0;

  if (loadingArticle) {
    return <div>Carregando...</div>;
  }

  return (
    <Container>
      <Typography variant="h2">Crear Nuevo Pedido</Typography>
      {errorArticle && (
        <ErrorMessage
          message="Error en la búsqueda de articulos. Por favor, inténtelo de nuevo."
          onRetray={handleRetry}
        />
      )}
      {doneArticle && (
        <>
          <SelectContainer elevation={4}>
            <Typography variant="h6">Seleccione un Artículo:</Typography>
            <Select
              value={selectedArticle.id}
              onChange={handleChangeSelectArticle}
              fullWidth
            >
              {availableArticles.map((article) => (
                <MenuItem
                  key={article.id}
                  value={article.id}
                  data-testid={article.id}
                >
                  {article.name}
                </MenuItem>
              ))}
            </Select>
          </SelectContainer>
          <SelectedArticleContainer elevation={4}>
            <Typography variant="h6">Artículo seleccionado:</Typography>
            {selectedArticle.id && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Ref</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Precio</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>Acción</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <OrderItem
                    item={selectedArticle}
                    edit
                    addActions
                    onClick={handleAddArticle}
                  />
                </TableBody>
              </Table>
            )}
          </SelectedArticleContainer>

          <OrderContainer elevation={4}>
            <Typography variant="h6">Pedido:</Typography>
            <Typography>
              Total: {parseFunctions.formatedCurrency(order.total)}
            </Typography>
            <Typography>
              Total con Impuestos:
              {parseFunctions.formatedCurrency(order.totalWithTax)}
            </Typography>
            <OrderList list={order.items} edit onClick={onRemoveArticle} />
          </OrderContainer>
          <ButtonsContainer>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateOrder}
              disabled={isDisabled}
            >
              Crear Pedido
            </Button>
            <Button component={Link} to="/pedidos" variant="contained">
              Volver
            </Button>
          </ButtonsContainer>
          <SnackbarNotification
            data={snackbar}
            onClose={onSnackbarClose}
            onRetry={handleCreateOrder}
          />
        </>
      )}
    </Container>
  );
};

export default CreateOrderPage;
