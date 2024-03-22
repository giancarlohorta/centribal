const formatedCurrency = (value) => {
  return value.toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
};

const parsedValue = (value, name) => {
  let parsedValue = value;
  if (name === "price" || name === "tax") {
    if (isNaN(value) || value === "") {
      parsedValue = value;
    } else {
      parsedValue = parseFloat(value);
    }
  }

  return parsedValue;
};

const parseFunctions = {
  formatedCurrency,
  parsedValue,
};
export default parseFunctions;
