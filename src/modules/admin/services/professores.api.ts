import { httpGet, httpPost } from "@/shared/api/http-client";

import type { CreateProfessorInput, PaginatedProfessores, Professor } from "../types";
import { notifyProfessoresChanged } from "./professores-changes";

// Só PROFESSOR (o backend responde 403 para ALUNO).
export function fetchProfessores(page: number, limit: number) {
  return httpGet<PaginatedProfessores>("/professores", { page, limit });
}

// O backend responde 409 se o email já estiver em uso.
export async function createProfessor(input: CreateProfessorInput) {
  const professor = await httpPost<Professor>("/professores", input);
  notifyProfessoresChanged();
  return professor;
}
