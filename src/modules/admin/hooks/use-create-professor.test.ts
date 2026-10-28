import { act, renderHook } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";

import { createProfessor } from "../services/professores.api";
import { useCreateProfessor } from "./use-create-professor";

jest.mock("../services/professores.api", () => ({ createProfessor: jest.fn() }));

const createProfessorMock = jest.mocked(createProfessor);
const professor = { id: 3, nome: "Marina Souza", email: "marina@professor.fiap.br" };

async function fill(
  result: { current: ReturnType<typeof useCreateProfessor> },
  nome: string,
  email: string,
  senha: string,
) {
  await act(async () => result.current.changeField("nome", nome));
  await act(async () => result.current.changeField("email", email));
  await act(async () => result.current.changeField("senha", senha));
}

beforeEach(() => {
  jest.resetAllMocks();
});

describe("useCreateProfessor", () => {
  it("valida campos vazios sem chamar a API", async () => {
    const { result } = await renderHook(() => useCreateProfessor(jest.fn()));
    await fill(result, "  ", "", "");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      nome: "Informe o nome.",
      email: "Informe o email.",
      senha: "Informe a senha.",
    });
    expect(createProfessorMock).not.toHaveBeenCalled();
  });

  it("valida formato do email e tamanho da senha", async () => {
    const { result } = await renderHook(() => useCreateProfessor(jest.fn()));
    await fill(result, "Marina", "marina", "123");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      email: "Informe um email válido.",
      senha: "A senha deve ter no mínimo 6 caracteres.",
    });
    expect(createProfessorMock).not.toHaveBeenCalled();
  });

  it("cadastra com nome e email aparados e avisa onCreated", async () => {
    createProfessorMock.mockResolvedValue(professor);
    const onCreated = jest.fn();
    const { result } = await renderHook(() => useCreateProfessor(onCreated));
    await fill(result, "  Marina Souza ", " marina@professor.fiap.br ", "senha-123");

    await act(async () => result.current.submit());

    expect(createProfessorMock).toHaveBeenCalledWith({
      nome: "Marina Souza",
      email: "marina@professor.fiap.br",
      senha: "senha-123",
    });
    expect(onCreated).toHaveBeenCalledWith(professor);
  });

  it("limpa o erro do campo ao digitar", async () => {
    const { result } = await renderHook(() => useCreateProfessor(jest.fn()));
    await act(async () => result.current.submit());
    expect(result.current.fieldErrors.nome).toBe("Informe o nome.");

    await act(async () => result.current.changeField("nome", "M"));

    expect(result.current.fieldErrors.nome).toBeUndefined();
  });

  it("não envia duas vezes enquanto está enviando", async () => {
    let resolve: (value: typeof professor) => void = () => undefined;
    createProfessorMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const { result } = await renderHook(() => useCreateProfessor(jest.fn()));
    await fill(result, "Marina", "marina@professor.fiap.br", "senha-123");

    await act(async () => {
      result.current.submit();
    });
    expect(result.current.isSubmitting).toBe(true);
    await act(async () => result.current.submit());
    await act(async () => resolve(professor));

    expect(createProfessorMock).toHaveBeenCalledTimes(1);
  });

  it("destaca os campos inválidos em 400", async () => {
    createProfessorMock.mockRejectedValue(
      new ApiError(400, "Requisição inválida.", { nome: ["x"], senha: ["y"] }),
    );
    const { result } = await renderHook(() => useCreateProfessor(jest.fn()));
    await fill(result, "Marina", "marina@professor.fiap.br", "senha-123");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      nome: "Verifique o nome informado.",
      email: undefined,
      senha: "Verifique a senha informada.",
    });
    expect(result.current.formError).toBe("Verifique os campos e tente novamente.");
    expect(result.current.isSubmitting).toBe(false);
  });

  it("avisa no campo de email quando ele já está em uso (409)", async () => {
    createProfessorMock.mockRejectedValue(new ApiError(409, "Erro no servidor."));
    const { result } = await renderHook(() => useCreateProfessor(jest.fn()));
    await fill(result, "Marina", "marina@professor.fiap.br", "senha-123");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.email).toBe("Este email já está em uso.");
    expect(result.current.isSubmitting).toBe(false);
  });

  it.each([
    [
      new ApiError(403, "Você não tem permissão para esta operação."),
      "Você não tem permissão para esta operação.",
    ],
    [new Error("boom"), "Erro inesperado ao cadastrar o professor."],
  ])("mostra o erro dos demais casos", async (error, message) => {
    createProfessorMock.mockRejectedValue(error);
    const onCreated = jest.fn();
    const { result } = await renderHook(() => useCreateProfessor(onCreated));
    await fill(result, "Marina", "marina@professor.fiap.br", "senha-123");

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe(message);
    expect(onCreated).not.toHaveBeenCalled();
  });
});
