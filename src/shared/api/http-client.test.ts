import {
  ApiError,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  setAccessToken,
  setUnauthorizedHandler,
} from "./http-client";

const fetchMock = jest.fn();

function jsonResponse(status: number, body?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (body === undefined) throw new Error("sem corpo");
      return body;
    },
  };
}

function lastRequest() {
  const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1];
  return { url: url as string, init: init as RequestInit & { headers: Record<string, string> } };
}

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock;
  setAccessToken(null);
  setUnauthorizedHandler(null);
});

describe("http-client", () => {
  it("monta a query string ignorando parâmetros indefinidos", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { ok: true }));

    await httpGet("/posts", { page: 2, search: "a b", limit: undefined });

    expect(lastRequest().url).toMatch(/\/posts\?page=2&search=a%20b$/);
    expect(lastRequest().init.method).toBe("GET");
  });

  it("envia o token Bearer quando há sessão", async () => {
    setAccessToken("abc");
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await httpGet("/posts");

    expect(lastRequest().init.headers.Authorization).toBe("Bearer abc");
  });

  it("não envia o token em rotas públicas", async () => {
    setAccessToken("abc");
    fetchMock.mockResolvedValue(jsonResponse(200, {}));

    await httpPost("/login", { email: "a" }, { authenticated: false });

    expect(lastRequest().init.headers.Authorization).toBeUndefined();
  });

  it("serializa o corpo em JSON no POST e no PUT", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 1 }));

    await httpPost("/posts", { titulo: "t" });
    expect(lastRequest().init.method).toBe("POST");
    expect(lastRequest().init.body).toBe(JSON.stringify({ titulo: "t" }));
    expect(lastRequest().init.headers["Content-Type"]).toBe("application/json");

    await httpPut("/posts/1", { titulo: "u" });
    expect(lastRequest().init.method).toBe("PUT");
    expect(lastRequest().init.body).toBe(JSON.stringify({ titulo: "u" }));
  });

  it("devolve undefined em respostas 204 (DELETE)", async () => {
    fetchMock.mockResolvedValue(jsonResponse(204));

    await expect(httpDelete("/posts/1")).resolves.toBeUndefined();
    expect(lastRequest().init.method).toBe("DELETE");
  });

  it.each([
    [400, "Requisição inválida."],
    [401, "Sessão inválida ou expirada."],
    [403, "Você não tem permissão para esta operação."],
    [404, "Recurso não encontrado."],
    [500, "Erro no servidor. Tente novamente mais tarde."],
  ])("traduz o status %i em ApiError", async (status, message) => {
    fetchMock.mockResolvedValue(jsonResponse(status, {}));

    const error = await httpGet("/posts").catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status, message });
  });

  it("repassa os erros por campo de um 400", async () => {
    fetchMock.mockResolvedValue(jsonResponse(400, { errors: { titulo: ["obrigatório"] } }));

    const error = await httpPost("/posts", {}).catch((e) => e);

    expect((error as ApiError).fieldErrors).toEqual({ titulo: ["obrigatório"] });
  });

  it("chama o handler de não autorizado em 401 autenticado", async () => {
    const onUnauthorized = jest.fn();
    setUnauthorizedHandler(onUnauthorized);
    fetchMock.mockResolvedValue(jsonResponse(401, {}));

    await httpGet("/posts").catch(() => undefined);

    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it("não chama o handler em 401 de rota pública (login)", async () => {
    const onUnauthorized = jest.fn();
    setUnauthorizedHandler(onUnauthorized);
    fetchMock.mockResolvedValue(jsonResponse(401, {}));

    await httpPost("/login", {}, { authenticated: false }).catch(() => undefined);

    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it("converte falha de rede em ApiError com status 0", async () => {
    fetchMock.mockRejectedValue(new TypeError("Network request failed"));

    const error = await httpGet("/posts").catch((e) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0, message: "Não foi possível conectar ao servidor." });
  });
});
