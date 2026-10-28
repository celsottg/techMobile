import { render, screen } from "@testing-library/react-native";

import { ProfessorRow } from "./professor-row";

it("mostra nome e email do professor", async () => {
  await render(
    <ProfessorRow professor={{ id: 1, nome: "Carlos Mendes", email: "carlos@professor.fiap.br" }} />,
  );

  expect(screen.getByText("Carlos Mendes")).toBeTruthy();
  expect(screen.getByText("carlos@professor.fiap.br")).toBeTruthy();
});
