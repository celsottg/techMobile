import { API_URL } from "@/shared/config/env";

export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  // Erros por campo devolvidos pelo backend em respostas 400 (validação Zod).
  readonly fieldErrors?: FieldErrors;

  constructor(status: number, message: string, fieldErrors?: FieldErrors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// A sessão (shared/session) registra aqui o token atual e o que fazer quando ele é recusado,
// para que o cliente HTTP não dependa de React nem do módulo de sessão.
let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

type QueryParams = Record<string, string | number | undefined>;

type RequestOptions = {
  params?: QueryParams;
  body?: unknown;
  // Rotas públicas (ex.: POST /login) não enviam token nem disparam logout em 401.
  authenticated?: boolean;
};

function buildUrl(path: string, params?: QueryParams) {
  const query = Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  return `${API_URL}${path}${query ? `?${query}` : ""}`;
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
  const { params, body, authenticated = true } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (authenticated && accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor.");
  }

  if (!response.ok) {
    if (response.status === 401 && authenticated) onUnauthorized?.();

    const payload = await response.json().catch(() => null);
    throw new ApiError(response.status, messageForStatus(response.status), payload?.errors);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function httpGet<T>(path: string, params?: QueryParams) {
  return request<T>("GET", path, { params });
}

export function httpPost<T>(path: string, body: unknown, options?: Omit<RequestOptions, "body">) {
  return request<T>("POST", path, { ...options, body });
}

export function httpPut<T>(path: string, body: unknown) {
  return request<T>("PUT", path, { body });
}

export function httpDelete(path: string) {
  return request<void>("DELETE", path);
}

function messageForStatus(status: number) {
  switch (status) {
    case 400:
      return "Requisição inválida.";
    case 401:
      return "Sessão inválida ou expirada.";
    case 403:
      return "Você não tem permissão para esta operação.";
    case 404:
      return "Recurso não encontrado.";
    default:
      return "Erro no servidor. Tente novamente mais tarde.";
  }
}
