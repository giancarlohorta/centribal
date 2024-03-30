import { useEffect } from "react";
import { Typography, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import parseFunctions from "../../utils/format";
import OrderList from "../../components/OrderList";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";
import useOrderManagement from "../../hooks/useOrderManagement";

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const {
    order,
    availableArticles,
    loading,
    done,
    error,
    orderChanged,
    snackbar,
    isEditing,
    onRemoveArticle,
    onAddArticle,
    onSaveChanges,
    onCancel,
    onEdit,
    onSnackbarClose,
    fetchOrder,
    fetchArticles,
  } = useOrderManagement();

  const handleRetry = () => {
    fetchOrder(orderId);
  };

  const handleSaveChanges = () => {
    onSaveChanges(orderId);
  };

  useEffect(() => {
    fetchOrder(orderId);
  }, [orderId]);

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Detalles del Pedido</Typography>
      {done && (
        <>
          <Typography>ID del Pedido: {order.id}</Typography>
          <Typography>
            Total: {parseFunctions.formatedCurrency(order.total)}
          </Typography>
          <Typography>
            Total con Impuestos:
            {parseFunctions.formatedCurrency(order.totalWithTax)}
          </Typography>
          <Typography variant="h4">Productos en el Pedido</Typography>
          <OrderList
            list={order.items}
            edit={isEditing}
            onClick={onRemoveArticle}
          />
          {isEditing && (
            <>
              <Typography variant="h4">Agregar Nuevo Producto</Typography>

              <OrderList
                list={availableArticles}
                onClick={onAddArticle}
                edit={isEditing}
                addActions
              />
            </>
          )}
          {isEditing ? (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveChanges}
                disabled={!orderChanged}
                sx={{ marginRight: 2 }}
              >
                Guardar Cambios
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={onCancel}
                sx={{ marginRight: 2 }}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={onEdit}
              sx={{ marginRight: 2 }}
            >
              Editar Pedido
            </Button>
          )}
          <Button component={Link} to="/pedidos" variant="contained">
            Volver
          </Button>

          <SnackbarNotification
            data={snackbar}
            onClose={onSnackbarClose}
            onRetry={handleSaveChanges}
          />
        </>
      )}
      {error && (
        <ErrorMessage
          message="Error en la búsqueda del pedido. Por favor, inténtelo de nuevo."
          onRetray={handleRetry}
        />
      )}
    </div>
  );
};

export default OrderDetails;
