import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import parseFunctions from "../../utils/format";
import OrderList from "../../components/OrderList";

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  const [initialOrder, setInitialOrder] = useState(null);
  const [order, setOrder] = useState(null);
  const [articles, setArticles] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/orders/${orderId}`
        );
        setOrder(response.data);
        setInitialOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get("http://localhost:3000/articles");
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching articles:", error);
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

  const handleEditButtonClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:3000/orders/${orderId}`, order);
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleCancel = () => {
    setOrder(initialOrder);
    setIsEditing(false);
  };

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h2">Detalles del Pedido</Typography>
      <Typography>ID del Pedido: {order.id}</Typography>
      <Typography>
        Total: {parseFunctions.formatedCurrency(order.total)}
      </Typography>
      <Typography>
        Total con Impuestos:
        {parseFunctions.formatedCurrency(order.totalWithTax)}
      </Typography>

      <Typography variant="h4">Productos en el Pedido</Typography>
      <OrderList list={order.items} />

      <Button variant="contained" onClick={handleEditButtonClick}>
        Editar Pedido
      </Button>
      <Button component={Link} to="/pedidos" variant="contained">
        Voltar para Pedidos
      </Button>

      {isEditing && (
        <>
          <Typography variant="h4">Agregar Nuevo Producto</Typography>

          <OrderList
            list={availableArticles}
            onClick={handleAddArticle}
            action
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Guardar Cambios
          </Button>
          <Button variant="contained" color="primary" onClick={handleCancel}>
            Cancelar
          </Button>
        </>
      )}
    </div>
  );
};

export default OrderDetailsPage;
