import { fireEvent, render, screen } from "@testing-library/react-native";

import { useSession } from "@/shared/session";
import { professorSession } from "@/test/fixtures";

import { login } from "../services/auth.api";
import { LoginScreen } from "./login-screen";

jest.mock("../services/auth.api");
jest.mock("@/shared/session");

const signIn = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
  jest.mocked(useSession).mockReturnValue({
    session: null,
    isLoading: false,
    signIn,
    signOut: jest.fn(),
  });
});

describe("LoginScreen", () => {
  it("mostra os erros dos campos ao enviar vazio", async () => {
    await render(<LoginScreen />);

    await fireEvent.press(screen.getByRole("button", { name: "Entrar" }));

    expect(screen.getByText("Informe o e-mail.")).toBeTruthy();
    expect(screen.getByText("Informe a senha.")).toBeTruthy();
  });

  it("entra com as credenciais digitadas", async () => {
    jest.mocked(login).mockResolvedValue(professorSession);
    await render(<LoginScreen />);

    await fireEvent.changeText(screen.getByLabelText("E-mail"), "carlos.mendes@professor.fiap.br");
    await fireEvent.changeText(screen.getByLabelText("Senha"), "senha-professor-123");
    await fireEvent.press(screen.getByRole("button", { name: "Entrar" }));

    expect(login).toHaveBeenCalledWith({
      email: "carlos.mendes@professor.fiap.br",
      senha: "senha-professor-123",
    });
    expect(signIn).toHaveBeenCalledWith(professorSession);
  });
});
