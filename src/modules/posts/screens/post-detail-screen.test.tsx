import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockParams, mockRouter } from "@/test/expo-router-mock";
import { makePost } from "@/test/fixtures";

import { usePost } from "../hooks/use-post";
import { PostDetailScreen } from "./post-detail-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../hooks/use-post");

const base: ReturnType<typeof usePost> = {
  post: null,
  status: "success",
  error: null,
  retry: jest.fn(),
};

function mockPost(overrides: Partial<ReturnType<typeof usePost>>) {
  jest.mocked(usePost).mockReturnValue({ ...base, ...overrides });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams.id = "1";
  mockRouter.canGoBack.mockReturnValue(true);
});

describe("PostDetailScreen", () => {
  it("busca o post pelo id da rota", async () => {
    mockPost({ status: "loading" });
    await render(<PostDetailScreen />);

    expect(usePost).toHaveBeenCalledWith("1");
    expect(screen.getByText("Carregando post...")).toBeTruthy();
  });

  it("mostra o erro e tenta de novo", async () => {
    const retry = jest.fn();
    mockPost({ status: "error", error: "Falhou", retry });
    await render(<PostDetailScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("mostra o post completo", async () => {
    mockPost({ post: makePost({ data_atualizacao: "2026-07-02T12:00:00.000Z" }) });
    await render(<PostDetailScreen />);

    expect(screen.getByRole("header", { name: "Primeiro post" })).toBeTruthy();
    expect(screen.getByText("Conteúdo do primeiro post")).toBeTruthy();
    expect(screen.getByText("Publicado em 30/06/2026 · Atualizado em 02/07/2026")).toBeTruthy();
  });

  it("volta para a tela anterior quando o post não existe", async () => {
    mockPost({ status: "not-found" });
    await render(<PostDetailScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para os posts" }));

    expect(screen.getByText("Post não encontrado")).toBeTruthy();
    expect(mockRouter.back).toHaveBeenCalledTimes(1);
  });

  it("vai para a Home quando aberto por link direto (sem histórico)", async () => {
    mockRouter.canGoBack.mockReturnValue(false);
    mockPost({ status: "not-found" });
    await render(<PostDetailScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para os posts" }));

    expect(mockRouter.replace).toHaveBeenCalledWith("/");
  });
});
