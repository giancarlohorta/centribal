const formatedCurrency = (value) => {
  return parseFloat(value).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });
};

const parsedValue = (data) => {
  return {
    ...data,
    price: parseFloat(data.price),
    tax: parseFloat(data.tax),
  };
};

const parseFunctions = {
  formatedCurrency,
  parsedValue,
};
export default parseFunctions;
