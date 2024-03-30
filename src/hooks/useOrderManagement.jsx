import { useEffect, useState } from "react";
import axios from "axios";
import constants from "../constants/constants";
import { useNavigate } from "react-router-dom";

const { FETCH_STATUS, SNACKBAR_INITIAL } = constants;

const useOrderManagement = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({
    total: 0,
    totalWithTax: 0,
    items: [],
  });
  const [initialOrder, setInitialOrder] = useState(null);
  const [fetchStatus, setFetchStatus] = useState(FETCH_STATUS.INITIAL);
  const [fetchStatusArticle, setFetchStatusArticle] = useState(
    FETCH_STATUS.INITIAL
  );

  const [articles, setArticles] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState(SNACKBAR_INITIAL);

  const orderChanged = JSON.stringify(order) !== JSON.stringify(initialOrder);

  const fetchOrder = async (orderId) => {
    try {
      setFetchStatus(FETCH_STATUS.LOADING);
      const response = await axios.get(
        `http://localhost:3000/orders/${orderId}`
      );
      setOrder(response.data);
      setInitialOrder(response.data);
      setFetchStatus(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setFetchStatus(FETCH_STATUS.ERROR);
    }
  };

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

  const fetchArticles = async () => {
    setFetchStatusArticle(FETCH_STATUS.LOADING);
    try {
      const response = await axios.get("http://localhost:3000/articles");
      setArticles(response.data);
      setFetchStatusArticle(FETCH_STATUS.DONE);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setFetchStatusArticle(FETCH_STATUS.ERROR);
    }
  };

  const calculateItemDifferences = (currentItems, initialItems) => {
    const differences = [];

    const findArticleById = (id) =>
      articles.find((article) => article.id === id);

    currentItems.forEach((currentItem) => {
      const initialItem = initialItems.find(
        (item) => item.id === currentItem.id
      );

      if (!initialItem || initialItem.quantity !== currentItem.quantity) {
        differences.push(findArticleById(currentItem.id));
      }
    });

    initialItems.forEach((initialItem) => {
      if (!currentItems.some((item) => item.id === initialItem.id)) {
        differences.push(findArticleById(initialItem.id));
      }
    });

    return differences;
  };

  const onAddArticle = (id, quantity) => {
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

  const onRemoveArticle = (id, quantity) => {
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

  const onSaveChanges = async (orderId) => {
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
            setInitialOrder(order);
            setIsEditing(false);
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

  const onDeleteOrder = async (orderId) => {
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

  const onCreateOrder = async () => {
    try {
      await axios.post(`http://localhost:3000/orders`, order);

      await Promise.all(
        articles.map(async (item) => {
          try {
            await axios.put(`http://localhost:3000/articles/${item.id}`, {
              ...item,
              quantity: item.quantity,
            });
            navigate("/pedidos");
          } catch (error) {
            console.error("Error updating article:", error);
          }
        })
      );
    } catch (error) {
      console.error("Error saving changes:", error);
      setSnackbar({
        open: true,
        message: "error al crear el pedido, inténtelo de nuevo",
        state: "error",
      });
    }
  };

  const onCancel = () => {
    setOrder(initialOrder);
    setIsEditing(false);
  };
  const onEdit = () => {
    setIsEditing(true);
  };

  const onSnackbarClose = () => {
    setSnackbar(SNACKBAR_INITIAL);
  };

  useEffect(() => {
    if (order && articles.length > 0) {
      const available = articles.filter((article) => {
        return !order.items.some((item) => item.id === article.id);
      });
      setAvailableArticles(available);
    }
  }, [order, articles]);

  const loading = fetchStatus === FETCH_STATUS.LOADING;
  const done = fetchStatus === FETCH_STATUS.DONE;
  const error = fetchStatus === FETCH_STATUS.ERROR;

  const loadingArticle = fetchStatusArticle === FETCH_STATUS.LOADING;
  const doneArticle = fetchStatusArticle === FETCH_STATUS.DONE;
  const errorArticle = fetchStatusArticle === FETCH_STATUS.ERROR;

  return {
    orders,
    order,
    initialOrder,
    articles,
    availableArticles,
    loading,
    loadingArticle,
    done,
    doneArticle,
    error,
    errorArticle,
    snackbar,
    orderChanged,
    isEditing,
    onRemoveArticle,
    onAddArticle,
    onSaveChanges,
    onDeleteOrder,
    onCreateOrder,
    onCancel,
    onEdit,
    onSnackbarClose,
    fetchOrder,
    fetchOrders,
    fetchArticles,
  };
};

export default useOrderManagement;
