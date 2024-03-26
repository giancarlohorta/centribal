import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Articles from "./Articles";
import mockResult from "../../constants/mock";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const mockGetAction = (status) => {
  mock
    .onGet("http://localhost:3000/articles")
    .reply(status, mockResult.resultArticles);
};

const mockDeleteAction = (status) => {
  mock.onDelete("http://localhost:3000/articles/2e52").reply(status);
};

const ArticlesMock = () => {
  return (
    <BrowserRouter>
      <Articles />
    </BrowserRouter>
  );
};

describe("Articles", () => {
  it("render all on the page correctly", async () => {
    mockGetAction(200);
    render(<ArticlesMock />);

    const firstName = await screen.findByText("Giancarlo");
    const newArticleButton = screen.getByRole("link", {
      name: "Nuevo Artículo",
    });
    const backButton = screen.getByRole("link", {
      name: "Volver",
    });

    const title = screen.getByText("Lista de Artículos");
    const refTitle = screen.getByText("Referencia");
    const nameTitle = screen.getByText("Nombre");
    const priceTitle = screen.getByText("Precio sin impuestos");
    const actionTitle = screen.getByText("Acciones");
    const firstRef = screen.getByText("REF001");
    const firstPrice = screen.getByText("21,00 €");
    const secondName = screen.getByText("Jorge");
    const secondeRef = screen.getByText("REF002");
    const secondPrice = screen.getByText("10,00 €");
    const detailsButtons = screen.getAllByRole("link", {
      name: "Ver Detalles",
    });

    expect(newArticleButton).toHaveAttribute("href", `/nuevo-articulo`);
    expect(backButton).toHaveAttribute("href", `/`);
    expect(title).toBeInTheDocument();
    expect(refTitle).toBeInTheDocument();
    expect(nameTitle).toBeInTheDocument();
    expect(priceTitle).toBeInTheDocument();
    expect(actionTitle).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(firstRef).toBeInTheDocument();
    expect(firstPrice).toBeInTheDocument();
    expect(secondName).toBeInTheDocument();
    expect(secondeRef).toBeInTheDocument();
    expect(secondPrice).toBeInTheDocument();
    expect(detailsButtons[0]).toBeInTheDocument();
    expect(detailsButtons[1]).toBeInTheDocument();
    expect(detailsButtons[0]).toHaveAttribute(
      "href",
      `/articulo/${mockResult.resultArticles[0].id}`
    );
    expect(detailsButtons[1]).toHaveAttribute(
      "href",
      `/articulo/${mockResult.resultArticles[1].id}`
    );
  });
  it("error message and retry correctly", async () => {
    mockGetAction(500);
    render(<ArticlesMock />);

    const errorMessage = await screen.findByText(
      "Error en la búsqueda de artículos. Por favor, inténtelo de nuevo."
    );
    const retryButton = screen.getByRole("button", {
      name: "Inténtalo de nuevo",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockGetAction(200);
    fireEvent.click(retryButton);
    await waitFor(() => {
      const firstName = screen.getByText("Giancarlo");
      expect(firstName).toBeInTheDocument();
    });
  });
  it("click and delete correctly", async () => {
    mockGetAction(200);
    mockDeleteAction(200);
    render(<ArticlesMock />);
    const firstName = await screen.findByText("Giancarlo");
    const nameTitle = screen.getByText("Nombre");
    const deleteButtons = screen.getAllByRole("button", {
      name: "Borrar",
    });
    expect(firstName).toBeInTheDocument();
    expect(deleteButtons[0]).toBeInTheDocument();
    fireEvent.click(deleteButtons[0]);

    const firstNameAgain = screen.queryByText("Giancarlo");
    const successMessage = await screen.findByText(
      "borrado correctamente el artículo"
    );
    expect(firstNameAgain).not.toBeInTheDocument();
    expect(successMessage).toBeInTheDocument();
    await waitFor(() => {
      fireEvent.click(nameTitle);
      const successMessageAgain = screen.queryByText(
        "borrado correctamente el artículo"
      );
      expect(successMessageAgain).not.toBeInTheDocument();
    });
  });
  it("click to delete, fail to delete and retry correcly", async () => {
    mockGetAction(200);
    mockDeleteAction(400);
    render(<ArticlesMock />);
    const firstName = await screen.findByText("Giancarlo");
    const deleteButtons = screen.getAllByRole("button", {
      name: "Borrar",
    });
    expect(firstName).toBeInTheDocument();
    expect(deleteButtons[0]).toBeInTheDocument();
    fireEvent.click(deleteButtons[0]);

    const firstNameAgain = screen.queryByText("Giancarlo");
    const errorMessage = await screen.findByText(
      "error al borrar el artículo, inténtelo de nuevo"
    );
    const retryButton = screen.getByRole("button", { name: "Retry" });
    expect(firstNameAgain).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockDeleteAction(200);
    fireEvent.click(retryButton);
    const successMessage = await screen.findByText(
      "borrado correctamente el artículo"
    );
    expect(successMessage).toBeInTheDocument();
  });
});
