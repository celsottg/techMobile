import { DEV_ACCESS_TOKEN } from "@/shared/config/env";

// Ponto único de leitura do token. Quando o módulo de login existir, passa a
// devolver o token retornado por POST /login em vez do token de dev.
export function getAccessToken(): string | null {
  return DEV_ACCESS_TOKEN;
}
