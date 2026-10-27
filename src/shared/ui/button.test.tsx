import { fireEvent, render, screen } from "@testing-library/react-native";

import { Button } from "./button";

describe("Button", () => {
  it("chama onPress ao tocar", async () => {
    const onPress = jest.fn();
    await render(<Button title="Salvar" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Salvar" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("não dispara onPress enquanto carrega e fica ocupado", async () => {
    const onPress = jest.fn();
    await render(<Button title="Salvando..." onPress={onPress} loading />);
    const button = screen.getByRole("button", { name: "Salvando..." });

    await fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
    expect(button).toBeBusy();
    expect(button).toBeDisabled();
  });

  it("não dispara onPress quando desabilitado", async () => {
    const onPress = jest.fn();
    await render(<Button title="Salvar" onPress={onPress} disabled />);

    await fireEvent.press(screen.getByRole("button", { name: "Salvar" }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it("renderiza a variante secundária", async () => {
    await render(<Button title="Voltar" variant="secondary" onPress={jest.fn()} />);

    expect(screen.getByRole("button", { name: "Voltar" })).toBeEnabled();
  });
});
