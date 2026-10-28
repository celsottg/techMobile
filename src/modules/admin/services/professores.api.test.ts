import { httpGet, httpPost } from "@/shared/api/http-client";

import { getProfessoresVersion } from "./professores-changes";
import { createProfessor, fetchProfessores } from "./professores.api";

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
