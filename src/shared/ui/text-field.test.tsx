import { fireEvent, render, screen } from "@testing-library/react-native";

import { TextField } from "./text-field";

describe("TextField", () => {
  it("mostra o rótulo e repassa as props ao input", async () => {
    const onChangeText = jest.fn();
    await render(
      <TextField label="Título" value="" onChangeText={onChangeText} placeholder="Digite" />,
    );

    await fireEvent.changeText(screen.getByLabelText("Título"), "novo");

    expect(screen.getByText("Título")).toBeTruthy();
    expect(screen.getByPlaceholderText("Digite")).toBeTruthy();
    expect(onChangeText).toHaveBeenCalledWith("novo");
  });

  it("mostra a mensagem de erro", async () => {
    await render(<TextField label="Título" value="" error="Informe o título." />);

    expect(screen.getByText("Informe o título.")).toBeTruthy();
  });

  it("não mostra erro quando não há", async () => {
    await render(<TextField label="Título" value="" />);

    expect(screen.queryByText("Informe o título.")).toBeNull();
  });
});
