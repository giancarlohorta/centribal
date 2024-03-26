import { fireEvent, render, screen } from "@testing-library/react";
import NewArticle from "./NewArticle";
import mockResult from "../../constants/mock";
import { BrowserRouter } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mock = new MockAdapter(axios);
const mockPostAction = (status) => {
  mock.onPost("http://localhost:3000/articles").reply(status);
};

const NewArticleMock = () => {
  return (
    <BrowserRouter>
      <NewArticle />
    </BrowserRouter>
  );
};

describe("NewArticle", () => {
  it("render all on the component empty", () => {
    render(<NewArticleMock />);
    const refLabel = screen.getByLabelText("Referencia");
    const nameLabel = screen.getByLabelText("Nombre");
    const descriptionLabel = screen.getByLabelText("Descripción");
    const priceLabel = screen.getByLabelText("Precio sin impuestos");
    const taxLabel = screen.getByLabelText("Impuesto aplicable");
    const quantityLabel = screen.getByLabelText("cantidad");
    const backButton = screen.getByRole("link", { name: "Volver" });
    expect(refLabel).toBeInTheDocument();
    expect(nameLabel).toBeInTheDocument();
    expect(descriptionLabel).toBeInTheDocument();
    expect(priceLabel).toBeInTheDocument();
    expect(priceLabel.value).toBe("0");
    expect(taxLabel).toBeInTheDocument();
    expect(taxLabel.value).toBe("0");
    expect(quantityLabel).toBeInTheDocument();
    expect(quantityLabel.value).toBe("0");
    expect(backButton).toHaveAttribute("href", `/articulos`);
  });
  it("type new article on form", () => {
    render(<NewArticleMock />);
    const refLabel = screen.getByLabelText("Referencia");
    const nameLabel = screen.getByLabelText("Nombre");
    const descriptionLabel = screen.getByLabelText("Descripción");
    const priceLabel = screen.getByLabelText("Precio sin impuestos");
    const taxLabel = screen.getByLabelText("Impuesto aplicable");
    const quantityLabel = screen.getByLabelText("cantidad");
    fireEvent.change(refLabel, { target: { value: "REF002" } });
    fireEvent.change(nameLabel, { target: { value: "article" } });
    fireEvent.change(descriptionLabel, { target: { value: "article test" } });
    fireEvent.change(priceLabel, { target: { value: "300" } });
    fireEvent.change(taxLabel, { target: { value: "0.2" } });
    fireEvent.change(quantityLabel, { target: { value: "30" } });

    expect(refLabel.value).toBe("REF002");
    expect(nameLabel.value).toBe("article");
    expect(descriptionLabel.value).toBe("article test");
    expect(priceLabel.value).toBe("300");
    expect(taxLabel.value).toBe("0.2");
    expect(quantityLabel.value).toBe("30");
  });

  it("create new article success", () => {
    mockPostAction(200);
    render(<NewArticleMock />);
    const refLabel = screen.getByLabelText("Referencia");
    const nameLabel = screen.getByLabelText("Nombre");
    const descriptionLabel = screen.getByLabelText("Descripción");
    const priceLabel = screen.getByLabelText("Precio sin impuestos");
    const taxLabel = screen.getByLabelText("Impuesto aplicable");
    const quantityLabel = screen.getByLabelText("cantidad");
    fireEvent.change(refLabel, { target: { value: "REF002" } });
    fireEvent.change(nameLabel, { target: { value: "article" } });
    fireEvent.change(descriptionLabel, { target: { value: "article test" } });
    fireEvent.change(priceLabel, { target: { value: "300" } });
    fireEvent.change(taxLabel, { target: { value: "0.2" } });
    fireEvent.change(quantityLabel, { target: { value: "30" } });

    const createButton = screen.getByRole("button", {
      name: "Crear Artículo",
    });

    fireEvent.click(createButton);
  });
  it("create new article fail", async () => {
    mockPostAction(500);
    render(<NewArticleMock />);
    const refLabel = screen.getByLabelText("Referencia");
    const nameLabel = screen.getByLabelText("Nombre");
    const descriptionLabel = screen.getByLabelText("Descripción");
    const priceLabel = screen.getByLabelText("Precio sin impuestos");
    const taxLabel = screen.getByLabelText("Impuesto aplicable");
    const quantityLabel = screen.getByLabelText("cantidad");
    fireEvent.change(refLabel, { target: { value: "REF002" } });
    fireEvent.change(nameLabel, { target: { value: "article" } });
    fireEvent.change(descriptionLabel, { target: { value: "article test" } });
    fireEvent.change(priceLabel, { target: { value: "300" } });
    fireEvent.change(taxLabel, { target: { value: "0.2" } });
    fireEvent.change(quantityLabel, { target: { value: "30" } });

    const createButton = screen.getByRole("button", {
      name: "Crear Artículo",
    });

    fireEvent.click(createButton);

    const errorMessage = await screen.findByText(
      "error al crear el articulo, inténtelo de nuevo"
    );
    const retryButton = screen.getByRole("button", {
      name: "Retry",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(retryButton).toBeInTheDocument();
    mockPostAction(200);
    fireEvent.click(createButton);
  });
});
