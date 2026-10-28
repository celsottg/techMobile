import { act, renderHook, waitFor } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";

import { fetchProfessor, updateProfessor } from "../services/professores.api";
import { useEditProfessor } from "./use-edit-professor";

jest.mock("../services/professores.api", () => ({
  fetchProfessor: jest.fn(),
  updateProfessor: jest.fn(),
}));

const fetchMock = jest.mocked(fetchProfessor);
const updateMock = jest.mocked(updateProfessor);
const professor = { id: 3, nome: "Marina Souza", email: "marina@professor.fiap.br" };

async function loaded(onUpdated = jest.fn()) {
  fetchMock.mockResolvedValue(professor);
  const hook = await renderHook(() => useEditProfessor("3", onUpdated));
  await waitFor(() => expect(hook.result.current.status).toBe("success"));
  return hook;
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useEditProfessor", () => {
  it("preenche os campos com o professor carregado e deixa a senha em branco", async () => {
    const { result } = await loaded();

    expect(fetchMock).toHaveBeenCalledWith(3);
    expect(result.current.nome).toBe("Marina Souza");
    expect(result.current.email).toBe("marina@professor.fiap.br");
    expect(result.current.senha).toBe("");
  });

  it("considera não encontrado um id inválido sem buscar", async () => {
    const { result } = await renderHook(() => useEditProfessor("abc", jest.fn()));

    expect(result.current.status).toBe("not-found");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("indica não encontrado quando a API responde 404", async () => {
    fetchMock.mockRejectedValue(new ApiError(404, "Recurso não encontrado."));
    const { result } = await renderHook(() => useEditProfessor("3", jest.fn()));

    await waitFor(() => expect(result.current.status).toBe("not-found"));
  });

  it("expõe o erro de carregamento e permite tentar de novo", async () => {
    fetchMock.mockRejectedValueOnce(new ApiError(500, "Falhou"));
    const { result } = await renderHook(() => useEditProfessor("3", jest.fn()));
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Falhou");

    fetchMock.mockResolvedValue(professor);
    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe("success"));
  });

  it("usa mensagem genérica para erro inesperado ao carregar", async () => {
    fetchMock.mockRejectedValue(new Error("boom"));
    const { result } = await renderHook(() => useEditProfessor("3", jest.fn()));

    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Erro inesperado ao carregar o professor.");
  });

  it("não envia sem professor carregado", async () => {
    fetchMock.mockReturnValue(new Promise(() => undefined));
    const { result } = await renderHook(() => useEditProfessor("3", jest.fn()));

    await act(async () => result.current.submit());

    expect(updateMock).not.toHaveBeenCalled();
  });

  it("valida nome, email e senha curta sem chamar a API", async () => {
    const { result } = await loaded();
    await act(async () => result.current.changeField("nome", " "));
    await act(async () => result.current.changeField("email", "invalido"));
    await act(async () => result.current.changeField("senha", "123"));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      nome: "Informe o nome.",
      email: "Informe um email válido.",
      senha: "A senha deve ter no mínimo 6 caracteres.",
    });
    expect(updateMock).not.toHaveBeenCalled();
  });

  it("exige o email", async () => {
    const { result } = await loaded();
    await act(async () => result.current.changeField("email", ""));

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.email).toBe("Informe o email.");
  });

  it("salva sem enviar a senha quando ela fica em branco", async () => {
    updateMock.mockResolvedValue(professor);
    const onUpdated = jest.fn();
    const { result } = await loaded(onUpdated);
    await act(async () => result.current.changeField("nome", "  Marina Lima  "));

    await act(async () => result.current.submit());

    expect(updateMock).toHaveBeenCalledWith(3, {
      nome: "Marina Lima",
      email: "marina@professor.fiap.br",
    });
    expect(onUpdated).toHaveBeenCalledWith(professor);
  });

  it("envia a nova senha quando informada", async () => {
    updateMock.mockResolvedValue(professor);
    const { result } = await loaded();
    await act(async () => result.current.changeField("senha", "nova-senha"));

    await act(async () => result.current.submit());

    expect(updateMock).toHaveBeenCalledWith(3, {
      nome: "Marina Souza",
      email: "marina@professor.fiap.br",
      senha: "nova-senha",
    });
  });

  it("ignora um segundo envio enquanto salva", async () => {
    updateMock.mockReturnValue(new Promise(() => undefined));
    const { result } = await loaded();

    await act(async () => {
      result.current.submit();
    });
    await act(async () => result.current.submit());

    expect(updateMock).toHaveBeenCalledTimes(1);
    expect(result.current.isSubmitting).toBe(true);
  });

  it("mostra os erros de campo do backend em um 400", async () => {
    updateMock.mockRejectedValue(new ApiError(400, "Dados inválidos", { nome: ["x"], senha: ["y"] }));
    const { result } = await loaded();

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      nome: "Verifique o nome informado.",
      email: undefined,
      senha: "Verifique a senha informada.",
    });
    expect(result.current.formError).toBe("Verifique os campos e tente novamente.");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("indica email em uso em um 409", async () => {
    updateMock.mockRejectedValue(new ApiError(409, "Conflito"));
    const { result } = await loaded();

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.email).toBe("Este email já está em uso.");
  });

  it("avisa quando o professor não existe mais (404)", async () => {
    updateMock.mockRejectedValue(new ApiError(404, "Recurso não encontrado."));
    const { result } = await loaded();

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe("Este professor não existe mais.");
  });

  it("usa a mensagem do cliente HTTP ou uma genérica nos demais erros", async () => {
    updateMock.mockRejectedValueOnce(new ApiError(403, "Sem permissão."));
    const { result } = await loaded();
    await act(async () => result.current.submit());
    expect(result.current.formError).toBe("Sem permissão.");

    updateMock.mockRejectedValueOnce(new Error("boom"));
    await act(async () => result.current.submit());
    expect(result.current.formError).toBe("Erro inesperado ao salvar o professor.");
  });
});
