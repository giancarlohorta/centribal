import { useState } from "react";
import { Button, MenuItem, Select, TableCell, TableRow } from "@mui/material";
import parseFunctions from "../../utils/format";
import PropTypes from "prop-types";

const OrderItem = ({ item, onClick, action }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  return (
    <TableRow key={item.id}>
      <TableCell>{item.ref}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{parseFunctions.formatedCurrency(item.price)}</TableCell>
      <TableCell>
        {action ? (
          <Select
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
          >
            {[...Array(item.quantity)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        ) : (
          item.quantity
        )}
      </TableCell>
      {action && (
        <TableCell>
          <Button
            onClick={() => {
              onClick(item.id, selectedQuantity);
            }}
          >
            Agregar
          </Button>
        </TableCell>
      )}
    </TableRow>
  );
};

OrderItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func,
  action: PropTypes.bool,
};

export default OrderItem;
