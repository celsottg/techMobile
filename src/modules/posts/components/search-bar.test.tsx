import { fireEvent, render, screen } from "@testing-library/react-native";

import { SearchBar } from "./search-bar";

it("mostra o valor e avisa as mudanças de texto", async () => {
  const onChangeText = jest.fn();
  await render(<SearchBar value="react" onChangeText={onChangeText} />);
  const input = screen.getByPlaceholderText("Buscar por título ou conteúdo");

  await fireEvent.changeText(input, "expo");

  expect(input).toHaveDisplayValue("react");
  expect(onChangeText).toHaveBeenCalledWith("expo");
});
