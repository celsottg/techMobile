import { httpDelete, httpGet, httpPost, httpPut } from "@/shared/api/http-client";

import type {
  CreateProfessorInput,
  PaginatedProfessores,
  Professor,
  UpdateProfessorInput,
} from "../types";
import { notifyProfessoresChanged } from "./professores-changes";

// Só PROFESSOR (o backend responde 403 para ALUNO).
export function fetchProfessores(page: number, limit: number) {
  return httpGet<PaginatedProfessores>("/professores", { page, limit });
}

export function fetchProfessor(id: number) {
  return httpGet<Professor>(`/professores/${id}`);
}

// O backend responde 409 se o email já estiver em uso.
export async function createProfessor(input: CreateProfessorInput) {
  const professor = await httpPost<Professor>("/professores", input);
  notifyProfessoresChanged();
  return professor;
}

// O backend responde 404 se o professor não existe e 409 se o email for de outro usuário.
export async function updateProfessor(id: number, input: UpdateProfessorInput) {
  const professor = await httpPut<Professor>(`/professores/${id}`, input);
  notifyProfessoresChanged();
  return professor;
}

export async function deleteProfessor(id: number) {
  await httpDelete(`/professores/${id}`);
  notifyProfessoresChanged();
}
