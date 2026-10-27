import { httpDelete, httpGet, httpPost, httpPut } from "@/shared/api/http-client";
import { makePost } from "@/test/fixtures";

import { getPostsVersion } from "./posts-changes";
import { createPost, deletePost, fetchPost, fetchPosts, searchPosts, updatePost } from "./posts.api";

jest.mock("@/shared/api/http-client");

const http = {
  get: jest.mocked(httpGet),
  post: jest.mocked(httpPost),
  put: jest.mocked(httpPut),
  delete: jest.mocked(httpDelete),
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("posts.api (leitura)", () => {
  it("fetchPosts pagina em GET /posts", async () => {
    http.get.mockResolvedValue({ posts: [], page: 2, limit: 10, total: 0 });

    await fetchPosts(2, 10);

    expect(http.get).toHaveBeenCalledWith("/posts", { page: 2, limit: 10 });
  });

  it("searchPosts busca em GET /posts/search", async () => {
    http.get.mockResolvedValue({ posts: [] });

    await searchPosts("react");

    expect(http.get).toHaveBeenCalledWith("/posts/search", { search: "react" });
  });

  it("fetchPost busca em GET /posts/:id", async () => {
    http.get.mockResolvedValue(makePost({ id: 7 }));

    await fetchPost(7);

    expect(http.get).toHaveBeenCalledWith("/posts/7");
  });
});

describe("posts.api (escrita)", () => {
  const input = { titulo: "Novo", conteudo: "Texto" };

  it("createPost envia POST /posts e avisa que os posts mudaram", async () => {
    http.post.mockResolvedValue(makePost());
    const before = getPostsVersion();

    await createPost(input);

    expect(http.post).toHaveBeenCalledWith("/posts", input);
    expect(getPostsVersion()).toBe(before + 1);
  });

  it("updatePost envia PUT /posts/:id e avisa que os posts mudaram", async () => {
    http.put.mockResolvedValue(makePost({ id: 3 }));
    const before = getPostsVersion();

    await updatePost(3, input);

    expect(http.put).toHaveBeenCalledWith("/posts/3", input);
    expect(getPostsVersion()).toBe(before + 1);
  });

  it("deletePost envia DELETE /posts/:id e avisa que os posts mudaram", async () => {
    http.delete.mockResolvedValue(undefined);
    const before = getPostsVersion();

    await deletePost(3);

    expect(http.delete).toHaveBeenCalledWith("/posts/3");
    expect(getPostsVersion()).toBe(before + 1);
  });

  it("não avisa que os posts mudaram quando a escrita falha", async () => {
    http.post.mockRejectedValue(new Error("falhou"));
    const before = getPostsVersion();

    await expect(createPost(input)).rejects.toThrow("falhou");

    expect(getPostsVersion()).toBe(before);
  });
});
