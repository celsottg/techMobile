import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockParams, mockRouter } from "@/test/expo-router-mock";

import { useEditAluno } from "../hooks/use-edit-aluno";
import { AlunoEditScreen } from "./aluno-edit-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../hooks/use-edit-aluno");

const base: ReturnType<typeof useEditAluno> = {
  status: "success",
  error: null,
  retry: jest.fn(),
  nome: "Marina Souza",
  email: "marina@aluno.fiap.br",
  senha: "",
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  changeField: jest.fn(),
  submit: jest.fn(),
};

function mockEdit(overrides: Partial<ReturnType<typeof useEditAluno>>) {
  jest.mocked(useEditAluno).mockReturnValue({ ...base, ...overrides });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams.id = "3";
});

describe("AlunoEditScreen", () => {
  it("carrega o aluno da rota e preenche os campos", async () => {
    mockEdit({});
    await render(<AlunoEditScreen />);

    expect(useEditAluno).toHaveBeenCalledWith("3", expect.any(Function));
    expect(screen.getByLabelText("Nome")).toHaveDisplayValue("Marina Souza");
    expect(screen.getByLabelText("Email")).toHaveDisplayValue("marina@aluno.fiap.br");
    expect(screen.getByText("Nova senha (opcional)")).toBeTruthy();
  });

  it("salva ao tocar no botão", async () => {
    const submit = jest.fn();
    mockEdit({ submit });
    await render(<AlunoEditScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("volta para a lista depois de salvar", async () => {
    mockEdit({});
    await render(<AlunoEditScreen />);

    const onUpdated = jest.mocked(useEditAluno).mock.calls[0][1];
    onUpdated({ id: 3, nome: "Marina Souza", email: "marina@aluno.fiap.br" });

    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/alunos");
  });

  it("mostra o carregamento", async () => {
    mockEdit({ status: "loading" });
    await render(<AlunoEditScreen />);

    expect(screen.getByText("Carregando aluno...")).toBeTruthy();
  });

  it("mostra o erro e tenta de novo", async () => {
    const retry = jest.fn();
    mockEdit({ status: "error", error: "Falhou", retry });
    await render(<AlunoEditScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("mostra não encontrado e volta para a lista", async () => {
    mockEdit({ status: "not-found" });
    await render(<AlunoEditScreen />);

    expect(screen.getByText("Aluno não encontrado")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Voltar para os alunos" }));

    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/alunos");
  });
});
