import { act, renderHook, waitFor } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";

import { notifyProfessoresChanged } from "../services/professores-changes";
import { fetchProfessores } from "../services/professores.api";
import { useProfessores } from "./use-professores";

jest.mock("../services/professores.api");

const fetchMock = jest.mocked(fetchProfessores);

function makeProfessor(id: number) {
  return { id, nome: `Professor ${id}`, email: `p${id}@professor.fiap.br` };
}

function page(ids: number[], pageNumber: number, total: number) {
  return { professores: ids.map(makeProfessor), page: pageNumber, limit: 10, total };
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useProfessores", () => {
  it("começa carregando e carrega a primeira página", async () => {
    const first = page([1, 2], 1, 2);
    let resolve: (value: typeof first) => void = () => undefined;
    fetchMock.mockReturnValue(new Promise((r) => (resolve = r)));

    const { result } = await renderHook(() => useProfessores());
    expect(result.current.status).toBe("loading");

    await act(async () => resolve(first));

    expect(result.current.status).toBe("success");
    expect(result.current.professores.map((p) => p.id)).toEqual([1, 2]);
    expect(fetchMock).toHaveBeenCalledWith(1, 10);
  });

  it("mostra o erro e permite tentar de novo", async () => {
    fetchMock.mockRejectedValueOnce(new ApiError(403, "Você não tem permissão para esta operação."));
    const { result } = await renderHook(() => useProfessores());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Você não tem permissão para esta operação.");

    fetchMock.mockResolvedValue(page([1], 1, 1));
    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("success"));
    expect(result.current.error).toBeNull();
  });

  it("usa mensagem genérica para erros inesperados", async () => {
    fetchMock.mockRejectedValue(new Error("boom"));

    const { result } = await renderHook(() => useProfessores());

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Erro inesperado ao carregar os professores.");
  });

  it("carrega mais páginas sem duplicar professores", async () => {
    fetchMock.mockResolvedValueOnce(page([1, 2], 1, 3));
    const { result } = await renderHook(() => useProfessores());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchMock.mockResolvedValueOnce(page([2, 3], 2, 3));
    await act(async () => result.current.loadMore());

    expect(result.current.professores.map((p) => p.id)).toEqual([1, 2, 3]);
    expect(fetchMock).toHaveBeenLastCalledWith(2, 10);
  });

  it("não carrega mais quando todos já foram carregados", async () => {
    fetchMock.mockResolvedValue(page([1], 1, 1));
    const { result } = await renderHook(() => useProfessores());
    await waitFor(() => expect(result.current.status).toBe("success"));

    await act(async () => result.current.loadMore());

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("mantém a lista quando carregar mais falha", async () => {
    fetchMock.mockResolvedValueOnce(page([1], 1, 2));
    const { result } = await renderHook(() => useProfessores());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchMock.mockRejectedValueOnce(new Error("falhou"));
    await act(async () => result.current.loadMore());

    expect(result.current.status).toBe("success");
    expect(result.current.professores).toHaveLength(1);
    expect(result.current.isLoadingMore).toBe(false);
  });

  it("refresh recarrega a lista mantendo-a visível", async () => {
    fetchMock.mockResolvedValue(page([1], 1, 1));
    const { result } = await renderHook(() => useProfessores());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchMock.mockResolvedValue(page([9], 1, 1));
    await act(async () => result.current.refresh());

    await waitFor(() => expect(result.current.professores[0].id).toBe(9));
    expect(result.current.status).toBe("success");
    expect(result.current.isRefreshing).toBe(false);
  });

  it("recarrega quando um professor é cadastrado", async () => {
    fetchMock.mockResolvedValue(page([1], 1, 1));
    const { result } = await renderHook(() => useProfessores());
    await waitFor(() => expect(result.current.status).toBe("success"));

    fetchMock.mockResolvedValue(page([2, 1], 1, 2));
    await act(async () => notifyProfessoresChanged());

    await waitFor(() => expect(result.current.professores.map((p) => p.id)).toEqual([2, 1]));
  });
});
