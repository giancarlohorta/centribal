import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ArticleDetails from "./ArticleDetails";
import mockResult from "../../constants/mock";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

const mockGetAction = (status) => {
  mock
    .onGet("http://localhost:3000/articles/1234")
    .reply(status, mockResult.resultArticles[0]);
};

const mockPutAction = (status) => {
  mock.onPut("http://localhost:3000/articles/1234").reply(status);
};

const ArticleDetailsMock = () => {
  return (
    <MemoryRouter initialEntries={[`/articulo/1234`]}>
      <Routes>
        <Route path="/articulo/:id" element={<ArticleDetails />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("ArticleDetails", () => {
  it("render all on the page correctly", async () => {
    mockGetAction(200);
    render(<ArticleDetailsMock />);

    const ref = await screen.findByText(/REF001/i);
    const name = screen.getByText(/Giancarlo/i);
    const description = screen.getByText(/jorge/i);
    const price = screen.getByText(/21,00 €/i);
    const tax = screen.getByText(/0.2/i);
    const quantity = screen.getByText(/36/i);
    const backButton = screen.getByRole("link", {
      name: "Volver",
    });

    expect(backButton).toHaveAttribute("href", `/articulos`);
    expect(ref).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(tax).toBeInTheDocument();
    expect(quantity).toBeInTheDocument();
  });
  it("render all on the page correctly after to click on edit", async () => {
    mockGetAction(200);
    render(<ArticleDetailsMock />);

    const ref = await screen.findByText(/REF001/i);
    const editButton = screen.getByRole("button", {
      name: "Editar",
    });

    expect(editButton).toBeInTheDocument();
    expect(ref).toBeInTheDocument();
    fireEvent.click(editButton);
    const refLabel = await screen.findByLabelText("Referencia");
    const nameLabel = screen.getByLabelText("Nombre");
    const descriptionLabel = screen.getByLabelText("Descripción");
    const priceLabel = screen.getByLabelText("Precio sin impuestos");
    const taxLabel = screen.getByLabelText("Impuesto aplicable");
    const quantityLabel = screen.getByLabelText("cantidad");
    expect(refLabel).toBeInTheDocument();
    expect(refLabel.value).toBe("REF001");
    expect(nameLabel).toBeInTheDocument();
    expect(nameLabel.value).toBe("Giancarlo");
    expect(descriptionLabel).toBeInTheDocument();
    expect(descriptionLabel.value).toBe("jorge");
    expect(priceLabel).toBeInTheDocument();
    expect(priceLabel.value).toBe("21");
    expect(taxLabel).toBeInTheDocument();
    expect(taxLabel.value).toBe("0.2");
    expect(quantityLabel).toBeInTheDocument();
    expect(quantityLabel.value).toBe("36");
  });
  it("error message and retry correctly", async () => {
    mockGetAction(400);
    render(<ArticleDetailsMock />);

    const errorMessage = await screen.findByText(
      "Error en la búsqueda del artículo. Por favor, inténtelo de nuevo."
    );
    const retryButton = screen.getByRole("button", {
      name: "Inténtalo de nuevo",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockGetAction(200);
    fireEvent.click(retryButton);
    const firstName = await screen.findByText(/Giancarlo/i);
    expect(firstName).toBeInTheDocument();
  });
  it("click on cancel edition", async () => {
    mockGetAction(200);
    render(<ArticleDetailsMock />);

    const ref = await screen.findByText(/REF001/i);
    const editButton = screen.getByRole("button", {
      name: "Editar",
    });

    expect(editButton).toBeInTheDocument();
    expect(ref).toBeInTheDocument();
    fireEvent.click(editButton);
    const refLabel = await screen.findByLabelText("Referencia");
    expect(refLabel).toBeInTheDocument();
    expect(refLabel.value).toBe("REF001");
    const cancelButton = screen.getByRole("button", {
      name: "Cancelar",
    });
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    const refAgain = screen.getByText(/REF001/i);
    expect(refAgain).toBeInTheDocument();
  });
  it("click on save", async () => {
    mockGetAction(200);
    mockPutAction(200);
    render(<ArticleDetailsMock />);

    const ref = await screen.findByText(/REF001/i);
    const editButton = screen.getByRole("button", {
      name: "Editar",
    });

    expect(editButton).toBeInTheDocument();
    expect(ref).toBeInTheDocument();
    fireEvent.click(editButton);
    const refLabel = await screen.findByLabelText("Referencia");
    expect(refLabel).toBeInTheDocument();
    expect(refLabel.value).toBe("REF001");
    fireEvent.change(refLabel, { target: { value: "REF002" } });
    const saveButton = screen.getByRole("button", {
      name: "Salvar",
    });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    const refAgain = await screen.findByText(/REF002/i);
    expect(refAgain).toBeInTheDocument();
    const successMessage = await screen.findByText(
      "cambio guardado correctamente"
    );
    expect(successMessage).toBeInTheDocument();
  });
  it("click on save button and fail and retry correcly", async () => {
    mockGetAction(200);
    mockPutAction(500);
    render(<ArticleDetailsMock />);

    const ref = await screen.findByText(/REF001/i);
    const editButton = screen.getByRole("button", {
      name: "Editar",
    });

    expect(editButton).toBeInTheDocument();
    expect(ref).toBeInTheDocument();
    fireEvent.click(editButton);
    const refLabel = await screen.findByLabelText("Referencia");
    expect(refLabel).toBeInTheDocument();
    expect(refLabel.value).toBe("REF001");
    fireEvent.change(refLabel, { target: { value: "REF002" } });
    const saveButton = screen.getByRole("button", {
      name: "Salvar",
    });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);
    const errorMessage = await screen.findByText(
      "error al guardar los cambios, inténtelo de nuevo"
    );
    const refAgain = screen.queryByText(/REF002/i);
    expect(errorMessage).toBeInTheDocument();
    expect(refAgain).not.toBeInTheDocument();
    expect(refLabel).toBeInTheDocument();
    mockPutAction(200);
    const retryButton = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(retryButton);
    const successMessage = await screen.findByText(
      "cambio guardado correctamente"
    );

    expect(successMessage).toBeInTheDocument();
  });
});
