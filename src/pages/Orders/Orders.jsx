import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import parseFunctions from "../../utils/format";
import constants from "../../constants/constants";

const { FETCH_STATUS } = constants;

const snackbarInitial = {
  open: false,
  message: "",
  articleId: "",
  state: "",
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.INITIAL);
  const [snackbar, setSnackbar] = useState(snackbarInitial);

  const error = fetchStatus === FETCH_STATUS.ERROR;
  const loading = fetchStatus === FETCH_STATUS.LOADING;
  const done = fetchStatus === FETCH_STATUS.DONE;

  const fetchOrders = async () => {
    setFetchStatus(FETCH_STATUS.LOADING);
    try {
      const response = await axios.get("http://localhost:3000/orders");
      setOrders(response.data);
      setFetchStatus(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setFetchStatus(FETCH_STATUS.ERROR);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar(snackbarInitial);
  };

  const handleRetry = () => {
    setFetchStatus(FETCH_STATUS.INITIAL);
    fetchOrders();
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const orderDeteils = orders.find(({ id }) => id === orderId);
      const orderItems = orderDeteils.items.map(({ id, quantity }) => {
        return { id, quantity };
      });
      const articleResponses = await Promise.all(
        orderItems.map(async (item) => {
          const responseData = await axios.get(
            `http://localhost:3000/articles/${item.id}`
          );
          return responseData.data;
        })
      );

      const updatedArticles = articleResponses.map((article, index) => {
        const updatedQuantity = article.quantity + orderItems[index].quantity;
        return { ...article, quantity: updatedQuantity };
      });

      await Promise.all(
        updatedArticles.map(async (article) => {
          await axios.put(
            `http://localhost:3000/articles/${article.id}`,
            article
          );
        })
      );

      await axios.delete(`http://localhost:3000/orders/${orderId}`);
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      setSnackbar({
        open: true,
        orderId: "",
        message: "borrado correctamente el pedido",
        state: "success",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      setSnackbar({
        open: true,
        orderId,
        message: "error al borrar el pedido, inténtelo de nuevo",
        state: "error",
      });
    }
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
        <div>
          <Typography variant="body1" color="error">
            Error en la búsqueda de pedidos. Por favor, inténtelo de nuevo.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Inténtalo de nuevo
          </Button>
        </div>
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
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      Borrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbar.state}
              variant="filled"
              sx={{ width: "100%" }}
              action={
                snackbar.state === "error" && (
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => handleDeleteOrder(snackbar.orderId)}
                  >
                    Retry
                  </Button>
                )
              }
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </div>
  );
};

export default OrdersPage;
