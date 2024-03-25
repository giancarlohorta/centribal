import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import OrderItem from "../OrderItem";
import PropTypes from "prop-types";

const OrderList = ({ list, edit, onClick, addActions }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Ref</TableCell>
            <TableCell>Nombre</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Precio</TableCell>
            <TableCell>Cantidad</TableCell>
            {edit && <TableCell>Acción</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((item) => (
            <OrderItem
              item={item}
              key={item.id}
              onClick={onClick}
              edit={edit}
              addActions={addActions}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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
  edit: PropTypes.bool,
  onClick: PropTypes.func,
  addActions: PropTypes.bool,
  limit: PropTypes.func,
};

export default OrderList;
