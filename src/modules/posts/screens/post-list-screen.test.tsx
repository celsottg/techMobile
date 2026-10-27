import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockRouter } from "@/test/expo-router-mock";
import { makePost } from "@/test/fixtures";

import { usePosts } from "../hooks/use-posts";
import { PostListScreen } from "./post-list-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("../hooks/use-posts");

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
});

describe("PostListScreen", () => {
  it("mostra o carregamento", async () => {
    mockPosts({ status: "loading" });
    await render(<PostListScreen />);

    expect(screen.getByText("Carregando posts...")).toBeTruthy();
  });

  it("mostra o erro e tenta de novo", async () => {
    const retry = jest.fn();
    mockPosts({ status: "error", error: "Falhou", retry });
    await render(<PostListScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(screen.getByText("Falhou")).toBeTruthy();
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it("lista os posts e abre o detalhe ao tocar no card", async () => {
    mockPosts({ posts: [makePost({ id: 4, titulo: "Quarto post" })], total: 1 });
    await render(<PostListScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Quarto post" }));

    expect(mockRouter.push).toHaveBeenCalledWith({
      pathname: "/posts/[id]",
      params: { id: "4" },
    });
  });

  it("mostra o estado vazio sem busca", async () => {
    mockPosts({});
    await render(<PostListScreen />);

    expect(screen.getByText("Nenhum post publicado")).toBeTruthy();
  });

  it("mostra o estado vazio de uma busca sem resultado", async () => {
    mockPosts({ term: "xyz", search: "xyz" });
    await render(<PostListScreen />);

    expect(screen.getByText('Nenhum post encontrado para "xyz".')).toBeTruthy();
  });

  it("repassa o texto digitado na busca", async () => {
    const setSearch = jest.fn();
    mockPosts({ setSearch });
    await render(<PostListScreen />);

    await fireEvent.changeText(
      screen.getByPlaceholderText("Buscar por título ou conteúdo"),
      "react",
    );

    expect(setSearch).toHaveBeenCalledWith("react");
  });
});
