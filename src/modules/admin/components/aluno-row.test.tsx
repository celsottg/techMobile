import { render, screen } from "@testing-library/react-native";

import { AlunoRow } from "./aluno-row";

it("mostra nome e email do aluno", async () => {
  await render(
    <AlunoRow aluno={{ id: 2, nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" }} />,
  );

  expect(screen.getByText("Ana Beatriz Silva")).toBeTruthy();
  expect(screen.getByText("ana.beatriz@aluno.fiap.br")).toBeTruthy();
});
