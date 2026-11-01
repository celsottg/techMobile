import { fireEvent, render, screen } from "@testing-library/react-native";

import { useSession } from "@/shared/session";
import { mockRouter } from "@/test/expo-router-mock";
import { professorSession } from "@/test/fixtures";

import { AdminHomeScreen } from "./admin-home-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);
jest.mock("@/shared/session");

function mockSession(session: typeof professorSession | null) {
  jest.mocked(useSession).mockReturnValue({
    session,
    isLoading: false,
    signIn: jest.fn(),
    signOut: jest.fn(),
  });
}

beforeEach(() => {
  mockSession(professorSession);
});

it("cumprimenta o professor pelo primeiro nome", async () => {
  await render(<AdminHomeScreen />);

  expect(screen.getByText("Olá, Carlos")).toBeTruthy();
});

it("cumprimenta pelo nome sem o título", async () => {
  mockSession({
    ...professorSession,
    usuario: { ...professorSession.usuario, nome: "Dr. Carlos Mendes" },
  });
  await render(<AdminHomeScreen />);

  expect(screen.getByText("Olá, Carlos")).toBeTruthy();
});

it("usa uma saudação genérica sem sessão", async () => {
  mockSession(null);
  await render(<AdminHomeScreen />);

  expect(screen.getByText("Olá")).toBeTruthy();
});

it("lista as seções do admin e abre a de posts", async () => {
  await render(<AdminHomeScreen />);

  await fireEvent.press(screen.getByRole("button", { name: "Posts" }));

  expect(screen.getByText("Criar e gerenciar posts")).toBeTruthy();
  expect(mockRouter.push).toHaveBeenCalledWith("/admin/posts");
});

it("abre a lista de professores", async () => {
  await render(<AdminHomeScreen />);

  await fireEvent.press(screen.getByRole("button", { name: "Professores" }));

  expect(mockRouter.push).toHaveBeenCalledWith("/admin/professores");
});

it("abre a lista de alunos", async () => {
  await render(<AdminHomeScreen />);

  await fireEvent.press(screen.getByRole("button", { name: "Alunos" }));

  expect(mockRouter.push).toHaveBeenCalledWith("/admin/alunos");
});
