import { act, renderHook, waitFor } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";
import { makePost } from "@/test/fixtures";

import { notifyPostsChanged } from "../services/posts-changes";
import { fetchPost } from "../services/posts.api";
import { usePost } from "./use-post";

jest.mock("../services/posts.api");

const fetchPostMock = jest.mocked(fetchPost);

beforeEach(() => {
  jest.resetAllMocks();
});

describe("usePost", () => {
  it("começa carregando e carrega o post pelo id", async () => {
    const post = makePost({ id: 5 });
    let resolve: (value: typeof post) => void = () => undefined;
    fetchPostMock.mockReturnValue(new Promise((r) => (resolve = r)));

    const { result } = await renderHook(() => usePost("5"));
    expect(result.current.status).toBe("loading");
    expect(result.current.post).toBeNull();

    await act(async () => resolve(post));

    expect(result.current.status).toBe("success");
    expect(result.current.post).toEqual(post);
    expect(fetchPostMock).toHaveBeenCalledWith(5);
  });

  it("trata 404 como post não encontrado", async () => {
    fetchPostMock.mockRejectedValue(new ApiError(404, "Recurso não encontrado."));

    const { result } = await renderHook(() => usePost("5"));

    await waitFor(() => expect(result.current.status).toBe("not-found"));
    expect(result.current.post).toBeNull();
  });

  it("expõe a mensagem de outros erros da API", async () => {
    fetchPostMock.mockRejectedValue(new ApiError(500, "Erro no servidor."));

    const { result } = await renderHook(() => usePost("5"));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Erro no servidor.");
  });

  it("usa uma mensagem genérica para erros inesperados", async () => {
    fetchPostMock.mockRejectedValue(new Error("boom"));

    const { result } = await renderHook(() => usePost("5"));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Erro inesperado ao carregar o post.");
  });

  it.each([undefined, "abc", "0", "-1", "1.5"])("id inválido (%s) é não encontrado, sem buscar", async (id) => {
    const { result } = await renderHook(() => usePost(id));

    expect(result.current.status).toBe("not-found");
    expect(fetchPostMock).not.toHaveBeenCalled();
  });

  it("retry busca o post de novo", async () => {
    fetchPostMock.mockRejectedValueOnce(new ApiError(500, "Erro no servidor."));
    const { result } = await renderHook(() => usePost("5"));
    await waitFor(() => expect(result.current.status).toBe("error"));

    fetchPostMock.mockResolvedValue(makePost({ id: 5 }));
    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(fetchPostMock).toHaveBeenCalledTimes(2);
  });

  it("recarrega quando algum post muda", async () => {
    fetchPostMock.mockResolvedValue(makePost({ id: 5, titulo: "Antigo" }));
    const { result } = await renderHook(() => usePost("5"));
    await waitFor(() => expect(result.current.post?.titulo).toBe("Antigo"));

    fetchPostMock.mockResolvedValue(makePost({ id: 5, titulo: "Novo" }));
    await act(async () => notifyPostsChanged());

    await waitFor(() => expect(result.current.post?.titulo).toBe("Novo"));
  });
});
