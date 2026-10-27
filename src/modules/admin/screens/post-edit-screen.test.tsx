import { fireEvent, render, screen } from "@testing-library/react-native";

import { updatePost, usePost } from "@/modules/posts";
import { mockParams, mockRouter } from "@/test/expo-router-mock";
import { makePost } from "@/test/fixtures";

import { PostEditScreen } from "./post-edit-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("@/modules/posts", () => ({ updatePost: jest.fn(), usePost: jest.fn() }));

const post = makePost({ id: 3, titulo: "Título atual", conteudo: "Conteúdo atual" });

function mockPost(overrides: Partial<ReturnType<typeof usePost>>) {
  jest.mocked(usePost).mockReturnValue({
    post,
    status: "success",
    error: null,
    retry: jest.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockParams.id = "3";
});

describe("PostEditScreen", () => {
  it("carrega o post da rota e preenche os campos", async () => {
    mockPost({});
    await render(<PostEditScreen />);

    expect(usePost).toHaveBeenCalledWith("3");
    expect(screen.getByLabelText("Título")).toHaveDisplayValue("Título atual");
    expect(screen.getByLabelText("Conteúdo")).toHaveDisplayValue("Conteúdo atual");
  });

  it("mostra o carregamento", async () => {
    mockPost({ post: null, status: "loading" });
    await render(<PostEditScreen />);

    expect(screen.getByText("Carregando post...")).toBeTruthy();
  });

  it("mostra o erro e tenta de novo", async () => {
    const retry = jest.fn();
    mockPost({ post: null, status: "error", error: "Falhou", retry });
    await render(<PostEditScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("volta para a gestão quando o post não existe", async () => {
    mockPost({ post: null, status: "not-found" });
    await render(<PostEditScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Voltar para os posts" }));

    expect(screen.getByText("Post não encontrado")).toBeTruthy();
    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/posts");
  });

  it("salva as alterações e volta para a gestão", async () => {
    mockPost({});
    jest.mocked(updatePost).mockResolvedValue(makePost({ id: 3, titulo: "Editado" }));
    await render(<PostEditScreen />);

    await fireEvent.changeText(screen.getByLabelText("Título"), "Editado");
    await fireEvent.press(screen.getByRole("button", { name: "Salvar alterações" }));

    expect(updatePost).toHaveBeenCalledWith(3, { titulo: "Editado", conteudo: "Conteúdo atual" });
    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/posts");
  });
});
