import { fireEvent, render, screen } from "@testing-library/react-native";

import { makePost } from "@/test/fixtures";

import { AdminPostRow } from "./admin-post-row";

const post = makePost({ titulo: "Meu post" });

describe("AdminPostRow", () => {
  it("mostra o título e aciona editar e excluir", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(<AdminPostRow post={post} isDeleting={false} onEdit={onEdit} onDelete={onDelete} />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar Meu post" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Meu post" }));

    expect(screen.getByText("Meu post")).toBeTruthy();
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("desabilita as ações enquanto exclui", async () => {
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    await render(<AdminPostRow post={post} isDeleting onEdit={onEdit} onDelete={onDelete} />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar Meu post" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Meu post" }));

    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });
});
