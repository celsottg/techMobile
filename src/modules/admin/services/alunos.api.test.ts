import { httpDelete, httpGet, httpPut } from "@/shared/api/http-client";

import { getAlunosVersion } from "./alunos-changes";
import { deleteAluno, fetchAluno, fetchAlunos, updateAluno } from "./alunos.api";

jest.mock("@/shared/api/http-client");

const aluno = { id: 2, nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" };

it("lista os alunos com GET /alunos paginado", async () => {
  const result = { alunos: [aluno], page: 2, limit: 10, total: 11 };
  jest.mocked(httpGet).mockResolvedValue(result);

  await expect(fetchAlunos(2, 10)).resolves.toEqual(result);
  expect(httpGet).toHaveBeenCalledWith("/alunos", { page: 2, limit: 10 });
});

it("busca um aluno com GET /alunos/:id", async () => {
  jest.mocked(httpGet).mockResolvedValue(aluno);

  await expect(fetchAluno(2)).resolves.toEqual(aluno);
  expect(httpGet).toHaveBeenCalledWith("/alunos/2");
});

it("atualiza o aluno com PUT /alunos/:id e avisa que a lista mudou", async () => {
  jest.mocked(httpPut).mockResolvedValue(aluno);
  const input = { nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" };
  const before = getAlunosVersion();

  await expect(updateAluno(2, input)).resolves.toEqual(aluno);
  expect(httpPut).toHaveBeenCalledWith("/alunos/2", input);
  expect(getAlunosVersion()).toBe(before + 1);
});

it("remove o aluno com DELETE /alunos/:id e avisa que a lista mudou", async () => {
  jest.mocked(httpDelete).mockResolvedValue(undefined);
  const before = getAlunosVersion();

  await deleteAluno(2);

  expect(httpDelete).toHaveBeenCalledWith("/alunos/2");
  expect(getAlunosVersion()).toBe(before + 1);
});
