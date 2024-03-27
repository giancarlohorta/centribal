import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Button, Snackbar, Alert } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import parseFunctions from "../../utils/format";
import OrderList from "../../components/OrderList";
import constants from "../../constants/constants";

const { FETCH_STATUS } = constants;

const snackbarInitial = {
  open: false,
  message: "",
  state: "",
};

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const [initialOrder, setInitialOrder] = useState(null);
  const [order, setOrder] = useState(null);
  const [fetchStatusOrders, setFetchStatusOrders] = useState(
    FETCH_STATUS.INITIAL
  );
  const [fetchStatusArticles, setFetchStatusArticles] = useState(
    FETCH_STATUS.INITIAL
  );
  const [snackbar, setSnackbar] = useState(snackbarInitial);
  const [articles, setArticles] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const errorOrders = fetchStatusOrders === FETCH_STATUS.ERROR;
  const loadingOrders = fetchStatusOrders === FETCH_STATUS.LOADING;
  const doneOrders = fetchStatusOrders === FETCH_STATUS.DONE;
  const orderChanged = JSON.stringify(order) !== JSON.stringify(initialOrder);

  const fetchOrderDetails = async () => {
    try {
      setFetchStatusOrders(FETCH_STATUS.LOADING);
      const response = await axios.get(
        `http://localhost:3000/orders/${orderId}`
      );
      setOrder(response.data);
      setInitialOrder(response.data);
      setFetchStatusOrders(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setFetchStatusOrders(FETCH_STATUS.ERROR);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setFetchStatusArticles(FETCH_STATUS.LOADING);
        const response = await axios.get("http://localhost:3000/articles");
        setArticles(response.data);
        setFetchStatusArticles(FETCH_STATUS.DONE);
      } catch (error) {
        console.error("Error fetching articles:", error);
        setFetchStatusArticles(FETCH_STATUS.ERROR);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (order && articles.length > 0) {
      const available = articles.filter((article) => {
        return !order.items.some((item) => item.id === article.id);
      });
      setAvailableArticles(available);
    }
  }, [order, articles]);

  const calculateItemDifferences = (currentItems, initialItems) => {
    const differences = [];

    currentItems.forEach((currentItem) => {
      const initialItem = initialItems.find(
        (item) => item.id === currentItem.id
      );

      if (!initialItem) {
        const currentArticle = articles.find(
          (item) => item.id === currentItem.id
        );
        differences.push(currentArticle);
      } else if (initialItem && initialItem.quantity !== currentItem.quantity) {
        const currentArticle = articles.find(
          (item) => item.id === currentItem.id
        );
        differences.push(currentArticle);
      }
    });

    initialItems.forEach((initialItem) => {
      const currentItem = currentItems.find(
        (item) => item.id === initialItem.id
      );

      if (!currentItem) {
        const currentArticle = articles.find(
          (item) => item.id === initialItem.id
        );
        differences.push(currentArticle);
      }
    });

    return differences;
  };

  const handleRetry = () => {
    setFetchStatusOrders(FETCH_STATUS.INITIAL);
    fetchOrderDetails();
  };

  const handleAddArticle = (id, quantity) => {
    const articleToAdd = availableArticles.find((article) => article.id === id);
    const existingItemIndex = order.items.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {
      return;
    }

    const updatedOrder = {
      ...order,
      items: [
        ...order.items,
        {
          ...articleToAdd,
          quantity: quantity,
        },
      ],
    };

    const totalWithoutTax = updatedOrder.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const totalWithTax = updatedOrder.items.reduce(
      (acc, item) => acc + item.price * (item.tax + 1) * item.quantity,
      0
    );

    setOrder({
      ...updatedOrder,
      total: totalWithoutTax,
      totalWithTax: totalWithTax,
    });

    const updatedArticles = articles.map((article) => {
      if (article.id === id) {
        return {
          ...article,
          quantity: article.quantity - quantity,
        };
      }
      return article;
    });

    setArticles(updatedArticles);
  };

  const handleRemoveArticle = (id, quantity) => {
    const existingItemIndex = order.items.findIndex((item) => item.id === id);

    if (existingItemIndex === -1) {
      return;
    }

    const updatedItems = [...order.items];
    updatedItems.splice(existingItemIndex, 1);

    const updatedOrder = {
      ...order,
      items: updatedItems,
    };

    const totalWithoutTax = updatedOrder.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const totalWithTax = updatedOrder.items.reduce(
      (acc, item) => acc + item.price * (item.tax + 1) * item.quantity,
      0
    );

    setOrder({
      ...updatedOrder,
      total: totalWithoutTax,
      totalWithTax: totalWithTax,
    });

    const updatedArticles = articles.map((article) => {
      if (article.id === id) {
        return {
          ...article,
          quantity: article.quantity + quantity,
        };
      }
      return article;
    });

    setArticles(updatedArticles);
  };

  const handleEditButtonClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:3000/orders/${orderId}`, order);

      const diffArticles = calculateItemDifferences(
        order.items,
        initialOrder.items
      );

      await Promise.all(
        diffArticles.map(async (item) => {
          try {
            await axios.put(`http://localhost:3000/articles/${item.id}`, {
              ...item,
              quantity: item.quantity,
            });
            setIsEditing(false);
            setInitialOrder(order);
            setSnackbar({
              open: true,
              message: "cambio guardado correctamente",
              state: "success",
            });
          } catch (error) {
            console.error("Error updating article:", error);
            setSnackbar({
              open: true,
              message: "error al guardar los cambios, inténtelo de nuevo",
              state: "error",
            });
          }
        })
      );
    } catch (error) {
      console.error("Error saving changes:", error);
      setSnackbar({
        open: true,
        message: "error al guardar los cambios, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  const handleCancel = () => {
    setOrder(initialOrder);
    setIsEditing(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar(snackbarInitial);
  };

  if (loadingOrders) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Detalles del Pedido</Typography>
      {doneOrders && (
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
            onClick={handleRemoveArticle}
          />
          {isEditing && (
            <>
              <Typography variant="h4">Agregar Nuevo Producto</Typography>

              <OrderList
                list={availableArticles}
                onClick={handleAddArticle}
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
                onClick={handleCancel}
                sx={{ marginRight: 2 }}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              onClick={handleEditButtonClick}
              sx={{ marginRight: 2 }}
            >
              Editar Pedido
            </Button>
          )}
          <Button component={Link} to="/pedidos" variant="contained">
            Volver
          </Button>
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
                    onClick={() => handleSaveChanges()}
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
      {errorOrders && (
        <div>
          <Typography variant="body1" color="error">
            Error en la búsqueda del pedido. Por favor, inténtelo de nuevo.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Inténtalo de nuevo
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
