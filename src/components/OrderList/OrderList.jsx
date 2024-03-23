import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import OrderItem from "../OrderItem";
import PropTypes from "prop-types";

const OrderList = ({ list, action, onClick }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Ref</TableCell>
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Precio</TableCell>
          <TableCell>Cantidad</TableCell>
          {action && <TableCell>Acción</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody>
        {list.map((item) => (
          <OrderItem
            item={item}
            key={item.id}
            onClick={onClick}
            action={action}
          />
        ))}
      </TableBody>
    </Table>
  );
};

OrderList.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      ref: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  action: PropTypes.bool,
  onClick: PropTypes.func,
};

export default OrderList;
