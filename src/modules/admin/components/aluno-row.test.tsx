import { fireEvent, render, screen } from "@testing-library/react-native";

import { AlunoRow } from "./aluno-row";

const aluno = { id: 1, nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" };

describe("AlunoRow", () => {
  it("mostra nome e email e aciona editar e excluir", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(
      <AlunoRow aluno={aluno} isDeleting={false} onEdit={onEdit} onDelete={onDelete} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Editar Ana Beatriz Silva" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Ana Beatriz Silva" }));

    expect(screen.getByText("Ana Beatriz Silva")).toBeTruthy();
    expect(screen.getByText("ana.beatriz@aluno.fiap.br")).toBeTruthy();
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("desabilita as ações enquanto exclui", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(<AlunoRow aluno={aluno} isDeleting onEdit={onEdit} onDelete={onDelete} />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar Ana Beatriz Silva" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Ana Beatriz Silva" }));

    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
