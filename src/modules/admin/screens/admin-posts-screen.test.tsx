import { fireEvent, render, screen } from "@testing-library/react-native";

import { usePosts } from "@/modules/posts";
import { mockRouter } from "@/test/expo-router-mock";
import { makePost } from "@/test/fixtures";

import { useDeletePost } from "../hooks/use-delete-post";
import { AdminPostsScreen } from "./admin-posts-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("@/modules/posts", () => ({ usePosts: jest.fn() }));
jest.mock("../hooks/use-delete-post");

const remove = jest.fn();

const base: ReturnType<typeof usePosts> = {
  posts: [],
  total: 0,
  status: "success",
  error: null,
  search: "",
  term: "",
  isRefreshing: false,
  isLoadingMore: false,
  setSearch: jest.fn(),
  retry: jest.fn(),
  refresh: jest.fn(),
  loadMore: jest.fn(),
};

function mockPosts(overrides: Partial<ReturnType<typeof usePosts>>) {
  jest.mocked(usePosts).mockReturnValue({ ...base, ...overrides });
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useDeletePost).mockReturnValue({ deletingId: null, remove });
});

describe("AdminPostsScreen", () => {
  it("abre a criação de post", async () => {
    mockPosts({});
    await render(<AdminPostsScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Novo post" }));

    expect(mockRouter.push).toHaveBeenCalledWith("/admin/posts/create");
  });

  it("mostra o carregamento e o erro com nova tentativa", async () => {
    mockPosts({ status: "loading" });
    const { rerender } = await render(<AdminPostsScreen />);
    expect(screen.getByText("Carregando posts...")).toBeTruthy();

    const retry = jest.fn();
    mockPosts({ status: "error", error: "Falhou", retry });
    await rerender(<AdminPostsScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("mostra o estado vazio", async () => {
    mockPosts({});
    await render(<AdminPostsScreen />);

    expect(screen.getByText("Nenhum post publicado")).toBeTruthy();
  });

  it("abre a edição pelo lápis", async () => {
    mockPosts({ posts: [makePost({ id: 6, titulo: "Sexto post" })] });
    await render(<AdminPostsScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Editar Sexto post" }));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/admin/posts/[id]/edit",
      params: { id: "6" },
    });
  });

  it("exclui pela lixeira", async () => {
    const post = makePost({ id: 6, titulo: "Sexto post" });
    mockPosts({ posts: [post] });
    await render(<AdminPostsScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Excluir Sexto post" }));

    expect(remove).toHaveBeenCalledWith(post);
  });
});
