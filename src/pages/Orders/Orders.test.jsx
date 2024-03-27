import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Orders from "./Orders";
import mockResult from "../../constants/mock";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const mockGetAction = (status) => {
  mock
    .onGet("http://localhost:3000/orders")
    .reply(status, mockResult.resultOrders);
};

const mockDeleteAction = (status) => {
  mock.onDelete("http://localhost:3000/orders/37c4").reply(status);
};

const mockGetArticlesAction = (status) => {
  mock
    .onGet("http://localhost:3000/articles/2e52")
    .reply(status, mockResult.resultArticles[0])
    .onGet("http://localhost:3000/articles/1")
    .reply(status, mockResult.resultArticles[2]);
};
const mockPutArticlesAction = (status) => {
  mock.onPut(/articles/i).reply(status);
};

const OrdersMock = () => {
  return (
    <BrowserRouter>
      <Orders />
    </BrowserRouter>
  );
};

describe("Articles", () => {
  it("render all on the page correctly", async () => {
    mockGetAction(200);
    render(<OrdersMock />);

    const id = await screen.findByText("37c4");
    const newOrderButton = screen.getByRole("link", {
      name: "Crear nuevo pedido",
    });
    const backButton = screen.getByRole("link", {
      name: "Volver",
    });

    const title = screen.getByText("Lista de Pedidos");
    const idTitle = screen.getByText("Identificador");
    const priceWithoutTaxTitle = screen.getByText("Precio total sin impuestos");
    const priceWithTaxTitle = screen.getByText("Precio total con impuestos");
    const actionTitle = screen.getByText("Acciones");
    const priceWithTax = screen.getByText("32,00 €");
    const priceWithoutTax = screen.getByText("38,95 €");
    const detailsButtons = screen.getAllByRole("link", {
      name: "Ver Detalles",
    });

    expect(newOrderButton).toHaveAttribute("href", `/nuevo-pedido`);
    expect(backButton).toHaveAttribute("href", `/`);
    expect(title).toBeInTheDocument();
    expect(idTitle).toBeInTheDocument();
    expect(priceWithoutTaxTitle).toBeInTheDocument();
    expect(priceWithTaxTitle).toBeInTheDocument();
    expect(actionTitle).toBeInTheDocument();
    expect(id).toBeInTheDocument();
    expect(priceWithTax).toBeInTheDocument();
    expect(priceWithoutTax).toBeInTheDocument();
    expect(detailsButtons[0]).toBeInTheDocument();
    expect(detailsButtons[1]).toBeInTheDocument();
    expect(detailsButtons[0]).toHaveAttribute(
      "href",
      `/pedido/${mockResult.resultOrders[0].id}`
    );
    expect(detailsButtons[1]).toHaveAttribute(
      "href",
      `/pedido/${mockResult.resultOrders[1].id}`
    );
  });
  it("error message and retry correctly", async () => {
    mockGetAction(500);
    render(<OrdersMock />);

    const errorMessage = await screen.findByText(
      "Error en la búsqueda de pedidos. Por favor, inténtelo de nuevo."
    );
    const retryButton = screen.getByRole("button", {
      name: "Inténtalo de nuevo",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockGetAction(200);
    fireEvent.click(retryButton);
    await waitFor(() => {
      const id = screen.getByText("37c4");
      expect(id).toBeInTheDocument();
    });
  });
  it("click and delete correctly", async () => {
    mockGetAction(200);
    mockDeleteAction(200);
    mockGetArticlesAction(200);
    mockPutArticlesAction(200);
    render(<OrdersMock />);

    const id = await screen.findByText("37c4");
    const deleteButtons = screen.getAllByRole("button", {
      name: "Borrar",
    });
    expect(id).toBeInTheDocument();
    expect(deleteButtons[1]).toBeInTheDocument();
    fireEvent.click(deleteButtons[1]);

    const idAgain = screen.queryByText("37c4");
    const successMessage = await screen.findByText(
      "borrado correctamente el pedido"
    );
    expect(idAgain).not.toBeInTheDocument();
    expect(successMessage).toBeInTheDocument();
  });
  it("click to delete, fail to delete and retry correcly", async () => {
    mockGetAction(200);
    mockDeleteAction(400);
    mockGetArticlesAction(400);
    mockPutArticlesAction(400);
    render(<OrdersMock />);
    const id = await screen.findByText("37c4");
    const deleteButtons = screen.getAllByRole("button", {
      name: "Borrar",
    });
    expect(id).toBeInTheDocument();
    expect(deleteButtons[1]).toBeInTheDocument();
    fireEvent.click(deleteButtons[1]);

    const idAgain = screen.queryByText("37c4");
    const errorMessage = await screen.findByText(
      "error al borrar el pedido, inténtelo de nuevo"
    );
    const retryButton = screen.getByRole("button", { name: "Retry" });
    expect(idAgain).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockDeleteAction(200);
    mockGetArticlesAction(200);
    mockPutArticlesAction(200);
    fireEvent.click(retryButton);
    await waitFor(() => {
      const successMessage = screen.getByText(
        "borrado correctamente el pedido"
      );
      expect(successMessage).toBeInTheDocument();
    });
  });
});
