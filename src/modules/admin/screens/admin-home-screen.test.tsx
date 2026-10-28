import { fireEvent, render, screen } from "@testing-library/react-native";

import { mockRouter } from "@/test/expo-router-mock";

import { AdminHomeScreen } from "./admin-home-screen";

jest.mock("expo-router", () => jest.requireActual("@/test/expo-router-mock").expoRouterMock);

it("lista as seções do admin e abre a de posts", async () => {
  await render(<AdminHomeScreen />);

  await fireEvent.press(screen.getByRole("button", { name: "Posts" }));

  expect(screen.getByText("Criar e gerenciar posts")).toBeTruthy();
  expect(mockRouter.push).toHaveBeenCalledWith("/admin/posts");
});

it("abre o cadastro de professores", async () => {
  await render(<AdminHomeScreen />);

  await fireEvent.press(screen.getByRole("button", { name: "Professores" }));

  expect(mockRouter.push).toHaveBeenCalledWith("/admin/professores/create");
});
