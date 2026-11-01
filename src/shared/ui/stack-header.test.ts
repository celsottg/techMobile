import { Colors } from "@/shared/theme";

import { stackHeaderOptions } from "./stack-header";

it("usa o azul institucional no cabeçalho e o branco no título e nos botões", () => {
  const options = stackHeaderOptions(Colors);

  expect(options.headerStyle.backgroundColor).toBe(Colors.primary);
  expect(options.headerTintColor).toBe(Colors.onPrimary);
  expect(options.headerTitleStyle.color).toBe(Colors.onPrimary);
  expect(options.contentStyle.backgroundColor).toBe(Colors.background);
});
