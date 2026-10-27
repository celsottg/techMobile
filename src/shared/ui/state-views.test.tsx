import { fireEvent, render, screen } from "@testing-library/react-native";

import { EmptyState, ErrorState, Loading } from "./state-views";

describe("Loading", () => {
  it("mostra a mensagem informada ou a padrão", async () => {
    const { rerender } = await render(<Loading message="Carregando posts..." />);
    expect(screen.getByText("Carregando posts...")).toBeTruthy();

    await rerender(<Loading />);
    expect(screen.getByText("Carregando...")).toBeTruthy();
  });
});

describe("ErrorState", () => {
  it("mostra a mensagem e permite tentar de novo", async () => {
    const onRetry = jest.fn();
    await render(<ErrorState message="Falhou" onRetry={onRetry} />);

    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(screen.getByText("Falhou")).toBeTruthy();
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("não mostra o botão sem onRetry", async () => {
    await render(<ErrorState message="Falhou" />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("EmptyState", () => {
  it("mostra título e mensagem opcional", async () => {
    const { rerender } = await render(<EmptyState title="Vazio" message="Nada por aqui." />);
    expect(screen.getByText("Nada por aqui.")).toBeTruthy();

    await rerender(<EmptyState title="Vazio" />);
    expect(screen.getByText("Vazio")).toBeTruthy();
    expect(screen.queryByText("Nada por aqui.")).toBeNull();
  });
});
