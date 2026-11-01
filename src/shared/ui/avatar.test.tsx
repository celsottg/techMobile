import { render, screen } from "@testing-library/react-native";

import { Avatar } from "./avatar";

it("mostra as iniciais do nome, sem título", async () => {
  await render(<Avatar name="Dr. Carlos Mendes" />);

  expect(screen.getByText("CM", { includeHiddenElements: true })).toBeTruthy();
});
