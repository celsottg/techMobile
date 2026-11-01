import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockRouter } from "@/test/expo-router-mock";

import { createAluno } from "../services/alunos.api";
import { AlunoCreateScreen } from "./aluno-create-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../services/alunos.api", () => ({ createAluno: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AlunoCreateScreen", () => {
  it("mostra os erros ao cadastrar vazio", async () => {
    await render(<AlunoCreateScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Cadastrar" }));

    expect(screen.getByText("Informe o nome.")).toBeTruthy();
    expect(screen.getByText("Informe o email.")).toBeTruthy();
    expect(screen.getByText("Informe a senha.")).toBeTruthy();
    expect(createAluno).not.toHaveBeenCalled();
  });

  it("cadastra e volta para a lista de alunos", async () => {
    jest
      .mocked(createAluno)
      .mockResolvedValue({ id: 3, nome: "Marina Souza", email: "marina@aluno.fiap.br" });
    await render(<AlunoCreateScreen />);

    await fireEvent.changeText(screen.getByLabelText("Nome"), "Marina Souza");
    await fireEvent.changeText(screen.getByLabelText("Email"), "marina@aluno.fiap.br");
    await fireEvent.changeText(screen.getByLabelText("Senha"), "senha-123");
    await fireEvent.press(screen.getByRole("button", { name: "Cadastrar" }));

    expect(createAluno).toHaveBeenCalledWith({
      nome: "Marina Souza",
      email: "marina@aluno.fiap.br",
      senha: "senha-123",
    });
    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/alunos");
  });
});
