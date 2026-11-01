import { act, renderHook } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";

import { createAluno } from "../services/alunos.api";
import { useCreateAluno } from "./use-create-aluno";

jest.mock("../services/alunos.api", () => ({ createAluno: jest.fn() }));

const createAlunoMock = jest.mocked(createAluno);
const aluno = { id: 3, nome: "Marina Souza", email: "marina@aluno.fiap.br" };

async function fill(
  result: { current: ReturnType<typeof useCreateAluno> },
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

describe("useCreateAluno", () => {
  it("valida campos vazios sem chamar a API", async () => {
    const { result } = await renderHook(() => useCreateAluno(jest.fn()));
    await fill(result, "  ", "", "");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      nome: "Informe o nome.",
      email: "Informe o email.",
      senha: "Informe a senha.",
    });
    expect(createAlunoMock).not.toHaveBeenCalled();
  });

  it("valida formato do email e tamanho da senha", async () => {
    const { result } = await renderHook(() => useCreateAluno(jest.fn()));
    await fill(result, "Marina", "marina", "123");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      email: "Informe um email válido.",
      senha: "A senha deve ter no mínimo 6 caracteres.",
    });
    expect(createAlunoMock).not.toHaveBeenCalled();
  });

  it("cadastra com nome e email aparados e avisa onCreated", async () => {
    createAlunoMock.mockResolvedValue(aluno);
    const onCreated = jest.fn();
    const { result } = await renderHook(() => useCreateAluno(onCreated));
    await fill(result, "  Marina Souza ", " marina@aluno.fiap.br ", "senha-123");

    await act(async () => result.current.submit());

    expect(createAlunoMock).toHaveBeenCalledWith({
      nome: "Marina Souza",
      email: "marina@aluno.fiap.br",
      senha: "senha-123",
    });
    expect(onCreated).toHaveBeenCalledWith(aluno);
  });

  it("limpa o erro do campo ao digitar", async () => {
    const { result } = await renderHook(() => useCreateAluno(jest.fn()));
    await act(async () => result.current.submit());
    expect(result.current.fieldErrors.nome).toBe("Informe o nome.");

    await act(async () => result.current.changeField("nome", "M"));

    expect(result.current.fieldErrors.nome).toBeUndefined();
  });

  it("não envia duas vezes enquanto está enviando", async () => {
    let resolve: (value: typeof aluno) => void = () => undefined;
    createAlunoMock.mockReturnValue(new Promise((r) => (resolve = r)));
    const { result } = await renderHook(() => useCreateAluno(jest.fn()));
    await fill(result, "Marina", "marina@aluno.fiap.br", "senha-123");

    await act(async () => {
      result.current.submit();
    });
    expect(result.current.isSubmitting).toBe(true);
    await act(async () => result.current.submit());
    await act(async () => resolve(aluno));

    expect(createAlunoMock).toHaveBeenCalledTimes(1);
  });

  it("destaca os campos inválidos em 400", async () => {
    createAlunoMock.mockRejectedValue(
      new ApiError(400, "Requisição inválida.", { nome: ["x"], senha: ["y"] }),
    );
    const { result } = await renderHook(() => useCreateAluno(jest.fn()));
    await fill(result, "Marina", "marina@aluno.fiap.br", "senha-123");

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
    createAlunoMock.mockRejectedValue(new ApiError(409, "Erro no servidor."));
    const { result } = await renderHook(() => useCreateAluno(jest.fn()));
    await fill(result, "Marina", "marina@aluno.fiap.br", "senha-123");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.email).toBe("Este email já está em uso.");
    expect(result.current.isSubmitting).toBe(false);
  });

  it.each([
    [
      new ApiError(403, "Você não tem permissão para esta operação."),
      "Você não tem permissão para esta operação.",
    ],
    [new Error("boom"), "Erro inesperado ao cadastrar o aluno."],
  ])("mostra o erro dos demais casos", async (error, message) => {
    createAlunoMock.mockRejectedValue(error);
    const onCreated = jest.fn();
    const { result } = await renderHook(() => useCreateAluno(onCreated));
    await fill(result, "Marina", "marina@aluno.fiap.br", "senha-123");

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe(message);
    expect(onCreated).not.toHaveBeenCalled();
  });
});
