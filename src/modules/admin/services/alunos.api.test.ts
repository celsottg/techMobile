import { httpGet } from "@/shared/api/http-client";

import { fetchAlunos } from "./alunos.api";

jest.mock("@/shared/api/http-client");

it("lista os alunos com GET /alunos paginado", async () => {
  const aluno = { id: 2, nome: "Ana Beatriz Silva", email: "ana.beatriz@aluno.fiap.br" };
  const result = { alunos: [aluno], page: 2, limit: 10, total: 11 };
  jest.mocked(httpGet).mockResolvedValue(result);

  await expect(fetchAlunos(2, 10)).resolves.toEqual(result);
  expect(httpGet).toHaveBeenCalledWith("/alunos", { page: 2, limit: 10 });
});
