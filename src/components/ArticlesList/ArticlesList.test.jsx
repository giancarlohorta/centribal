import { fireEvent, render, screen } from "@testing-library/react";
import ArticlesList from "./ArticlesList";
import mockResult from "../../constants/mock";
import { BrowserRouter } from "react-router-dom";

const mockOnDelete = jest.fn((id) => id);

const MockArticlesList = ({ list }) => {
  return (
    <BrowserRouter>
      <ArticlesList list={list} onDelete={mockOnDelete} />
    </BrowserRouter>
  );
};

describe("ArticlesList", () => {
  it("render all on the component", () => {
    render(<MockArticlesList list={mockResult.resultArticles} />);
    const refTitle = screen.getByText("Referencia");
    const nameTitle = screen.getByText("Nombre");
    const priceTitle = screen.getByText("Precio sin impuestos");
    const actionTitle = screen.getByText("Acciones");
    const firstName = screen.getByText("Giancarlo");
    const firstRef = screen.getByText("REF001");
    const firstPrice = screen.getByText("21,00 €");
    const secondName = screen.getByText("Jorge");
    const secondeRef = screen.getByText("REF002");
    const secondPrice = screen.getByText("10,00 €");
    const detailsButtons = screen.getAllByRole("link", {
      name: "Ver Detalles",
    });
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
  it("click on delete button the line", () => {
    render(<MockArticlesList list={mockResult.resultArticles} />);

    const deleteButtons = screen.getAllByRole("button", {
      name: "Borrar",
    });
    expect(deleteButtons[0]).toBeInTheDocument();
    expect(deleteButtons[1]).toBeInTheDocument();
    fireEvent.click(deleteButtons[0]);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete.mock.results[0].value).toBe("2e52");
    fireEvent.click(deleteButtons[1]);
    expect(mockOnDelete).toHaveBeenCalledTimes(2);
    expect(mockOnDelete.mock.results[1].value).toBe("3d1c");
  });
});
