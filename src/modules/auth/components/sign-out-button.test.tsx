import { fireEvent, render, screen } from "@testing-library/react-native";

import { useSession } from "@/shared/session";

import { SignOutButton } from "./sign-out-button";

jest.mock("@/shared/session");

it("encerra a sessão ao tocar em Sair", async () => {
  const signOut = jest.fn();
  jest.mocked(useSession).mockReturnValue({
    session: null,
    isLoading: false,
    signIn: jest.fn(),
    signOut,
  });
  await render(<SignOutButton />);

  await fireEvent.press(screen.getByRole("button", { name: "Sair" }));

  expect(signOut).toHaveBeenCalledTimes(1);
});
