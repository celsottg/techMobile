import { httpPost } from "@/shared/api/http-client";
import { professorSession } from "@/test/fixtures";

import { login } from "./auth.api";

jest.mock("@/shared/api/http-client");

describe("login", () => {
  it("faz POST /login sem enviar token", async () => {
    jest.mocked(httpPost).mockResolvedValue(professorSession);
    const credentials = { email: "carlos.mendes@professor.fiap.br", senha: "senha-professor-123" };

    await expect(login(credentials)).resolves.toEqual(professorSession);

    expect(httpPost).toHaveBeenCalledWith("/login", credentials, { authenticated: false });
  });
});
