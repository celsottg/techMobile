import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("formata a data ISO no padrão curto pt-BR", () => {
    expect(formatDate("2026-06-30T12:00:00.000Z")).toBe("30/06/2026");
  });
});
