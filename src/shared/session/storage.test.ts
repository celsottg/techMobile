import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { readSession, writeSession } from "./storage";
import type { Session } from "./types";

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const secureStore = jest.mocked(SecureStore);

const session: Session = {
  token: "t",
  role: "PROFESSOR",
  usuario: { id: 1, nome: "Carlos", email: "carlos@professor.fiap.br" },
};

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

describe("storage (nativo)", () => {
  it("lê e converte a sessão salva no secure-store", async () => {
    secureStore.getItemAsync.mockResolvedValue(JSON.stringify(session));

    await expect(readSession()).resolves.toEqual(session);
  });

  it("devolve null quando não há sessão salva", async () => {
    secureStore.getItemAsync.mockResolvedValue(null);

    await expect(readSession()).resolves.toBeNull();
  });

  it("devolve null quando o conteúdo salvo está corrompido", async () => {
    secureStore.getItemAsync.mockResolvedValue("{nao-e-json");

    await expect(readSession()).resolves.toBeNull();
  });

  it("grava e apaga a sessão", async () => {
    await writeSession(session);
    expect(secureStore.setItemAsync).toHaveBeenCalledWith(
      "techmobile.session",
      JSON.stringify(session),
    );

    await writeSession(null);
    expect(secureStore.deleteItemAsync).toHaveBeenCalledWith("techmobile.session");
  });
});

describe("storage (web)", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    jest.replaceProperty(Platform, "OS", "web");
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        localStorage: {
          getItem: (key: string) => store.get(key) ?? null,
          setItem: (key: string, value: string) => store.set(key, value),
          removeItem: (key: string) => store.delete(key),
        },
      },
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("grava, lê e apaga a sessão no localStorage", async () => {
    await writeSession(session);
    await expect(readSession()).resolves.toEqual(session);

    await writeSession(null);
    await expect(readSession()).resolves.toBeNull();
    expect(secureStore.getItemAsync).not.toHaveBeenCalled();
  });
});
