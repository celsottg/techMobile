import { httpPost } from "@/shared/api/http-client";

import type { CreateProfessorInput, Professor } from "../types";

// Só PROFESSOR (o backend responde 403 para ALUNO e 409 se o email já estiver em uso).
export function createProfessor(input: CreateProfessorInput) {
  return httpPost<Professor>("/professores", input);
}
