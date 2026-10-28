import { fireEvent, render, screen } from "@testing-library/react-native";

import { ProfessorRow } from "./professor-row";

const professor = { id: 1, nome: "Carlos Mendes", email: "carlos@professor.fiap.br" };

describe("ProfessorRow", () => {
  it("mostra nome e email e aciona editar e excluir", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(
      <ProfessorRow professor={professor} isDeleting={false} onEdit={onEdit} onDelete={onDelete} />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Editar Carlos Mendes" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Carlos Mendes" }));

    expect(screen.getByText("Carlos Mendes")).toBeTruthy();
    expect(screen.getByText("carlos@professor.fiap.br")).toBeTruthy();
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("desabilita as ações enquanto exclui", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(<ProfessorRow professor={professor} isDeleting onEdit={onEdit} onDelete={onDelete} />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar Carlos Mendes" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Carlos Mendes" }));

    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
