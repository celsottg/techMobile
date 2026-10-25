import { API_URL } from "@/shared/config/env";
import { getAccessToken } from "@/shared/session";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type QueryParams = Record<string, string | number | undefined>;

function buildUrl(path: string, params?: QueryParams) {
  const query = Object.entries(params ?? {})
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  return `${API_URL}${path}${query ? `?${query}` : ""}`;
}

export async function httpGet<T>(path: string, params?: QueryParams): Promise<T> {
  const token = getAccessToken();

  let response: Response;
  try {
    response = await fetch(buildUrl(path, params), {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch {
    throw new ApiError(0, "Não foi possível conectar ao servidor.");
  }

  if (!response.ok) {
    throw new ApiError(response.status, messageForStatus(response.status));
  }

  return (await response.json()) as T;
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
