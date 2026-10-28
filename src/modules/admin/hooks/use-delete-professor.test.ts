import { act, renderHook } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";
import { confirmDestructive, showMessage } from "@/shared/ui/dialogs";

import { deleteProfessor } from "../services/professores.api";
import { useDeleteProfessor } from "./use-delete-professor";

jest.mock("../services/professores.api", () => ({ deleteProfessor: jest.fn() }));
jest.mock("@/shared/ui/dialogs");

const deleteMock = jest.mocked(deleteProfessor);
const confirmMock = jest.mocked(confirmDestructive);
const showMessageMock = jest.mocked(showMessage);
const professor = { id: 8, nome: "Marina Souza", email: "marina@professor.fiap.br" };

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useDeleteProfessor", () => {
  it("pede confirmação citando o nome do professor", async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => result.current.remove(professor));

    expect(confirmMock).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Excluir professor",
        confirmLabel: "Excluir",
        message: expect.stringContaining('"Marina Souza"'),
      }),
    );
  });

  it("não exclui quando o usuário cancela", async () => {
    confirmMock.mockResolvedValue(false);
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => result.current.remove(professor));

    expect(deleteMock).not.toHaveBeenCalled();
    expect(result.current.deletingId).toBeNull();
  });

  it("exclui quando o usuário confirma", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockResolvedValue(undefined);
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => result.current.remove(professor));

    expect(deleteMock).toHaveBeenCalledWith(8);
    expect(showMessageMock).not.toHaveBeenCalled();
    expect(result.current.deletingId).toBeNull();
  });

  it("marca o professor como excluindo enquanto a requisição está em andamento", async () => {
    confirmMock.mockResolvedValue(true);
    let resolve: () => void = () => undefined;
    deleteMock.mockReturnValue(new Promise<void>((r) => (resolve = r)));
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => {
      result.current.remove(professor);
    });
    expect(result.current.deletingId).toBe(8);

    await act(async () => result.current.remove({ ...professor, id: 9 }));
    expect(confirmMock).toHaveBeenCalledTimes(1);

    await act(async () => resolve());
    expect(result.current.deletingId).toBeNull();
  });

  it("avisa o usuário quando a exclusão falha", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockRejectedValue(new ApiError(403, "Você não tem permissão para esta operação."));
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => result.current.remove(professor));

    expect(showMessageMock).toHaveBeenCalledWith(
      "Não foi possível excluir",
      "Você não tem permissão para esta operação.",
    );
  });

  it("usa mensagem genérica para erros inesperados", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockRejectedValue(new Error("boom"));
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => result.current.remove(professor));

    expect(showMessageMock).toHaveBeenCalledWith(
      "Não foi possível excluir",
      "Erro inesperado ao excluir o professor.",
    );
  });

  it("ignora 404 (o professor já não existe) sem avisar", async () => {
    confirmMock.mockResolvedValue(true);
    deleteMock.mockRejectedValue(new ApiError(404, "Recurso não encontrado."));
    const { result } = await renderHook(() => useDeleteProfessor());

    await act(async () => result.current.remove(professor));

    expect(showMessageMock).not.toHaveBeenCalled();
  });
});
