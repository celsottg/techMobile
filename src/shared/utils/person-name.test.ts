import { firstName, initials } from "./person-name";

describe("firstName", () => {
  it.each([
    ["Carlos Mendes", "Carlos"],
    ["Dr. Carlos Mendes", "Carlos"],
    ["dra Marina Souza", "Marina"],
    ["Prof. Dr. João Lima", "João"],
    ["Profa. Ana", "Ana"],
    // Um título sozinho é mantido, para não ficar sem nome.
    ["Dr.", "Dr."],
    ["", ""],
  ])("%p → %p", (name, expected) => {
    expect(firstName(name)).toBe(expected);
  });
});

describe("initials", () => {
  it.each([
    ["Ana Beatriz Silva", "AS"],
    ["Dr. Carlos Mendes", "CM"],
    ["carlos mendes", "CM"],
    ["Marina", "M"],
    ["  João   Pedro  ", "JP"],
    ["", "?"],
  ])("%p → %p", (name, expected) => {
    expect(initials(name)).toBe(expected);
  });
});
