const resultArticles = [
  {
    id: "2e52",
    ref: "REF001",
    name: "Giancarlo",
    description: "jorge",
    price: 21,
    tax: 0.2,
    quantity: 36,
  },
  {
    id: "3d1c",
    ref: "REF002",
    name: "Jorge",
    description: "Jorge",
    price: 10,
    tax: 0.2,
    quantity: 60,
  },
];

const resultOrders = [
  {
    id: "f6b4",
    total: 32,
    totalWithTax: 38.95,
    items: [
      {
        id: "1",
        ref: "REF123",
        name: "Artículo 1a",
        description: "Descripción del artículo 1",
        price: 11,
        tax: 0.25,
        quantity: 2,
      },
      {
        id: "2e52",
        ref: "REF001",
        name: "Giancarlo",
        description: "jorge",
        price: 21,
        tax: 0.2,
        quantity: 1,
      },
    ],
  },
  {
    id: "37c4",
    total: 32,
    totalWithTax: 38.95,
    items: [
      {
        id: "2e52",
        ref: "REF001",
        name: "Giancarlo",
        description: "jorge",
        price: 21,
        tax: 0.2,
        quantity: 1,
      },
      {
        id: "1",
        ref: "REF123",
        name: "Artículo 1a",
        description: "Descripción del artículo 1",
        price: 11,
        tax: 0.25,
        quantity: 1,
      },
    ],
  },
];

const mockResult = {
  resultArticles,
  resultOrders,
};

export default mockResult;
