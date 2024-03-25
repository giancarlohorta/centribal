import { useState } from "react";
import { Button, MenuItem, Select, TableCell, TableRow } from "@mui/material";
import parseFunctions from "../../utils/format";
import PropTypes from "prop-types";

const OrderItem = ({ item, onClick, edit, addActions }) => {
  const [selectedQuantity, setSelectedQuantity] = useState(
    addActions ? 1 : item.quantity
  );
  const limitQuantity = addActions ? item.quantity : item.quantity;

  return (
    <TableRow key={item.id}>
      <TableCell>{item.ref}</TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.description}</TableCell>
      <TableCell>{parseFunctions.formatedCurrency(item.price)}</TableCell>
      <TableCell>
        {edit && addActions ? (
          <Select
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
          >
            {[...Array(limitQuantity)].map((_, index) => (
              <MenuItem
                key={index + 1}
                value={index + 1}
                data-testid={`quantity-option-${index + 1}`}
              >
                {index + 1}
              </MenuItem>
            ))}
          </Select>
        ) : (
          item.quantity
        )}
      </TableCell>
      {edit && (
        <TableCell>
          <Button
            onClick={() => {
              onClick(item.id, selectedQuantity);
            }}
          >
            {addActions ? "Agregar" : "Borrar"}
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
  edit: PropTypes.bool,
  addActions: PropTypes.bool,
};

export default OrderItem;
