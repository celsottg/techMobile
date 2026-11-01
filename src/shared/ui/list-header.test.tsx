import { fireEvent, render, screen } from "@testing-library/react-native";

import { ListHeader } from "./list-header";

describe("ListHeader", () => {
  it("usa o singular para um item e o plural para os demais", async () => {
    const { rerender } = await render(<ListHeader total={1} singular="aluno" plural="alunos" />);
    expect(screen.getByText("1 aluno")).toBeTruthy();

    await rerender(<ListHeader total={0} singular="aluno" plural="alunos" />);
    expect(screen.getByText("0 alunos")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("mostra só o botão quando ainda não há total", async () => {
    await render(
      <ListHeader
        singular="aluno"
        plural="alunos"
        action={{ title: "Novo aluno", onPress: jest.fn() }}
      />,
    );

    expect(screen.queryByText("Total")).toBeNull();
    expect(screen.getByRole("button", { name: "Novo aluno" })).toBeTruthy();
  });

  it("mostra o botão de ação", async () => {
    const onPress = jest.fn();
    await render(
      <ListHeader
        total={12}
        singular="aluno"
        plural="alunos"
        action={{ title: "Novo aluno", onPress }}
      />,
    );

    await fireEvent.press(screen.getByRole("button", { name: "Novo aluno" }));

    expect(screen.getByText("12 alunos")).toBeTruthy();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
