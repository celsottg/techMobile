import { act, renderHook, waitFor } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";
import { makePost } from "@/test/fixtures";

import { notifyPostsChanged } from "../services/posts-changes";
import { fetchPosts, searchPosts } from "../services/posts.api";
import { usePosts } from "./use-posts";

jest.mock("../services/posts.api");

const fetchPostsMock = jest.mocked(fetchPosts);
const searchPostsMock = jest.mocked(searchPosts);

function page(posts: ReturnType<typeof makePost>[], pageNumber: number, total: number) {
  return { posts, page: pageNumber, limit: 10, total };
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("usePosts", () => {
  it("começa carregando e carrega a primeira página", async () => {
    const first = page([makePost({ id: 1 }), makePost({ id: 2 })], 1, 2);
    let resolve: (value: typeof first) => void = () => undefined;
    fetchPostsMock.mockReturnValue(new Promise((r) => (resolve = r)));

    const { result } = await renderHook(() => usePosts());
    expect(result.current.status).toBe("loading");

    await act(async () => resolve(first));

    expect(result.current.status).toBe("success");
    expect(result.current.posts.map((post) => post.id)).toEqual([1, 2]);
    expect(fetchPostsMock).toHaveBeenCalledWith(1, 10);
  });

  it("mostra o erro e permite tentar de novo", async () => {
    fetchPostsMock.mockRejectedValueOnce(new ApiError(0, "Não foi possível conectar ao servidor."));
    const { result } = await renderHook(() => usePosts());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Não foi possível conectar ao servidor.");

    fetchPostsMock.mockResolvedValue(page([makePost()], 1, 1));
    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.error).toBeNull();
  });

  it("usa mensagem genérica para erros inesperados", async () => {
    fetchPostsMock.mockRejectedValue(new Error("boom"));

    const { result } = await renderHook(() => usePosts());

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Erro inesperado ao carregar os posts.");
  });

  it("carrega mais páginas sem duplicar posts", async () => {
    fetchPostsMock.mockResolvedValueOnce(page([makePost({ id: 1 }), makePost({ id: 2 })], 1, 3));
    const { result } = await renderHook(() => usePosts());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchPostsMock.mockResolvedValueOnce(page([makePost({ id: 2 }), makePost({ id: 3 })], 2, 3));
    await act(async () => result.current.loadMore());

    expect(result.current.posts.map((post) => post.id)).toEqual([1, 2, 3]);
    expect(fetchPostsMock).toHaveBeenLastCalledWith(2, 10);
  });

  it("não carrega mais quando todos os posts já foram carregados", async () => {
    fetchPostsMock.mockResolvedValue(page([makePost({ id: 1 })], 1, 1));
    const { result } = await renderHook(() => usePosts());
    await waitFor(() => expect(result.current.status).toBe("success"));

    await act(async () => result.current.loadMore());

    expect(fetchPostsMock).toHaveBeenCalledTimes(1);
  });

  it("mantém a lista quando carregar mais falha", async () => {
    fetchPostsMock.mockResolvedValueOnce(page([makePost({ id: 1 })], 1, 2));
    const { result } = await renderHook(() => usePosts());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchPostsMock.mockRejectedValueOnce(new Error("falhou"));
    await act(async () => result.current.loadMore());

    expect(result.current.status).toBe("success");
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it("refresh recarrega a lista mantendo-a visível", async () => {
    fetchPostsMock.mockResolvedValue(page([makePost({ id: 1 })], 1, 1));
    const { result } = await renderHook(() => usePosts());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchPostsMock.mockResolvedValue(page([makePost({ id: 9 })], 1, 1));
    await act(async () => result.current.refresh());

    await waitFor(() => expect(result.current.posts[0].id).toBe(9));
    expect(result.current.status).toBe("success");
    expect(result.current.isRefreshing).toBe(false);
  });

  it("recarrega quando algum post muda", async () => {
    fetchPostsMock.mockResolvedValue(page([makePost({ id: 1 })], 1, 1));
    const { result } = await renderHook(() => usePosts());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchPostsMock.mockResolvedValue(page([makePost({ id: 2 }), makePost({ id: 1 })], 1, 2));
    await act(async () => notifyPostsChanged());

    await waitFor(() => expect(result.current.posts.map((post) => post.id)).toEqual([2, 1]));
  });

  describe("busca", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("busca por palavra-chave depois do debounce", async () => {
      fetchPostsMock.mockResolvedValue(page([makePost({ id: 1 })], 1, 1));
      searchPostsMock.mockResolvedValue({ posts: [makePost({ id: 8, titulo: "React" })] });
      const { result } = await renderHook(() => usePosts());
      await act(async () => jest.advanceTimersByTime(400));

      await act(async () => result.current.setSearch("  react "));
      expect(searchPostsMock).not.toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(400));

      expect(searchPostsMock).toHaveBeenCalledWith("react");
      expect(result.current.term).toBe("react");
      expect(result.current.posts.map((post) => post.id)).toEqual([8]);
    });

    it("não carrega mais páginas durante uma busca", async () => {
      fetchPostsMock.mockResolvedValue(page([makePost({ id: 1 })], 1, 5));
      searchPostsMock.mockResolvedValue({ posts: [makePost({ id: 8 })] });
      const { result } = await renderHook(() => usePosts());
      await act(async () => jest.advanceTimersByTime(400));
      fetchPostsMock.mockClear();

      await act(async () => result.current.setSearch("react"));
      await act(async () => jest.advanceTimersByTime(400));
      await act(async () => result.current.loadMore());

      expect(fetchPostsMock).not.toHaveBeenCalled();
    });
  });
});
