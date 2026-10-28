import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockRouter } from "@/test/expo-router-mock";

import { useProfessores } from "../hooks/use-professores";
import { AdminProfessoresScreen } from "./admin-professores-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../hooks/use-professores");

const base: ReturnType<typeof useProfessores> = {
  professores: [],
  total: 0,
  status: "success",
  error: null,
  isRefreshing: false,
  isLoadingMore: false,
  retry: jest.fn(),
  refresh: jest.fn(),
  loadMore: jest.fn(),
};

function mockProfessores(overrides: Partial<ReturnType<typeof useProfessores>>) {
  jest.mocked(useProfessores).mockReturnValue({ ...base, ...overrides });
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("AdminProfessoresScreen", () => {
  it("abre o cadastro de professor", async () => {
    mockProfessores({});
    await render(<AdminProfessoresScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Novo professor" }));

    expect(mockRouter.push).toHaveBeenCalledWith("/admin/professores/create");
  });

  it("mostra o carregamento e o erro com nova tentativa", async () => {
    mockProfessores({ status: "loading" });
    const { rerender } = await render(<AdminProfessoresScreen />);
    expect(screen.getByText("Carregando professores...")).toBeTruthy();

    const retry = jest.fn();
    mockProfessores({ status: "error", error: "Falhou", retry });
    await rerender(<AdminProfessoresScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("mostra o estado vazio", async () => {
    mockProfessores({});
    await render(<AdminProfessoresScreen />);

    expect(screen.getByText("Nenhum professor cadastrado")).toBeTruthy();
  });

  it("lista os professores com nome e email", async () => {
    mockProfessores({
      professores: [{ id: 1, nome: "Carlos Mendes", email: "carlos@professor.fiap.br" }],
    });
    await render(<AdminProfessoresScreen />);

    expect(screen.getByText("Carlos Mendes")).toBeTruthy();
    expect(screen.getByText("carlos@professor.fiap.br")).toBeTruthy();
  });
});
