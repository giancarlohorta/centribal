import { fireEvent, render, screen } from "@testing-library/react";
import OrderItem from "./OrderItem";
import mockResult from "../../constants/mock";

describe("OrderItem", () => {
  it("render all on the component", () => {
    render(<OrderItem item={mockResult.resultOrders[0].items[0]} />);
    const ref = screen.getByText("REF123");
    const name = screen.getByText("Artículo 1a");
    const description = screen.getByText("Descripción del artículo 1");
    const quantity = screen.getByText("2");
    const price = screen.getByText("11,00 €");
    const deleteButton = screen.queryByRole("button", { name: "Borrar" });
    expect(ref).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(quantity).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
  });
  it("render all on the component when we can edit", () => {
    render(<OrderItem item={mockResult.resultOrders[0].items[0]} edit />);
    const ref = screen.getByText("REF123");
    const name = screen.getByText("Artículo 1a");
    const description = screen.getByText("Descripción del artículo 1");
    const quantity = screen.getByText("2");
    const price = screen.getByText("11,00 €");
    const deleteButton = screen.getByRole("button", { name: "Borrar" });
    expect(ref).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(quantity).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });
  it("render all on the component when we can edit with add actions", () => {
    render(
      <OrderItem item={mockResult.resultOrders[0].items[0]} edit addActions />
    );
    const ref = screen.getByText("REF123");
    const name = screen.getByText("Artículo 1a");
    const description = screen.getByText("Descripción del artículo 1");
    const quantitySelect = screen.getByRole("combobox");
    const price = screen.getByText("11,00 €");
    const deleteButton = screen.queryByRole("button", { name: "Borrar" });
    const addButton = screen.getByRole("button", { name: "Agregar" });

    expect(ref).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(quantitySelect).toBeInTheDocument();
    expect(quantitySelect).toHaveTextContent(/1/i);
    expect(price).toBeInTheDocument();
    expect(deleteButton).not.toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
  });
  it("click on delete article", () => {
    const mockOnClick = jest.fn((id, selectedQuantity) => {
      return `id: ${id} and quantity: ${selectedQuantity}`;
    });

    render(
      <OrderItem
        item={mockResult.resultOrders[0].items[0]}
        edit
        onClick={mockOnClick}
      />
    );

    const deleteButton = screen.getByRole("button", { name: "Borrar" });

    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick.mock.results[0].value).toBe("id: 1 and quantity: 2");
  });
  it("click on add article", async () => {
    const mockOnClick = jest.fn((id, selectedQuantity) => {
      return `id: ${id} and quantity: ${selectedQuantity}`;
    });

    render(
      <OrderItem
        item={mockResult.resultOrders[0].items[0]}
        edit
        addActions
        onClick={mockOnClick}
      />
    );
    const addButton = screen.getByRole("button", { name: "Agregar" });
    const quantitySelect = screen.getByRole("combobox");
    expect(quantitySelect).toBeInTheDocument();
    expect(quantitySelect).toHaveTextContent(/1/i);
    const dropdownButton = screen.getByRole("combobox");
    expect(dropdownButton).toBeInTheDocument();
    fireEvent.mouseDown(dropdownButton);
    const dropdownItem = await screen.findByTestId("quantity-option-2");
    fireEvent.click(dropdownItem);
    expect(dropdownItem).toBeInTheDocument();
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick.mock.results[0].value).toBe("id: 1 and quantity: 2");
  });
});
