import { fireEvent, render, screen } from "@testing-library/react-native";

import { makePost } from "@/test/fixtures";

import { PostCard } from "./post-card";

describe("PostCard", () => {
  it("mostra título, data de publicação e conteúdo", async () => {
    await render(<PostCard post={makePost()} onPress={jest.fn()} />);

    expect(screen.getByText("Primeiro post")).toBeTruthy();
    expect(screen.getByText("Conteúdo do primeiro post")).toBeTruthy();
    expect(screen.getByText("Publicado em 30/06/2026")).toBeTruthy();
  });

  it("mostra a data de atualização só quando o post foi editado", async () => {
    const post = makePost({ data_atualizacao: "2026-07-02T12:00:00.000Z" });
    await render(<PostCard post={post} onPress={jest.fn()} />);

    expect(screen.getByText("Publicado em 30/06/2026 · Atualizado em 02/07/2026")).toBeTruthy();
  });

  it("chama onPress ao tocar no card", async () => {
    const onPress = jest.fn();
    await render(<PostCard post={makePost()} onPress={onPress} />);

    await fireEvent.press(screen.getByRole("button", { name: "Primeiro post" }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
