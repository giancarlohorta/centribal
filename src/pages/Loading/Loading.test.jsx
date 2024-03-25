import { render, screen } from "@testing-library/react";
import Loading from "../Loading";

describe("Loading", () => {
  it("test", () => {
    render(<Loading />);
    const text = screen.getByText("Carregando...");
    expect(text).toBeInTheDocument();
  });
});
