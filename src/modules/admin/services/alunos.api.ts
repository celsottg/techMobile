import { httpDelete, httpGet, httpPost, httpPut } from "@/shared/api/http-client";

import type { Aluno, CreateAlunoInput, PaginatedAlunos, UpdateAlunoInput } from "../types";
import { notifyAlunosChanged } from "./alunos-changes";

// Só PROFESSOR (o backend responde 403 para ALUNO).
export function fetchAlunos(page: number, limit: number) {
  return httpGet<PaginatedAlunos>("/alunos", { page, limit });
}

export function fetchAluno(id: number) {
  return httpGet<Aluno>(`/alunos/${id}`);
}

// O backend responde 409 se o email já estiver em uso.
export async function createAluno(input: CreateAlunoInput) {
  const aluno = await httpPost<Aluno>("/alunos", input);
  notifyAlunosChanged();
  return aluno;
}

// O backend responde 404 se o aluno não existe e 409 se o email for de outro usuário.
export async function updateAluno(id: number, input: UpdateAlunoInput) {
  const aluno = await httpPut<Aluno>(`/alunos/${id}`, input);
  notifyAlunosChanged();
  return aluno;
}

export async function deleteAluno(id: number) {
  await httpDelete(`/alunos/${id}`);
  notifyAlunosChanged();
}
