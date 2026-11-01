import { Typography, type Theme } from "@/shared/theme";

// Cabeçalho azul institucional, igual em todos os Stacks das abas.
export function stackHeaderOptions(theme: Theme) {
  return {
    headerStyle: { backgroundColor: theme.primary },
    headerTintColor: theme.onPrimary,
    headerTitleStyle: {
      fontSize: Typography.heading.fontSize,
      fontWeight: Typography.heading.fontWeight,
      color: theme.onPrimary,
    },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: theme.background },
  } as const;
}
