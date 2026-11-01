import { render, screen } from "@testing-library/react-native";

import { Badge } from "./badge";

it("mostra o rótulo nas duas variantes", async () => {
  const { rerender } = await render(<Badge label="Professor" />);
  expect(screen.getByText("Professor")).toBeTruthy();

  await rerender(<Badge label="Atualizado" variant="accent" />);
  expect(screen.getByText("Atualizado")).toBeTruthy();
});
