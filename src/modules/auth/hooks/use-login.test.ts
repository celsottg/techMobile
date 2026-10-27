import { act, renderHook } from "@testing-library/react-native";

import { ApiError } from "@/shared/api/http-client";
import { useSession } from "@/shared/session";
import { professorSession } from "@/test/fixtures";

import { login } from "../services/auth.api";
import { useLogin } from "./use-login";

jest.mock("../services/auth.api");
jest.mock("@/shared/session");

const loginMock = jest.mocked(login);
const signIn = jest.fn();

async function fill(result: { current: ReturnType<typeof useLogin> }, email: string, senha: string) {
  await act(async () => result.current.changeField("email", email));
  await act(async () => result.current.changeField("senha", senha));
}

beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(useSession).mockReturnValue({
    session: null,
    isLoading: false,
    signIn,
    signOut: jest.fn(),
  });
});

describe("useLogin", () => {
  it("valida campos vazios sem chamar a API", async () => {
    const { result } = await renderHook(() => useLogin());

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      email: "Informe o e-mail.",
      senha: "Informe a senha.",
    });
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("valida o formato do e-mail", async () => {
    const { result } = await renderHook(() => useLogin());
    await fill(result, "sem-arroba", "123");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors.email).toBe("Informe um e-mail válido.");
    expect(loginMock).not.toHaveBeenCalled();
  });

  it("entra com e-mail sem espaços e grava a sessão", async () => {
    loginMock.mockResolvedValue(professorSession);
    const { result } = await renderHook(() => useLogin());
    await fill(result, "  carlos.mendes@professor.fiap.br ", "senha-professor-123");

    await act(async () => result.current.submit());

    expect(loginMock).toHaveBeenCalledWith({
      email: "carlos.mendes@professor.fiap.br",
      senha: "senha-professor-123",
    });
    expect(signIn).toHaveBeenCalledWith(professorSession);
  });

  it("mostra mensagem genérica em 401", async () => {
    loginMock.mockRejectedValue(new ApiError(401, "Sessão inválida ou expirada."));
    const { result } = await renderHook(() => useLogin());
    await fill(result, "a@b.com", "errada");

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe("E-mail ou senha inválidos.");
    expect(result.current.isSubmitting).toBe(false);
    expect(signIn).not.toHaveBeenCalled();
  });

  it("destaca os campos inválidos em 400", async () => {
    loginMock.mockRejectedValue(
      new ApiError(400, "Requisição inválida.", { email: ["inválido"], senha: ["vazia"] }),
    );
    const { result } = await renderHook(() => useLogin());
    await fill(result, "a@b.com", "x");

    await act(async () => result.current.submit());

    expect(result.current.fieldErrors).toEqual({
      email: "Verifique o e-mail informado.",
      senha: "Verifique a senha informada.",
    });
    expect(result.current.formError).toBe("Verifique os campos e tente novamente.");
  });

  it.each([
    [new ApiError(0, "Não foi possível conectar ao servidor."), "Não foi possível conectar ao servidor."],
    [new Error("boom"), "Erro inesperado ao entrar."],
  ])("mostra o erro dos demais casos", async (error, message) => {
    loginMock.mockRejectedValue(error);
    const { result } = await renderHook(() => useLogin());
    await fill(result, "a@b.com", "x");

    await act(async () => result.current.submit());

    expect(result.current.formError).toBe(message);
  });

  it("limpa o erro do campo ao digitar", async () => {
    const { result } = await renderHook(() => useLogin());
    await act(async () => result.current.submit());
    expect(result.current.fieldErrors.email).toBeDefined();

    await act(async () => result.current.changeField("email", "a"));

    expect(result.current.fieldErrors.email).toBeUndefined();
  });
});
