import { act, renderHook } from "@testing-library/react-native";

import { createPost } from "@/modules/posts";
import { ApiError } from "@/shared/api/http-client";
import { makePost } from "@/test/fixtures";

import { useCreatePost } from "./use-create-post";

jest.mock("@/modules/posts", () => ({ createPost: jest.fn() }));

const createPostMock = jest.mocked(createPost);

async function fill(result: { current: ReturnType<typeof useCreatePost> }, titulo: string, conteudo: string) {
  await act(async () => result.current.changeField("titulo", titulo));
  await act(async () => result.current.changeField("conteudo", conteudo));
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useCreatePost", () => {
  it("valida campos vazios (ou só com espaços) sem chamar a API", async () => {
    const { result } = await renderHook(() => useCreatePost(jest.fn()));
    await fill(result, "   ", "");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      titulo: "Informe o título.",
      conteudo: "Informe o conteúdo.",
    });
    expect(createPostMock).not.toHaveBeenCalled();
  });

  it("cria o post com os textos aparados e avisa onCreated", async () => {
    const created = makePost({ id: 10 });
    createPostMock.mockResolvedValue(created);
    const onCreated = jest.fn();
    const { result } = await renderHook(() => useCreatePost(onCreated));
    await fill(result, "  Título  ", " Conteúdo ");

    await act(async () => result.current.submit());

    expect(createPostMock).toHaveBeenCalledWith({ titulo: "Título", conteudo: "Conteúdo" });
    expect(onCreated).toHaveBeenCalledWith(created);
  });

  it("não envia duas vezes enquanto está enviando", async () => {
    let resolve: (value: ReturnType<typeof makePost>) => void = () => undefined;
    createPostMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const { result } = await renderHook(() => useCreatePost(jest.fn()));
    await fill(result, "T", "C");

    await act(async () => {
      result.current.submit();
    });
    expect(result.current.isSubmitting).toBe(true);
    await act(async () => result.current.submit());
    await act(async () => resolve(makePost()));

    expect(createPostMock).toHaveBeenCalledTimes(1);
  });

  it("destaca os campos inválidos em 400", async () => {
    createPostMock.mockRejectedValue(
      new ApiError(400, "Requisição inválida.", { titulo: ["x"], conteudo: ["y"] }),
    );
    const { result } = await renderHook(() => useCreatePost(jest.fn()));
    await fill(result, "T", "C");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      titulo: "Verifique o título informado.",
      conteudo: "Verifique o conteúdo informado.",
    });
    expect(result.current.formError).toBe("Verifique os campos e tente novamente.");
    expect(result.current.isSubmitting).toBe(false);
  });

  it.each([
    [new ApiError(403, "Você não tem permissão para esta operação."), "Você não tem permissão para esta operação."],
    [new Error("boom"), "Erro inesperado ao publicar o post."],
  ])("mostra o erro dos demais casos", async (error, message) => {
    createPostMock.mockRejectedValue(error);
    const onCreated = jest.fn();
    const { result } = await renderHook(() => useCreatePost(onCreated));
    await fill(result, "T", "C");

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe(message);
    expect(onCreated).not.toHaveBeenCalled();
  });

  it("mantém o que foi digitado quando o envio falha", async () => {
    createPostMock.mockRejectedValue(new ApiError(0, "Não foi possível conectar ao servidor."));
    const { result } = await renderHook(() => useCreatePost(jest.fn()));
    await fill(result, "Meu título", "Meu conteúdo");

    await act(async () => result.current.submit());

    expect(result.current.titulo).toBe("Meu título");
    expect(result.current.conteudo).toBe("Meu conteúdo");
  });
});
