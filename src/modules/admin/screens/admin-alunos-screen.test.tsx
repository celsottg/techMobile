import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockRouter } from "@/test/expo-router-mock";

import { useAlunos } from "../hooks/use-alunos";
import { useDeleteAluno } from "../hooks/use-delete-aluno";
import { AdminAlunosScreen } from "./admin-alunos-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../hooks/use-alunos");
jest.mock("../hooks/use-delete-aluno");

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

const remove = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useDeleteAluno).mockReturnValue({ deletingId: null, remove });
});

describe("AdminAlunosScreen", () => {
  it("abre o cadastro de aluno", async () => {
    mockAlunos({});
    await render(<AdminAlunosScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Novo aluno" }));

    expect(mockRouter.push).toHaveBeenCalledWith("/admin/alunos/create");
  });

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

  it("abre a edição e pede a exclusão do aluno", async () => {
    const aluno = { id: 2, nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" };
    mockAlunos({ alunos: [aluno] });
    await render(<AdminAlunosScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar Ana Beatriz Silva" }));
    await fireEvent.press(screen.getByRole("button", { name: "Excluir Ana Beatriz Silva" }));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/admin/alunos/[id]/edit",
      params: { id: "2" },
    });
    expect(remove).toHaveBeenCalledWith(aluno);
  });
});
