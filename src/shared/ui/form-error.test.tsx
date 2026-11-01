import { render, screen } from "@testing-library/react-native";

import { FormError } from "./form-error";

it("mostra a mensagem como alerta", async () => {
  await render(<FormError message="Verifique os campos e tente novamente." />);

  expect(screen.getByRole("alert")).toBeTruthy();
  expect(screen.getByText("Verifique os campos e tente novamente.")).toBeTruthy();
});

it("não renderiza nada sem mensagem", async () => {
  await render(<FormError message={null} />);

  expect(screen.queryByRole("alert")).toBeNull();
});
