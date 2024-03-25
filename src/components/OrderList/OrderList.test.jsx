import React from "react";
import { render, screen } from "@testing-library/react";
import OrderList from "./OrderList";
import mockResult from "../../constants/mock";

describe("OrderList", () => {
  it("render all on the component", () => {
    render(<OrderList list={mockResult.resultOrders[0].items} />);

    const refTitle = screen.getByText("Ref");
    const nameTitle = screen.getByText("Nombre");
    const descriptionTitle = screen.getByText("Descripción");
    const priceTitle = screen.getByText("Precio");
    const quantityTitle = screen.getByText("Cantidad");
    const actionTitle = screen.queryByText("Acción");
    const ref = screen.getByText("REF123");
    const name = screen.getByText("Artículo 1a");
    const description = screen.getByText("Descripción del artículo 1");
    const quantity = screen.getByText("2");
    const price = screen.getByText("11,00 €");
    const secondref = screen.getByText("REF001");
    const secondname = screen.getByText("Giancarlo");
    const seconddescription = screen.getByText("jorge");
    const secondquantity = screen.getByText("1");
    const secondprice = screen.getByText("21,00 €");
    const deleteButton = screen.queryByRole("button", { name: "Borrar" });

    expect(refTitle).toBeInTheDocument();
    expect(nameTitle).toBeInTheDocument();
    expect(descriptionTitle).toBeInTheDocument();
    expect(priceTitle).toBeInTheDocument();
    expect(quantityTitle).toBeInTheDocument();
    expect(actionTitle).not.toBeInTheDocument();
    expect(ref).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(quantity).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(secondref).toBeInTheDocument();
    expect(secondname).toBeInTheDocument();
    expect(seconddescription).toBeInTheDocument();
    expect(secondquantity).toBeInTheDocument();
    expect(secondprice).toBeInTheDocument();

    expect(deleteButton).not.toBeInTheDocument();
  });

  it("render all on the component to edit", () => {
    render(<OrderList list={mockResult.resultOrders[0].items} edit />);

    const refTitle = screen.getByText("Ref");
    const nameTitle = screen.getByText("Nombre");
    const descriptionTitle = screen.getByText("Descripción");
    const priceTitle = screen.getByText("Precio");
    const quantityTitle = screen.getByText("Cantidad");
    const actionTitle = screen.getByText("Acción");
    const ref = screen.getByText("REF123");
    const name = screen.getByText("Artículo 1a");
    const description = screen.getByText("Descripción del artículo 1");
    const quantity = screen.getByText("2");
    const price = screen.getByText("11,00 €");
    const secondref = screen.getByText("REF001");
    const secondname = screen.getByText("Giancarlo");
    const seconddescription = screen.getByText("jorge");
    const secondquantity = screen.getByText("1");
    const secondprice = screen.getByText("21,00 €");
    const deleteButton = screen.getAllByRole("button", { name: "Borrar" });

    expect(refTitle).toBeInTheDocument();
    expect(nameTitle).toBeInTheDocument();
    expect(descriptionTitle).toBeInTheDocument();
    expect(priceTitle).toBeInTheDocument();
    expect(quantityTitle).toBeInTheDocument();
    expect(actionTitle).toBeInTheDocument();
    expect(ref).toBeInTheDocument();
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(quantity).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(secondref).toBeInTheDocument();
    expect(secondname).toBeInTheDocument();
    expect(seconddescription).toBeInTheDocument();
    expect(secondquantity).toBeInTheDocument();
    expect(secondprice).toBeInTheDocument();
    expect(deleteButton[0]).toBeInTheDocument();
    expect(deleteButton[1]).toBeInTheDocument();
  });
});
