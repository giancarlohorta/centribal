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
} from "@mui/material";
import parseFunctions from "../../utils/format";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <Typography variant="h2">Lista de Pedidos</Typography>
      <Button component={Link} to={"/"} variant="contained" color="primary">
        Volver
      </Button>
      <Button
        component={Link}
        to={"/nuevo-pedido"}
        variant="contained"
        color="primary"
      >
        Crear nuevo pedido
      </Button>
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
                >
                  Ver Detalles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersPage;
