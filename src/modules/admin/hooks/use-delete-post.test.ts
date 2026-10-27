import { act, renderHook } from "@testing-library/react-native";

import { deletePost } from "@/modules/posts";
import { ApiError } from "@/shared/api/http-client";
import { confirmDestructive, showMessage } from "@/shared/ui/dialogs";
import { makePost } from "@/test/fixtures";

import { useDeletePost } from "./use-delete-post";

jest.mock("@/modules/posts", () => ({ deletePost: jest.fn() }));
jest.mock("@/shared/ui/dialogs");

const deletePostMock = jest.mocked(deletePost);
const confirmMock = jest.mocked(confirmDestructive);
const showMessageMock = jest.mocked(showMessage);
const post = makePost({ id: 8, titulo: "Post para excluir" });

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useDeletePost", () => {
  it("pede confirmação citando o título do post", async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => result.current.remove(post));

    expect(confirmMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Excluir post",
        confirmLabel: "Excluir",
        message: expect.stringContaining('"Post para excluir"'),
      }),
    );
  });

  it("não exclui quando o usuário cancela", async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => result.current.remove(post));

    expect(deletePostMock).not.toHaveBeenCalled();
    expect(result.current.deletingId).toBeNull();
  });

  it("exclui quando o usuário confirma", async () => {
    confirmMock.mockResolvedValue(true);
    deletePostMock.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => result.current.remove(post));

    expect(deletePostMock).toHaveBeenCalledWith(8);
    expect(showMessageMock).not.toHaveBeenCalled();
    expect(result.current.deletingId).toBeNull();
  });

  it("marca o post como excluindo enquanto a requisição está em andamento", async () => {
    confirmMock.mockResolvedValue(true);
    let resolve: () => void = () => undefined;
    deletePostMock.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => {
      result.current.remove(post);
    });
    expect(result.current.deletingId).toBe(8);

    await act(async () => result.current.remove(makePost({ id: 9 })));
    expect(confirmMock).toHaveBeenCalledTimes(1);

    await act(async () => resolve());
    expect(result.current.deletingId).toBeNull();
  });

  it("avisa o usuário quando a exclusão falha", async () => {
    confirmMock.mockResolvedValue(true);
    deletePostMock.mockRejectedValue(new ApiError(403, "Você não tem permissão para esta operação."));
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => result.current.remove(post));

    expect(showMessageMock).toHaveBeenCalledWith(
      "Não foi possível excluir",
      "Você não tem permissão para esta operação.",
    );
    expect(result.current.deletingId).toBeNull();
  });

  it("usa mensagem genérica para erros inesperados", async () => {
    confirmMock.mockResolvedValue(true);
    deletePostMock.mockRejectedValue(new Error("boom"));
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => result.current.remove(post));

    expect(showMessageMock).toHaveBeenCalledWith(
      "Não foi possível excluir",
      "Erro inesperado ao excluir o post.",
    );
  });

  it("ignora 404 (o post já não existe) sem avisar", async () => {
    confirmMock.mockResolvedValue(true);
    deletePostMock.mockRejectedValue(new ApiError(404, "Recurso não encontrado."));
    const { result } = await renderHook(() => useDeletePost());

    await act(async () => result.current.remove(post));

    expect(showMessageMock).not.toHaveBeenCalled();
  });
});
