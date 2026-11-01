import { httpGet } from "@/shared/api/http-client";

import type { PaginatedAlunos } from "../types";

// Só PROFESSOR (o backend responde 403 para ALUNO).
export function fetchAlunos(page: number, limit: number) {
  return httpGet<PaginatedAlunos>("/alunos", { page, limit });
}
