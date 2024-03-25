import { fireEvent, render, screen } from "@testing-library/react";
import ArticleForm from "./ArticleForm";
import mockResult from "../../constants/mock";

const mockOnInputChange = jest.fn((value) => value);

describe("ArticleForm", () => {
  it("render all on the component", () => {
    render(
      <ArticleForm
        editedArticle={mockResult.resultArticles[0]}
        onInputChange={mockOnInputChange}
      />
    );
    const refLabel = screen.getByLabelText("Referencia");
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
});
