import { useState, useEffect } from "react";
import axios from "axios";
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
import { Link, useNavigate } from "react-router-dom";
import OrderItem from "../../components/OrderItem";
import OrderList from "../../components/OrderList";
import parseFunctions from "../../utils/format";

const initialValue = {
  id: "",
};

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [availableArticles, setAvailableArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(initialValue);
  const [order, setOrder] = useState({
    total: 0,
    totalWithTax: 0,
    items: [],
  });

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

  const handleCreateOrder = async () => {
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
    }
  };

  const handleChangeSelectArticle = (event) => {
    const selectedItem = articles.find(
      (item) => item.id === event.target.value
    );
    setSelectedArticle(selectedItem);
  };

  const handleAddArticle = (id, quantity) => {
    const articleToAdd = availableArticles.find((article) => article.id === id);
    const existingItemIndex = order.items.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {
      return;
    }
    if (articleToAdd) {
      const selectedItem = { ...articleToAdd, quantity };
      const updatedOrder = {
        ...order,
        items: [...order.items, selectedItem],
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
        if (article.id === articleToAdd.id) {
          return {
            ...article,
            quantity: article.quantity - quantity,
          };
        }
        return article;
      });

      setArticles(updatedArticles);
      setSelectedArticle(initialValue);
    }
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

  return (
    <div>
      <Typography variant="h2">Crear Nuevo Pedido</Typography>
      <div>
        <Typography variant="h6">Seleccione un Artículo:</Typography>
        <Select
          value={selectedArticle.id}
          onChange={handleChangeSelectArticle}
          fullWidth
        >
          {availableArticles.map((article) => (
            <MenuItem key={article.id} value={article.id}>
              {article.name}
            </MenuItem>
          ))}
        </Select>
      </div>
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
      <Typography variant="h6">Pedido:</Typography>
      <Typography>
        Total: {parseFunctions.formatedCurrency(order.total)}
      </Typography>
      <Typography>
        Total con Impuestos:
        {parseFunctions.formatedCurrency(order.totalWithTax)}
      </Typography>
      <OrderList list={order.items} edit onClick={handleRemoveArticle} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCreateOrder}
        sx={{ marginRight: 2 }}
      >
        Crear Pedido
      </Button>
      <Button component={Link} to="/pedidos" variant="contained">
        Volver
      </Button>
    </div>
  );
};

export default CreateOrderPage;
