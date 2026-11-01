import { act, renderHook } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";
import { confirmDestructive, showMessage } from "@/shared/ui/dialogs";

import { deleteAluno } from "../services/alunos.api";
import { useDeleteAluno } from "./use-delete-aluno";

jest.mock("../services/alunos.api", () => ({ deleteAluno: jest.fn() }));
jest.mock("@/shared/ui/dialogs");

const deleteMock = jest.mocked(deleteAluno);
const confirmMock = jest.mocked(confirmDestructive);
const showMessageMock = jest.mocked(showMessage);
const aluno = { id: 8, nome: "Marina Souza", email: "marina@aluno.fiap.br" };

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useDeleteAluno", () => {
  it("pede confirmação citando o nome do aluno", async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => result.current.remove(aluno));

    expect(confirmMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Excluir aluno",
        confirmLabel: "Excluir",
        message: expect.stringContaining('"Marina Souza"'),
      }),
    );
  });

  it("não exclui quando o usuário cancela", async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => result.current.remove(aluno));

    expect(deleteMock).not.toHaveBeenCalled();
    expect(result.current.deletingId).toBeNull();
  });

  it("exclui quando o usuário confirma", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => result.current.remove(aluno));

    expect(deleteMock).toHaveBeenCalledWith(8);
    expect(showMessageMock).not.toHaveBeenCalled();
    expect(result.current.deletingId).toBeNull();
  });

  it("marca o aluno como excluindo enquanto a requisição está em andamento", async () => {
    confirmMock.mockResolvedValue(true);
    let resolve: () => void = () => undefined;
    deleteMock.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => {
      result.current.remove(aluno);
    });
    expect(result.current.deletingId).toBe(8);

    await act(async () => result.current.remove({ ...aluno, id: 9 }));
    expect(confirmMock).toHaveBeenCalledTimes(1);

    await act(async () => resolve());
    expect(result.current.deletingId).toBeNull();
  });

  it("avisa o usuário quando a exclusão falha", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockRejectedValue(new ApiError(403, "Você não tem permissão para esta operação."));
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => result.current.remove(aluno));

    expect(showMessageMock).toHaveBeenCalledWith(
      "Não foi possível excluir",
      "Você não tem permissão para esta operação.",
    );
  });

  it("usa mensagem genérica para erros inesperados", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockRejectedValue(new Error("boom"));
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => result.current.remove(aluno));

    expect(showMessageMock).toHaveBeenCalledWith(
      "Não foi possível excluir",
      "Erro inesperado ao excluir o aluno.",
    );
  });

  it("ignora 404 (o aluno já não existe) sem avisar", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockRejectedValue(new ApiError(404, "Recurso não encontrado."));
    const { result } = await renderHook(() => useDeleteAluno());

    await act(async () => result.current.remove(aluno));

    expect(showMessageMock).not.toHaveBeenCalled();
  });
});
