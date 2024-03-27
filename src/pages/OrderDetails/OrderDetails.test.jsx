import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import OrderDetails from "./OrderDetails";
import mockResult from "../../constants/mock";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const mockGetAction = (status) => {
  mock
    .onGet("http://localhost:3000/orders/37c4")
    .reply(status, mockResult.resultOrders[1]);
};

const mockGetArticlesAction = (status) => {
  mock
    .onGet("http://localhost:3000/articles")
    .reply(status, mockResult.resultArticles);
};

const mockPutOrderAction = (status) => {
  mock.onPut("http://localhost:3000/orders/37c4").reply(status);
};

const mockPutArticlesAction = (status) => {
  mock.onPut(/articles/i).reply(status);
};

const OrderDetailsMock = () => {
  return (
    <MemoryRouter initialEntries={[`/pedido/37c4`]}>
      <Routes>
        <Route path="/pedido/:id" element={<OrderDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("OrderDetails", () => {
  it("render all on the page correctly", async () => {
    mockGetAction(200);
    mockGetArticlesAction(200);
    render(<OrderDetailsMock />);

    const id = await screen.findByText(/37c4/i);

    const title = screen.getByText("Detalles del Pedido");
    const totlalWithTax = screen.getByText(/32,00 €/i);
    const totalWithoutTax = screen.getByText(/38,95 €/i);
    const subtitle = screen.getByText("Productos en el Pedido");
    const firstRef = screen.getByText("REF001");
    const secondRef = screen.getByText("REF123");
    const backButton = screen.getByRole("link", {
      name: "Volver",
    });

    expect(title).toBeInTheDocument();
    expect(id).toBeInTheDocument();
    expect(totlalWithTax).toBeInTheDocument();
    expect(totalWithoutTax).toBeInTheDocument();
    expect(subtitle).toBeInTheDocument();
    expect(firstRef).toBeInTheDocument();
    expect(secondRef).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", `/pedidos`);
  });

  it("render all on the page fail", async () => {
    mockGetAction(500);
    mockGetArticlesAction(200);
    render(<OrderDetailsMock />);

    const title = await screen.findByText(
      "Error en la búsqueda del pedido. Por favor, inténtelo de nuevo."
    );
    const tryButton = screen.getByRole("button", {
      name: "Inténtalo de nuevo",
    });

    expect(title).toBeInTheDocument();
    expect(tryButton).toBeInTheDocument();
    mockGetAction(200);
    fireEvent.click(tryButton);
    const id = await screen.findByText(/37c4/i);
    expect(id).toBeInTheDocument();
  });

  it("click edit button and add to order and cancel the edition", async () => {
    mockGetAction(200);
    mockGetArticlesAction(200);
    render(<OrderDetailsMock />);

    const id = await screen.findByText(/37c4/i);

    const title = screen.getByText("Detalles del Pedido");
    const editButton = screen.getByRole("button", {
      name: "Editar Pedido",
    });

    expect(title).toBeInTheDocument();
    expect(id).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    const subTitle = screen.getByText("Agregar Nuevo Producto");
    expect(subTitle).toBeInTheDocument();

    const addButton = screen.queryByRole("button", {
      name: "Agregar",
    });
    expect(addButton).toBeInTheDocument();

    const ref = screen.queryByText("REF002");
    expect(ref).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();
    const cancelButton = screen.queryByRole("button", {
      name: "Cancelar",
    });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
    expect(ref).not.toBeInTheDocument();
  });
  it("click edit button and remove from order", async () => {
    mockGetAction(200);
    mockGetArticlesAction(200);
    render(<OrderDetailsMock />);

    const id = await screen.findByText(/37c4/i);

    const title = screen.getByText("Detalles del Pedido");
    const editButton = screen.getByRole("button", {
      name: "Editar Pedido",
    });

    expect(title).toBeInTheDocument();
    expect(id).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    const subTitle = screen.getByText("Agregar Nuevo Producto");
    expect(subTitle).toBeInTheDocument();

    const deleteButtons = screen.queryAllByRole("button", {
      name: "Borrar",
    });
    expect(deleteButtons.length).toBe(2);
    expect(deleteButtons[0]).toBeInTheDocument();
    const addButtons = screen.queryAllByRole("button", {
      name: "Agregar",
    });
    expect(addButtons.length).toBe(1);
    expect(addButtons[0]).toBeInTheDocument();

    fireEvent.click(deleteButtons[0]);
    const deleteButtonsAgain = screen.queryAllByRole("button", {
      name: "Borrar",
    });
    const addButtonsAgain = screen.queryAllByRole("button", {
      name: "Agregar",
    });
    expect(deleteButtonsAgain.length).toBe(1);
    expect(addButtonsAgain.length).toBe(2);
  });

  it("click edit button and add to order and save correctly", async () => {
    mockGetAction(200);
    mockGetArticlesAction(200);
    mockPutOrderAction(200);
    mockPutArticlesAction(200);
    render(<OrderDetailsMock />);

    const id = await screen.findByText(/37c4/i);

    const title = screen.getByText("Detalles del Pedido");
    const editButton = screen.getByRole("button", {
      name: "Editar Pedido",
    });

    expect(title).toBeInTheDocument();
    expect(id).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    const subTitle = screen.getByText("Agregar Nuevo Producto");
    expect(subTitle).toBeInTheDocument();

    const addButton = screen.queryByRole("button", {
      name: "Agregar",
    });
    expect(addButton).toBeInTheDocument();

    const ref = screen.queryByText("REF002");
    expect(ref).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();
    const salveButton = screen.queryByRole("button", {
      name: "Guardar Cambios",
    });
    expect(salveButton).toBeInTheDocument();
    fireEvent.click(salveButton);
    const successMessage = await screen.findByText(
      "cambio guardado correctamente"
    );
    expect(successMessage).toBeInTheDocument();
  });
  it("click edit button and add to order and fail save", async () => {
    mockGetAction(200);
    mockGetArticlesAction(200);
    mockPutOrderAction(500);
    mockPutArticlesAction(200);
    render(<OrderDetailsMock />);

    const id = await screen.findByText(/37c4/i);

    const title = screen.getByText("Detalles del Pedido");
    const editButton = screen.getByRole("button", {
      name: "Editar Pedido",
    });

    expect(title).toBeInTheDocument();
    expect(id).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);
    const subTitle = screen.getByText("Agregar Nuevo Producto");
    expect(subTitle).toBeInTheDocument();

    const addButton = screen.queryByRole("button", {
      name: "Agregar",
    });
    expect(addButton).toBeInTheDocument();

    const ref = screen.queryByText("REF002");
    expect(ref).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(addButton).not.toBeInTheDocument();
    const salveButton = screen.queryByRole("button", {
      name: "Guardar Cambios",
    });
    expect(salveButton).toBeInTheDocument();
    fireEvent.click(salveButton);
    const errorMessage = await screen.findByText(
      "error al guardar los cambios, inténtelo de nuevo"
    );
    const retryButton = screen.queryByRole("button", {
      name: "Retry",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockPutOrderAction(200);
    fireEvent.click(retryButton);
    await waitFor(() => {
      const refAgain = screen.queryByText("REF002");
      expect(refAgain).toBeInTheDocument();
    });
  });
});
