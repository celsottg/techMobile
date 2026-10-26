import { DefaultTheme } from "expo-router";

// Paleta oficial do app (ver "Cores" no CLAUDE.md). Não use hex soltos nas telas:
// consuma sempre estes tokens via useTheme().
export const Colors = {
  primary: "#34786B", // botões, links e destaques (ex.: post selecionado)
  onPrimary: "#FFFFFF", // texto e ícones sobre fundo primary
  primarySoft: "#E8F2EE", // destaque discreto, como etiquetas
  background: "#F4F7F5", // fundo das telas
  card: "#FFFFFF", // cartões, campo de busca e cabeçalhos
  text: "#24332F", // títulos e texto principal
  textSecondary: "#687671", // texto secundário, placeholders e metadados
  border: "#E1E9E4", // bordas
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
