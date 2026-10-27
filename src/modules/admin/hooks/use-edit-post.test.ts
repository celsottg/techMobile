import { act, renderHook } from "@testing-library/react-native";

import { updatePost, usePost } from "@/modules/posts";
import { ApiError } from "@/shared/api/http-client";
import { makePost } from "@/test/fixtures";

import { useEditPost } from "./use-edit-post";

jest.mock("@/modules/posts", () => ({ updatePost: jest.fn(), usePost: jest.fn() }));

const updatePostMock = jest.mocked(updatePost);
const usePostMock = jest.mocked(usePost);
const post = makePost({ id: 3, titulo: "Título atual", conteudo: "Conteúdo atual" });

function loaded(overrides: Partial<ReturnType<typeof usePost>> = {}) {
  usePostMock.mockReturnValue({
    post,
    status: "success",
    error: null,
    retry: jest.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  jest.resetAllMocks();
  loaded();
});

describe("useEditPost", () => {
  it("preenche os campos com o post carregado", async () => {
    const { result } = await renderHook(() => useEditPost("3", jest.fn()));

    expect(usePostMock).toHaveBeenCalledWith("3");
    expect(result.current.titulo).toBe("Título atual");
    expect(result.current.conteudo).toBe("Conteúdo atual");
  });

  it("começa vazio enquanto o post carrega", async () => {
    loaded({ post: null, status: "loading" });

    const { result } = await renderHook(() => useEditPost("3", jest.fn()));

    expect(result.current.status).toBe("loading");
    expect(result.current.titulo).toBe("");
    expect(result.current.conteudo).toBe("");
  });

  it("não envia sem post carregado", async () => {
    loaded({ post: null, status: "loading" });
    const { result } = await renderHook(() => useEditPost("3", jest.fn()));

    await act(async () => result.current.submit());

    expect(updatePostMock).not.toHaveBeenCalled();
  });

  it("permite alterar um campo e mantém o outro", async () => {
    const { result } = await renderHook(() => useEditPost("3", jest.fn()));

    await act(async () => result.current.changeField("titulo", "Novo título"));

    expect(result.current.titulo).toBe("Novo título");
    expect(result.current.conteudo).toBe("Conteúdo atual");
  });

  it("valida campos apagados sem chamar a API", async () => {
    const { result } = await renderHook(() => useEditPost("3", jest.fn()));
    await act(async () => result.current.changeField("titulo", "  "));
    await act(async () => result.current.changeField("conteudo", ""));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      titulo: "Informe o título.",
      conteudo: "Informe o conteúdo.",
    });
    expect(updatePostMock).not.toHaveBeenCalled();
  });

  it("salva as alterações e avisa onUpdated", async () => {
    const updated = makePost({ id: 3, titulo: "Novo título" });
    updatePostMock.mockResolvedValue(updated);
    const onUpdated = jest.fn();
    const { result } = await renderHook(() => useEditPost("3", onUpdated));
    await act(async () => result.current.changeField("titulo", "  Novo título "));

    await act(async () => result.current.submit());

    expect(updatePostMock).toHaveBeenCalledWith(3, {
      titulo: "Novo título",
      conteudo: "Conteúdo atual",
    });
    expect(onUpdated).toHaveBeenCalledWith(updated);
  });

  it("destaca os campos inválidos em 400", async () => {
    updatePostMock.mockRejectedValue(new ApiError(400, "Requisição inválida.", { titulo: ["x"] }));
    const { result } = await renderHook(() => useEditPost("3", jest.fn()));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      titulo: "Verifique o título informado.",
      conteudo: undefined,
    });
    expect(result.current.formError).toBe("Verifique os campos e tente novamente.");
    expect(result.current.isSubmitting).toBe(false);
  });

  it.each([
    [new ApiError(404, "Recurso não encontrado."), "Este post não existe mais."],
    [new ApiError(403, "Você não tem permissão para esta operação."), "Você não tem permissão para esta operação."],
    [new Error("boom"), "Erro inesperado ao salvar o post."],
  ])("mostra o erro dos demais casos", async (error, message) => {
    updatePostMock.mockRejectedValue(error);
    const onUpdated = jest.fn();
    const { result } = await renderHook(() => useEditPost("3", onUpdated));

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe(message);
    expect(onUpdated).not.toHaveBeenCalled();
  });
});
