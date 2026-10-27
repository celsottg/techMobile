import { fireEvent, render, screen } from "@testing-library/react-native";

import { createPost } from "@/modules/posts";
import { mockRouter } from "@/test/expo-router-mock";
import { makePost } from "@/test/fixtures";

import { PostCreateScreen } from "./post-create-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("@/modules/posts", () => ({ createPost: jest.fn() }));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("PostCreateScreen", () => {
  it("mostra os erros ao publicar vazio", async () => {
    await render(<PostCreateScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Publicar" }));

    expect(screen.getByText("Informe o título.")).toBeTruthy();
    expect(createPost).not.toHaveBeenCalled();
  });

  it("publica e volta para a Home", async () => {
    jest.mocked(createPost).mockResolvedValue(makePost());
    await render(<PostCreateScreen />);

    await fireEvent.changeText(screen.getByLabelText("Título"), "Novo post");
    await fireEvent.changeText(screen.getByLabelText("Conteúdo"), "Texto do post");
    await fireEvent.press(screen.getByRole("button", { name: "Publicar" }));

    expect(createPost).toHaveBeenCalledWith({ titulo: "Novo post", conteudo: "Texto do post" });
    expect(mockRouter.dismissTo).toHaveBeenCalledWith("/admin/posts");
    expect(mockRouter.navigate).toHaveBeenCalledWith("/");
  });
});
