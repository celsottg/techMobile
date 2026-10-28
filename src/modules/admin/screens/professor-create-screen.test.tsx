import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockRouter } from "@/test/expo-router-mock";

import { createProfessor } from "../services/professores.api";
import { ProfessorCreateScreen } from "./professor-create-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../services/professores.api", () => ({ createProfessor: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("ProfessorCreateScreen", () => {
  it("mostra os erros ao cadastrar vazio", async () => {
    await render(<ProfessorCreateScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Cadastrar" }));

    expect(screen.getByText("Informe o nome.")).toBeTruthy();
    expect(screen.getByText("Informe o email.")).toBeTruthy();
    expect(screen.getByText("Informe a senha.")).toBeTruthy();
    expect(createProfessor).not.toHaveBeenCalled();
  });

  it("cadastra e volta para a lista de professores", async () => {
    jest
      .mocked(createProfessor)
      .mockResolvedValue({ id: 3, nome: "Marina Souza", email: "marina@professor.fiap.br" });
    await render(<ProfessorCreateScreen />);

    await fireEvent.changeText(screen.getByLabelText("Nome"), "Marina Souza");
    await fireEvent.changeText(screen.getByLabelText("Email"), "marina@professor.fiap.br");
    await fireEvent.changeText(screen.getByLabelText("Senha"), "senha-123");
    await fireEvent.press(screen.getByRole("button", { name: "Cadastrar" }));

    expect(createProfessor).toHaveBeenCalledWith({
      nome: "Marina Souza",
      email: "marina@professor.fiap.br",
      senha: "senha-123",
    });
    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/professores");
  });
});
