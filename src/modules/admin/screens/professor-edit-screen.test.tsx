import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockParams, mockRouter } from "@/test/expo-router-mock";

import { useEditProfessor } from "../hooks/use-edit-professor";
import { ProfessorEditScreen } from "./professor-edit-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../hooks/use-edit-professor");

const base: ReturnType<typeof useEditProfessor> = {
  status: "success",
  error: null,
  retry: jest.fn(),
  nome: "Marina Souza",
  email: "marina@professor.fiap.br",
  senha: "",
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
  changeField: jest.fn(),
  submit: jest.fn(),
};

function mockEdit(overrides: Partial<ReturnType<typeof useEditProfessor>>) {
  jest.mocked(useEditProfessor).mockReturnValue({ ...base, ...overrides });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams.id = "3";
});

describe("ProfessorEditScreen", () => {
  it("carrega o professor da rota e preenche os campos", async () => {
    mockEdit({});
    await render(<ProfessorEditScreen />);

    expect(useEditProfessor).toHaveBeenCalledWith("3", expect.any(Function));
    expect(screen.getByLabelText("Nome")).toHaveDisplayValue("Marina Souza");
    expect(screen.getByLabelText("Email")).toHaveDisplayValue("marina@professor.fiap.br");
    expect(screen.getByText("Nova senha (opcional)")).toBeTruthy();
  });

  it("salva ao tocar no botão", async () => {
    const submit = jest.fn();
    mockEdit({ submit });
    await render(<ProfessorEditScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("volta para a lista depois de salvar", async () => {
    mockEdit({});
    await render(<ProfessorEditScreen />);

    const onUpdated = jest.mocked(useEditProfessor).mock.calls[0][1];
    onUpdated({ id: 3, nome: "Marina Souza", email: "marina@professor.fiap.br" });

    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/professores");
  });

  it("mostra o carregamento", async () => {
    mockEdit({ status: "loading" });
    await render(<ProfessorEditScreen />);

    expect(screen.getByText("Carregando professor...")).toBeTruthy();
  });

  it("mostra o erro e tenta de novo", async () => {
    const retry = jest.fn();
    mockEdit({ status: "error", error: "Falhou", retry });
    await render(<ProfessorEditScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("mostra não encontrado e volta para a lista", async () => {
    mockEdit({ status: "not-found" });
    await render(<ProfessorEditScreen />);

    expect(screen.getByText("Professor não encontrado")).toBeTruthy();
    await fireEvent.press(screen.getByRole("button", { name: "Voltar para os professores" }));

    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/professores");
  });
});
