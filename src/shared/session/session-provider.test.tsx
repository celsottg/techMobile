import { act, renderHook, waitFor } from "@testing-library/react-native";
import type { PropsWithChildren } from "react";

import * as httpClient from "@/shared/api/http-client";
import { professorSession } from "@/test/fixtures";

import { SessionProvider, useSession } from "./session-provider";
import { readSession, writeSession } from "./storage";

jest.mock("./storage");

const readSessionMock = jest.mocked(readSession);
const writeSessionMock = jest.mocked(writeSession);

function wrapper({ children }: PropsWithChildren) {
  return <SessionProvider>{children}</SessionProvider>;
}

beforeEach(() => {
  jest.resetAllMocks();
  writeSessionMock.mockResolvedValue(undefined);
  jest.spyOn(httpClient, "setAccessToken");
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("SessionProvider", () => {
  it("restaura a sessão salva e repassa o token ao cliente HTTP", async () => {
    readSessionMock.mockResolvedValue(professorSession);

    const { result } = await renderHook(() => useSession(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toEqual(professorSession);
    expect(httpClient.setAccessToken).toHaveBeenCalledWith("professor-token");
  });

  it("termina de carregar sem sessão salva", async () => {
    readSessionMock.mockResolvedValue(null);

    const { result } = await renderHook(() => useSession(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it("termina de carregar mesmo se a leitura falhar", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);
    readSessionMock.mockRejectedValue(new Error("keychain indisponível"));

    const { result } = await renderHook(() => useSession(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  it("signIn guarda a sessão, persiste e repassa o token", async () => {
    readSessionMock.mockResolvedValue(null);
    const { result } = await renderHook(() => useSession(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.signIn(professorSession));

    expect(result.current.session).toEqual(professorSession);
    expect(writeSessionMock).toHaveBeenCalledWith(professorSession);
    expect(httpClient.setAccessToken).toHaveBeenLastCalledWith("professor-token");
  });

  it("signOut limpa a sessão e o token", async () => {
    readSessionMock.mockResolvedValue(professorSession);
    const { result } = await renderHook(() => useSession(), { wrapper });
    await waitFor(() => expect(result.current.session).not.toBeNull());

    await act(async () => result.current.signOut());

    expect(result.current.session).toBeNull();
    expect(writeSessionMock).toHaveBeenLastCalledWith(null);
    expect(httpClient.setAccessToken).toHaveBeenLastCalledWith(null);
  });

  it("encerra a sessão quando o backend recusa o token (401)", async () => {
    readSessionMock.mockResolvedValue(professorSession);
    const { result } = await renderHook(() => useSession(), { wrapper });
    await waitFor(() => expect(result.current.session).not.toBeNull());
    globalThis.fetch = jest.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });

    await act(async () => {
      await httpClient.httpGet("/posts").catch(() => undefined);
    });

    expect(result.current.session).toBeNull();
  });

  it("não falha o app se salvar a sessão der erro", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => undefined);
    readSessionMock.mockResolvedValue(null);
    writeSessionMock.mockRejectedValue(new Error("disco cheio"));
    const { result } = await renderHook(() => useSession(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => result.current.signIn(professorSession));

    expect(result.current.session).toEqual(professorSession);
    expect(consoleError).toHaveBeenCalled();
  });

  it("useSession fora do provider lança erro", async () => {
    jest.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(renderHook(() => useSession())).rejects.toThrow(
      "useSession deve ser usado dentro de <SessionProvider>",
    );
  });
});
