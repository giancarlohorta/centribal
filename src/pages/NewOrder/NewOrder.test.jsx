import { fireEvent, render, screen } from "@testing-library/react";
import NewOrder from "./NewOrder";
import { BrowserRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import mockResult from "../../constants/mock";

const mock = new MockAdapter(axios);

const mockGetAction = (status) => {
  mock
    .onGet("http://localhost:3000/articles")
    .reply(status, mockResult.resultArticles);
};

const mockPostAction = (status) => {
  mock.onPost("http://localhost:3000/orders").reply(status);
};
const mockPutArticlesAction = (status) => {
  mock.onPut(/articles/i).reply(status);
};

const mockedUsedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

const NewOrderMock = () => {
  return (
    <BrowserRouter>
      <NewOrder />
    </BrowserRouter>
  );
};

describe("NewOrder", () => {
  it("render all on the component", async () => {
    mockGetAction(200);
    render(<NewOrderMock />);
    const selectLabel = await screen.findByText("Seleccione un Artículo:");
    const articleSelect = screen.getByRole("combobox");
    const selectedArticleTitle = screen.getByText("Artículo seleccionado:");
    const order = screen.getByText("Pedido:");
    const totalTax = screen.getAllByText(/0,00 €/i);
    const refTitle = screen.getByText("Ref");
    const backButton = screen.getByRole("link", { name: "Volver" });
    expect(selectLabel).toBeInTheDocument();
    expect(articleSelect).toBeInTheDocument();
    expect(selectedArticleTitle).toBeInTheDocument();
    expect(order).toBeInTheDocument();
    expect(totalTax[0]).toBeInTheDocument();
    expect(totalTax[1]).toBeInTheDocument();
    expect(refTitle).toBeInTheDocument();
    expect(backButton).toHaveAttribute("href", `/pedidos`);
  });
  it("render all on the component fail", async () => {
    mockGetAction(500);
    render(<NewOrderMock />);
    const erroMessage = await screen.findByText(
      "Error en la búsqueda de articulos. Por favor, inténtelo de nuevo."
    );
    const retryButton = screen.getByRole("button", {
      name: "Inténtalo de nuevo",
    });
    expect(erroMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockGetAction(200);
    fireEvent.click(retryButton);
    const selectLabel = await screen.findByText("Seleccione un Artículo:");
    expect(selectLabel).toBeInTheDocument();
  });

  it("select a article and add to order", async () => {
    mockGetAction(200);
    render(<NewOrderMock />);
    const articleSelect = await screen.findByRole("combobox");
    const totalTax = screen.getAllByText(/0,00 €/i);
    expect(totalTax[0]).toBeInTheDocument();
    expect(totalTax[1]).toBeInTheDocument();

    expect(articleSelect).toBeInTheDocument();
    fireEvent.mouseDown(articleSelect);
    const dropdownItem = await screen.findByTestId("3d1c");
    fireEvent.click(dropdownItem);
    expect(dropdownItem).toBeInTheDocument();
    const addButton = screen.queryByRole("button", {
      name: "Agregar",
    });
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const deleteButton = screen.queryByRole("button", {
      name: "Borrar",
    });

    expect(deleteButton).toBeInTheDocument();

    const totalWithoutTax = screen.getAllByText(/10,00 €/i)[0];
    const totalWithTax = screen.getByText(/12,00 €/i);
    expect(totalWithoutTax).toBeInTheDocument();
    expect(totalWithTax).toBeInTheDocument();
  });
  it("select a article and remove from order", async () => {
    mockGetAction(200);
    render(<NewOrderMock />);
    const articleSelect = await screen.findByRole("combobox");
    const totalTax = screen.getAllByText(/0,00 €/i);
    expect(totalTax[0]).toBeInTheDocument();
    expect(totalTax[1]).toBeInTheDocument();

    expect(articleSelect).toBeInTheDocument();
    fireEvent.mouseDown(articleSelect);
    const dropdownItem = await screen.findByTestId("3d1c");
    fireEvent.click(dropdownItem);
    expect(dropdownItem).toBeInTheDocument();
    const addButton = screen.queryAllByRole("button", {
      name: "Agregar",
    });
    expect(addButton.length).toBe(1);
    expect(addButton[0]).toBeInTheDocument();
    fireEvent.click(addButton[0]);
    const deleteButton = screen.queryAllByRole("button", {
      name: "Borrar",
    });

    expect(deleteButton.length).toBe(1);
    expect(deleteButton[0]).toBeInTheDocument();

    const totalWithoutTax = screen.queryAllByText(/10,00 €/i)[0];
    const totalWithTax = screen.queryByText(/12,00 €/i);
    expect(totalWithoutTax).toBeInTheDocument();
    expect(totalWithTax).toBeInTheDocument();
    fireEvent.click(deleteButton[0]);
    const deleteButtonAgain = screen.queryAllByRole("button", {
      name: "Borrar",
    });
    expect(deleteButtonAgain.length).toBe(0);
    expect(totalWithoutTax).not.toBe(/10,00 €/i);
    expect(totalWithTax).not.toBe(/12,00 €/i);
  });
  it("select a article and add to order and fail create", async () => {
    mockGetAction(200);
    mockPostAction(500);
    mockPutArticlesAction(200);
    render(<NewOrderMock />);
    const articleSelect = await screen.findByRole("combobox");
    const totalTax = screen.getAllByText(/0,00 €/i);
    expect(totalTax[0]).toBeInTheDocument();
    expect(totalTax[1]).toBeInTheDocument();

    expect(articleSelect).toBeInTheDocument();
    fireEvent.mouseDown(articleSelect);
    const dropdownItem = await screen.findByTestId("3d1c");
    fireEvent.click(dropdownItem);
    expect(dropdownItem).toBeInTheDocument();
    const addButton = screen.queryByRole("button", {
      name: "Agregar",
    });
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    const deleteButton = screen.queryByRole("button", {
      name: "Borrar",
    });

    expect(deleteButton).toBeInTheDocument();

    const totalWithoutTax = screen.getAllByText(/10,00 €/i)[0];
    const totalWithTax = screen.getByText(/12,00 €/i);
    expect(totalWithoutTax).toBeInTheDocument();
    expect(totalWithTax).toBeInTheDocument();
    const createButton = screen.queryByRole("button", {
      name: "Crear Pedido",
    });
    expect(createButton).toBeInTheDocument();
    fireEvent.click(createButton);
    const errorMessage = await screen.findByText(
      "error al crear el pedido, inténtelo de nuevo"
    );
    const retryButton = screen.getByRole("button", {
      name: "Retry",
    });

    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockPostAction(200);
    fireEvent.click(retryButton);
  });
});
