import { render, screen } from "@testing-library/react-native";

import { Avatar, initials } from "./avatar";

describe("initials", () => {
  it.each([
    ["Ana Beatriz Silva", "AS"],
    ["carlos mendes", "CM"],
    ["Marina", "M"],
    ["  João   Pedro  ", "JP"],
    ["", "?"],
  ])("%p → %p", (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});

it("mostra as iniciais do nome", async () => {
  await render(<Avatar name="Carlos Mendes" />);

  expect(screen.getByText("CM", { includeHiddenElements: true })).toBeTruthy();
});
