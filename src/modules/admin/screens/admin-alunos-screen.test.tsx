import { fireEvent, render, screen } from "@testing-library/react-native";

import { useAlunos } from "../hooks/use-alunos";
import { AdminAlunosScreen } from "./admin-alunos-screen";

jest.mock("../hooks/use-alunos");

const base: ReturnType<typeof useAlunos> = {
  alunos: [],
  total: 0,
  status: "success",
  error: null,
  isRefreshing: false,
  isLoadingMore: false,
  retry: jest.fn(),
  refresh: jest.fn(),
  loadMore: jest.fn(),
};

function mockAlunos(overrides: Partial<ReturnType<typeof useAlunos>>) {
  jest.mocked(useAlunos).mockReturnValue({ ...base, ...overrides });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AdminAlunosScreen", () => {
  it("mostra o carregamento e o erro com nova tentativa", async () => {
    mockAlunos({ status: "loading" });
    const { rerender } = await render(<AdminAlunosScreen />);
    expect(screen.getByText("Carregando alunos...")).toBeTruthy();

    const retry = jest.fn();
    mockAlunos({ status: "error", error: "Falhou", retry });
    await rerender(<AdminAlunosScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("mostra o estado vazio", async () => {
    mockAlunos({});
    await render(<AdminAlunosScreen />);

    expect(screen.getByText("Nenhum aluno cadastrado")).toBeTruthy();
  });

  it("lista os alunos com nome e email", async () => {
    mockAlunos({
      alunos: [{ id: 2, nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" }],
    });
    await render(<AdminAlunosScreen />);

    expect(screen.getByText("Ana Beatriz Silva")).toBeTruthy();
    expect(screen.getByText("ana.beatriz@aluno.fiap.br")).toBeTruthy();
  });
});
