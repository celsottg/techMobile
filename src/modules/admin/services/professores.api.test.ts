import { httpPost } from "@/shared/api/http-client";

import { createProfessor } from "./professores.api";

jest.mock("@/shared/api/http-client");

it("cadastra o professor com POST /professores", async () => {
  const professor = { id: 3, nome: "Marina Souza", email: "marina@professor.fiap.br" };
  jest.mocked(httpPost).mockResolvedValue(professor);
  const input = { nome: "Marina Souza", email: "marina@professor.fiap.br", senha: "senha-123" };

  await expect(createProfessor(input)).resolves.toEqual(professor);
  expect(httpPost).toHaveBeenCalledWith("/professores", input);
});
