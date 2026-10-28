import { httpDelete, httpGet, httpPost, httpPut } from "@/shared/api/http-client";

import { getProfessoresVersion } from "./professores-changes";
import {
  createProfessor,
  deleteProfessor,
  fetchProfessor,
  fetchProfessores,
  updateProfessor,
} from "./professores.api";

jest.mock("@/shared/api/http-client");

const professor = { id: 3, nome: "Marina Souza", email: "marina@professor.fiap.br" };

it("lista os professores com GET /professores paginado", async () => {
  const result = { professores: [professor], page: 2, limit: 10, total: 11 };
  jest.mocked(httpGet).mockResolvedValue(result);

  await expect(fetchProfessores(2, 10)).resolves.toEqual(result);
  expect(httpGet).toHaveBeenCalledWith("/professores", { page: 2, limit: 10 });
});

it("cadastra o professor com POST /professores e avisa que a lista mudou", async () => {
  jest.mocked(httpPost).mockResolvedValue(professor);
  const input = { nome: "Marina Souza", email: "marina@professor.fiap.br", senha: "senha-123" };
  const before = getProfessoresVersion();

  await expect(createProfessor(input)).resolves.toEqual(professor);
  expect(httpPost).toHaveBeenCalledWith("/professores", input);
  expect(getProfessoresVersion()).toBe(before + 1);
});

it("busca um professor com GET /professores/:id", async () => {
  jest.mocked(httpGet).mockResolvedValue(professor);

  await expect(fetchProfessor(3)).resolves.toEqual(professor);
  expect(httpGet).toHaveBeenCalledWith("/professores/3");
});

it("atualiza o professor com PUT /professores/:id e avisa que a lista mudou", async () => {
  jest.mocked(httpPut).mockResolvedValue(professor);
  const input = { nome: "Marina Souza", email: "marina@professor.fiap.br" };
  const before = getProfessoresVersion();

  await expect(updateProfessor(3, input)).resolves.toEqual(professor);
  expect(httpPut).toHaveBeenCalledWith("/professores/3", input);
  expect(getProfessoresVersion()).toBe(before + 1);
});

it("remove o professor com DELETE /professores/:id e avisa que a lista mudou", async () => {
  jest.mocked(httpDelete).mockResolvedValue(undefined);
  const before = getProfessoresVersion();

  await deleteProfessor(3);

  expect(httpDelete).toHaveBeenCalledWith("/professores/3");
  expect(getProfessoresVersion()).toBe(before + 1);
});
