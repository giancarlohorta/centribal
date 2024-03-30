import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import parseFunctions from "../../utils/format";
import ErrorMessage from "../../components/ErrorMessage";
import SnackbarNotification from "../../components/SnackbarNotification";
import useOrderManagement from "../../hooks/useOrderManagement";

const OrdersPage = () => {
  const {
    orders,
    done,
    loading,
    error,
    fetchOrders,
    onDeleteOrder,
    snackbar,
    onSnackbarClose,
  } = useOrderManagement();

  const handleRetry = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Lista de Pedidos</Typography>
      <Button
        component={Link}
        to={"/nuevo-pedido"}
        variant="contained"
        color="primary"
        sx={{ marginRight: 2 }}
      >
        Crear nuevo pedido
      </Button>
      <Button component={Link} to={"/"} variant="contained" color="primary">
        Volver
      </Button>
      {error && (
        <ErrorMessage
          message="Error en la búsqueda de pedidos. Por favor, inténtelo de nuevo."
          onRetray={handleRetry}
        />
      )}
      {done && (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Identificador</TableCell>
                <TableCell>Precio total sin impuestos</TableCell>
                <TableCell>Precio total con impuestos</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    {parseFunctions.formatedCurrency(order.total)}
                  </TableCell>
                  <TableCell>
                    {parseFunctions.formatedCurrency(order.totalWithTax)}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/pedido/${order.id}`}
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 2 }}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <SnackbarNotification
            data={snackbar}
            onClose={onSnackbarClose}
            onRetry={() => onDeleteOrder(snackbar.orderId)}
          />
        </>
      )}
    </div>
  );
};

export default OrdersPage;
