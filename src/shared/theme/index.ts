import { DefaultTheme } from "expo-router";

// Paleta oficial do app (ver "Cores" no CLAUDE.md). Não use hex soltos nas telas:
// consuma sempre estes tokens via useTheme().
export const Colors = {
  primary: "#2563EB", // botões, links e itens/posts selecionados
  onPrimary: "#FFFFFF", // texto e ícones sobre fundo primary
  background: "#F8FAFC", // fundo das telas
  card: "#FFFFFF", // cards de posts, campos e cabeçalhos
  text: "#0F172A", // texto principal
  textSecondary: "#475569", // texto secundário, placeholders e metadados
  border: "#E2E8F0",
  danger: "#DC2626",
} as const;

export type Theme = typeof Colors;

// Tema do React Navigation, para cabeçalhos e fundo do Stack usarem a mesma paleta.
export const NavigationTheme: ReactNavigation.Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.card,
    text: Colors.text,
    border: Colors.border,
  },
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export function useTheme(): Theme {
  return Colors;
}
