import { fireEvent, render, screen } from "@testing-library/react-native";

import { IconButton } from "./icon-button";

const pencil = { ios: "pencil", android: "edit", web: "edit" } as const;

describe("IconButton", () => {
  it("usa o rótulo para acessibilidade e chama onPress", async () => {
    const onPress = jest.fn();
    await render(<IconButton icon={pencil} label="Editar" onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("não chama onPress quando desabilitado", async () => {
    const onPress = jest.fn();
    await render(
      <IconButton icon={pencil} label="Excluir" tone="danger" onPress={onPress} disabled />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Excluir" }));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeDisabled();
  });
});
